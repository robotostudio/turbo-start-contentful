import { timingSafeEqual } from "node:crypto";

import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

import { previewSecret, vercelBypassSecret } from "@/lib/env";
import { SAFE_PATH_RE } from "@/lib/url";

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

// JWT utilities
interface VercelJwt {
  bypass: string;
  aud: string;
  sub: string;
  iat: number;
}

function getVercelJwtCookie(request: Request): string | undefined {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return undefined;

  const cookieMap = cookieHeader.split(";").reduce(
    (acc, cookie) => {
      const parts = cookie.trim().split("=");
      const name = parts[0];
      const value = parts[1];
      if (name && value) {
        acc[name] = value;
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  return cookieMap["_vercel_jwt"];
}

function parseVercelJwtCookie(vercelJwtCookie: string): VercelJwt {
  const base64Payload = vercelJwtCookie.split(".")[1];
  if (!base64Payload) {
    throw new Error("Malformed `_vercel_jwt` cookie value");
  }

  // A4: use Buffer.from with base64url encoding — handles all padding/char substitutions
  const payload = Buffer.from(base64Payload, "base64url").toString("utf-8");
  const vercelJwt = JSON.parse(payload);

  if (typeof vercelJwt.bypass !== "string") {
    throw new TypeError("'bypass' property in VercelJwt is not a string");
  }
  if (typeof vercelJwt.aud !== "string") {
    throw new TypeError("'aud' property in VercelJwt is not a string");
  }
  if (typeof vercelJwt.sub !== "string") {
    throw new TypeError("'sub' property in VercelJwt is not a string");
  }
  if (typeof vercelJwt.iat !== "number") {
    throw new TypeError("'iat' property in VercelJwt is not a number");
  }

  return vercelJwt;
}

// URL utilities
interface ParsedUrl {
  origin: string;
  path: string;
  host: string;
  bypassToken: string;
  contentfulPreviewSecret: string;
}

function parseRequestUrl(requestUrl: string): ParsedUrl {
  if (!requestUrl) {
    throw new Error("missing `url` value in request");
  }

  const { searchParams, origin, host } = new URL(requestUrl);
  const rawPath = searchParams.get("path") || "";
  const bypassToken = searchParams.get("x-vercel-protection-bypass") || "";
  const contentfulPreviewSecret =
    searchParams.get("x-contentful-preview-secret") || "";

  // A2: validate path after decoding — reject open-redirect attempts
  const decoded = decodeURIComponent(rawPath);
  const path = SAFE_PATH_RE.test(decoded) ? decoded : "";

  return { origin, path, host, bypassToken, contentfulPreviewSecret };
}

function buildRedirectUrl({
  path,
  base,
  bypassTokenFromQuery,
}: {
  path: string;
  base: string;
  bypassTokenFromQuery?: string;
}): string {
  const redirectUrl = new URL(path, base);

  if (bypassTokenFromQuery) {
    redirectUrl.searchParams.set(
      "x-vercel-protection-bypass",
      bypassTokenFromQuery,
    );
    redirectUrl.searchParams.set("x-vercel-set-bypass-cookie", "samesitenone");
  }

  return redirectUrl.toString();
}

// Authentication helpers

// A3: dev mode still requires the Contentful preview secret; skips only the
// Vercel JWT cookie check since Vercel edge is not in front of local dev.
async function handleDevelopmentMode(
  path: string,
  base: string,
  bypassTokenFromQuery: string,
  contentfulPreviewSecretFromQuery: string,
) {
  if (!previewSecret) {
    return new Response("Preview service not configured", { status: 503 });
  }
  if (!safeEqual(contentfulPreviewSecretFromQuery, previewSecret)) {
    return new Response("Forbidden", { status: 403 });
  }

  (await draftMode()).enable();
  const cookieStore = await cookies();
  const cookie = cookieStore.get("__prerender_bypass");

  cookieStore.set({
    name: "__prerender_bypass",
    value: cookie?.value || "",
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none",
  });

  const redirectUrl = buildRedirectUrl({ path, base, bypassTokenFromQuery });
  return redirect(redirectUrl);
}

// A5: when a query token is present we do NOT return early — we fall through to
// cookie parsing so the cookie's `aud` is what gets host-checked. If no valid
// cookie exists, fail 401. This prevents leaked query tokens from working from
// arbitrary hosts.
function getAuthCredentials(
  request: Request,
  bypassTokenFromQuery: string,
  contentfulPreviewSecretFromQuery: string,
):
  | { bypassToken: string; aud: string; vercelJwtCookie: string | undefined }
  | Response {
  const vercelJwtCookie = getVercelJwtCookie(request);

  if (!vercelJwtCookie) {
    return new Response(
      "Missing _vercel_jwt cookie required for authorization bypass",
      { status: 401 },
    );
  }

  try {
    const vercelJwt = parseVercelJwtCookie(vercelJwtCookie);
    // When a query token is present, prefer it for the bypass check but keep
    // the cookie-derived aud so host-binding is enforced.
    const effectiveBypassToken =
      bypassTokenFromQuery ||
      contentfulPreviewSecretFromQuery ||
      vercelJwt.bypass;
    return {
      bypassToken: effectiveBypassToken,
      aud: vercelJwt.aud,
      vercelJwtCookie,
    };
  } catch (e) {
    if (!(e instanceof Error)) throw e;
    return new Response(
      "Malformed bypass authorization token in _vercel_jwt cookie",
      { status: 401 },
    );
  }
}

function validateAuth(
  bypassToken: string,
  contentfulPreviewSecretFromQuery: string,
  aud: string,
  host: string,
): Response | null {
  if (!vercelBypassSecret || !previewSecret) {
    return new Response("Preview service not configured", { status: 503 });
  }
  if (
    !safeEqual(bypassToken, vercelBypassSecret) &&
    !safeEqual(contentfulPreviewSecretFromQuery, previewSecret)
  ) {
    return new Response(
      "The bypass token you are authorized with does not match the bypass secret for this deployment. You might need to redeploy or go back and try the link again.",
      { status: 403 },
    );
  }

  if (aud !== host) {
    return new Response(
      `The bypass token you are authorized with is not valid for this host (${host}). You might need to redeploy or go back and try the link again.`,
      { status: 403 },
    );
  }

  return null;
}

// Main draft handler
export async function GET(request: Request) {
  const {
    origin: base,
    path,
    host,
    bypassToken: bypassTokenFromQuery,
    contentfulPreviewSecret: contentfulPreviewSecretFromQuery,
  } = parseRequestUrl(request.url);

  // A2: reject missing/invalid path before any auth work runs
  if (!path) {
    return new Response("Missing required value for query parameter `path`", {
      status: 400,
    });
  }

  if (process.env.NODE_ENV === "development") {
    return handleDevelopmentMode(
      path,
      base,
      bypassTokenFromQuery,
      contentfulPreviewSecretFromQuery,
    );
  }

  const authResult = getAuthCredentials(
    request,
    bypassTokenFromQuery,
    contentfulPreviewSecretFromQuery,
  );

  if (authResult instanceof Response) {
    return authResult;
  }

  const { bypassToken, aud, vercelJwtCookie } = authResult;

  const authError = validateAuth(
    bypassToken,
    contentfulPreviewSecretFromQuery,
    aud,
    host,
  );
  if (authError) return authError;

  (await draftMode()).enable();
  const bypassTokenForRedirect = vercelJwtCookie
    ? undefined
    : bypassTokenFromQuery;
  const redirectUrl = buildRedirectUrl({
    path,
    base,
    ...(bypassTokenForRedirect !== undefined && {
      bypassTokenFromQuery: bypassTokenForRedirect,
    }),
  });

  return redirect(redirectUrl);
}
