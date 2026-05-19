import { timingSafeEqual } from "node:crypto";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { draftToken } from "@/lib/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const path = searchParams.get("path") || "/";

  if (!token) {
    return new Response("Invalid token", { status: 401 });
  }

  if (token.length !== draftToken.length) {
    return new Response("Invalid token", { status: 401 });
  }

  if (!timingSafeEqual(Buffer.from(token), Buffer.from(draftToken))) {
    return new Response("Invalid token", { status: 401 });
  }

  (await draftMode()).enable();
  return redirect(path);
}
