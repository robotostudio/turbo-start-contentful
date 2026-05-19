import { timingSafeEqual } from "node:crypto";

import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { revalidationSecret } from "@/lib/env";

const bodySchema = z
  .object({
    path: z
      .string()
      .regex(/^\/[A-Za-z0-9/_-]*$/)
      .optional(),
    tag: z
      .string()
      .regex(/^[A-Za-z0-9_-]+$/)
      .optional(),
  })
  .refine((v) => v.path || v.tag, { message: "path or tag required" });

export async function POST(request: Request) {
  const requestHeaders = new Headers(request.headers);
  const secret = requestHeaders.get("x-vercel-revalidation-key");

  if (!secret || !revalidationSecret) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  if (secret.length !== revalidationSecret.length) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  if (!timingSafeEqual(Buffer.from(secret), Buffer.from(revalidationSecret))) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  const rawBody = await (async () => {
    try {
      return await request.json();
    } catch {
      return null;
    }
  })();

  if (!rawBody) {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 },
    );
  }

  const { path, tag } = parsed.data;

  if (path) {
    revalidatePath(path);
  }

  if (tag) {
    revalidateTag(tag, {});
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
