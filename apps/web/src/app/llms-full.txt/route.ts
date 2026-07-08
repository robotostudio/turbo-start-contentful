import { getGlobalSettings } from "@/lib/contentful/query";
import {
  blogPostToMarkdown,
  getAllBlogs,
  getAllPagesForMarkdown,
  pageToMarkdown,
} from "@/lib/markdown";

const HEADERS = {
  "content-type": "text/plain; charset=utf-8",
  "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
} as const;

export async function GET(): Promise<Response> {
  const [settings, pages, blogs] = await Promise.allSettled([
    getGlobalSettings(),
    getAllPagesForMarkdown(),
    getAllBlogs(),
  ]);

  if (pages.status === "rejected") {
    console.error("llms-full.txt: pages fetch failed", pages.reason);
  }
  if (blogs.status === "rejected") {
    console.error("llms-full.txt: blog fetch failed", blogs.reason);
  }

  const siteTitle =
    (settings.status === "fulfilled" && settings.value?.fields?.siteTitle) ||
    "Site";

  // Home (slug "/") first, then the rest of the pages.
  const pageDocs =
    pages.status === "fulfilled"
      ? [...pages.value].sort((a, b) => {
          if (a.fields.slug === "/") return -1;
          if (b.fields.slug === "/") return 1;
          return 0;
        })
      : [];
  const blogDocs =
    blogs.status === "fulfilled"
      ? [blogs.value.featured, ...blogs.value.blogs].filter(
          (blog): blog is NonNullable<typeof blog> => Boolean(blog),
        )
      : [];

  const sections = [
    ...pageDocs.map((page) => pageToMarkdown(page)),
    ...blogDocs.map((blog) => blogPostToMarkdown(blog)),
  ].filter((section) => section.trim());

  const header = [
    `# ${siteTitle} - Complete Content`,
    "",
    `> This file contains all content from ${siteTitle} in Markdown format.`,
    "> Optimized for LLM consumption and RAG systems.",
  ].join("\n");

  const body = [header, ...sections].join("\n\n---\n\n");
  return new Response(`${body}\n`, { headers: HEADERS });
}
