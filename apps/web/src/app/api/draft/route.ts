import { timingSafeEqual } from "node:crypto";

import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

import { draftToken } from "@/lib/env";
import { SAFE_PATH_RE } from "@/lib/url";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const rawPath = searchParams.get("path") || "/";
  const path = SAFE_PATH_RE.test(rawPath) ? rawPath : "/";

  if (!token) {
    return new Response("Invalid token", { status: 401 });
  }

  const tokenBuf = Buffer.from(token);
  const draftBuf = Buffer.from(draftToken);

  if (tokenBuf.length !== draftBuf.length) {
    return new Response("Invalid token", { status: 401 });
  }

  if (!timingSafeEqual(tokenBuf, draftBuf)) {
    return new Response("Invalid token", { status: 401 });
  }

  (await draftMode()).enable();
  return redirect(path);
}
