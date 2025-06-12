import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const redirectUrl = searchParams.get("redirect") || "/";

    const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN;
    // Check if token matches the expected preview token
    if (token !== previewToken) {
      return new Response("Invalid token", { status: 401 });
    }

    const { enable } = await draftMode();
    enable();

    redirect(redirectUrl);
  } catch (error) {
    console.error("Preview mode error:", error);
    return new Response("Failed to enable preview mode", { status: 500 });
  }
}
