import { draftMode } from "next/headers";

export async function GET() {
  const { isEnabled: preview } = await draftMode();
  return new Response(preview ? "true" : "false");
}
