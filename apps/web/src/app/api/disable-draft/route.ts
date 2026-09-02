import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { SAFE_PATH_RE } from "@/lib/url";

export async function GET(request: NextRequest) {
  const params = new URLSearchParams(request.nextUrl.searchParams);
  const rawSlug = params.get("slug") || "/";
  const redirectUrl = SAFE_PATH_RE.test(rawSlug) ? rawSlug : "/";

  (await draftMode()).disable();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  redirect(redirectUrl);
}
