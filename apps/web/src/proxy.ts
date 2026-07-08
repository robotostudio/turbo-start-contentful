import { type NextRequest, NextResponse } from "next/server";

import { normalizeMarkdownPath, prefersMarkdown } from "@/lib/markdown-path";

/**
 * Content negotiation for Markdown: a `.md` URL or `Accept: text/markdown` is
 * rewritten to the `/api/markdown` route handler; everything else passes through
 * untouched (the global CSP / `X-Frame-Options` headers in `next.config.ts` are
 * unaffected). The Markdown route sets `Vary: Accept` so a shared cache never
 * serves Markdown to a browser; the `.md` suffix is the cache-safe surface.
 */
export function proxy(request: NextRequest): NextResponse {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const hasMdSuffix = pathname.endsWith(".md");
  const wantsMarkdown =
    hasMdSuffix || prefersMarkdown(request.headers.get("accept") ?? "");

  if (!wantsMarkdown) {
    return NextResponse.next();
  }

  const rawPath = hasMdSuffix ? pathname.slice(0, -3) : pathname;

  // Header negotiation: skip asset files (e.g. a `.png` with a broad Accept).
  const lastSegment = rawPath.split("/").pop() ?? "";
  if (!hasMdSuffix && lastSegment.includes(".")) {
    return NextResponse.next();
  }

  const contentPath = normalizeMarkdownPath(rawPath);

  // Embed the path in the rewrite target so the catch-all route reads it from
  // the URL (`/api/markdown/blog/post`); root maps to `/api/markdown`.
  const url = request.nextUrl.clone();
  url.pathname =
    contentPath === "/" ? "/api/markdown" : `/api/markdown${contentPath}`;
  url.search = "";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!api/|_next/|favicon.ico|robots.txt|sitemap.xml|llms\\.txt|llms-full\\.txt).*)",
  ],
};
