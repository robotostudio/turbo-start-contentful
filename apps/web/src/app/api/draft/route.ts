import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

const PREVIEW_TOKEN = process.env.CONTENTFUL_DRAFT_TOKEN;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const path = searchParams.get("path") || "/";

  if (token !== PREVIEW_TOKEN) {
    return new Response("Invalid token", { status: 401 });
  }

  (await draftMode()).enable();
  redirect(path);
}
