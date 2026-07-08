import {
  blogIndexToMarkdown,
  blogPostToMarkdown,
  getAllBlogs,
  getBlogBySlug,
  getPageBySlugForMarkdown,
  pageToMarkdown,
} from "@/lib/markdown";
import { normalizeMarkdownPath } from "@/lib/markdown-path";

async function buildMarkdown(path: string): Promise<string | null> {
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0) {
    const home = await getPageBySlugForMarkdown("/");
    return home ? pageToMarkdown(home) : null;
  }

  if (segments[0] === "blog") {
    if (segments.length === 1) {
      const { featured, blogs } = await getAllBlogs(false);
      return blogIndexToMarkdown(featured, blogs);
    }
    const blog = await getBlogBySlug(segments.slice(1).join("/"), false);
    return blog ? blogPostToMarkdown(blog) : null;
  }

  const page = await getPageBySlugForMarkdown(path);
  return page ? pageToMarkdown(page) : null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> },
): Promise<Response> {
  // The content path lives in the URL (`/api/markdown/blog/post`) — the proxy
  // rewrites `.md`/`Accept` requests here, and it also works directly.
  const { path: segments = [] } = await params;
  const path = normalizeMarkdownPath(`/${segments.join("/")}`);

  let markdown: string | null;
  try {
    markdown = await buildMarkdown(path);
  } catch (error) {
    // A fetch failure must not look like a missing page (404 reads as "gone").
    console.error("Markdown build failed", error);
    return new Response("Upstream content fetch failed\n", {
      status: 503,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        vary: "Accept",
        "x-content-type-options": "nosniff",
      },
    });
  }

  // Only a null document is "not found"; an empty string is a real (if empty) page.
  if (markdown !== null) {
    return new Response(markdown, {
      status: 200,
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        // Same URL serves HTML or Markdown by Accept; canonical HTML page is
        // Content-Location, and the Markdown twin is kept out of search.
        vary: "Accept",
        "content-location": path,
        "x-robots-tag": "noindex, nofollow",
        "x-content-type-options": "nosniff",
        "cache-control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  }

  return new Response(`Not found: ${path}\n`, {
    status: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      vary: "Accept",
      "x-content-type-options": "nosniff",
    },
  });
}

// HEAD reuses GET so proxied HEAD requests get identical headers/status
// (explicit rather than relying on Next's implicit GET→HEAD fallback).
export { GET as HEAD };
