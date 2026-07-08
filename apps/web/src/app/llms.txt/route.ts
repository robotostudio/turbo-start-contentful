import {
  getAllBlogs,
  getAllPageSlugs,
  getGlobalSettings,
} from "@/lib/contentful/query";

const HEADERS = {
  "content-type": "text/plain; charset=utf-8",
  "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
} as const;

function slugToTitle(slug: string): string {
  return (
    slug
      .replace(/^\//, "")
      .split("/")
      .filter(Boolean)
      .map((segment) =>
        segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      )
      .join(" / ") || "Home"
  );
}

export async function GET(): Promise<Response> {
  const [settings, slugs, blogs] = await Promise.allSettled([
    getGlobalSettings(),
    getAllPageSlugs(),
    getAllBlogs(),
  ]);

  if (settings.status === "rejected") {
    console.error("llms.txt: settings fetch failed", settings.reason);
  }
  if (slugs.status === "rejected") {
    console.error("llms.txt: page slugs fetch failed", slugs.reason);
  }
  if (blogs.status === "rejected") {
    console.error("llms.txt: blog fetch failed", blogs.reason);
  }

  const siteTitle =
    (settings.status === "fulfilled" && settings.value?.fields?.siteTitle) ||
    "Site";
  const siteDescription =
    (settings.status === "fulfilled" &&
      settings.value?.fields?.siteDescription) ||
    "";
  const pageSlugs = slugs.status === "fulfilled" ? slugs.value : [];
  const posts =
    blogs.status === "fulfilled"
      ? [blogs.value.featured, ...blogs.value.blogs]
      : [];

  const pageLines = [
    "- [Home](/index.md)",
    ...pageSlugs
      .filter((slug): slug is string => Boolean(slug))
      .map((slug) => {
        const path = slug.startsWith("/") ? slug : `/${slug}`;
        return `- [${slugToTitle(path)}](${path}.md)`;
      }),
  ];

  const blogLines = posts.flatMap((post) => {
    const slug = post?.fields?.slug?.trim();
    if (!slug) {
      return [];
    }
    const clean = slug.replace(/^\//, "");
    const title = post?.fields?.title ?? slugToTitle(clean);
    return [`- [${title}](/blog/${clean}.md)`];
  });

  const body = [
    `# ${siteTitle}`,
    ...(siteDescription ? [`> ${siteDescription}`] : []),
    "",
    "## For AI agents",
    "",
    "Every page is available as clean Markdown. Append `.md` to any URL (e.g.",
    "`/about.md`) or send `Accept: text/markdown` against the canonical URL.",
    "Page-builder blocks are serialized to semantic Markdown, so no component",
    "markup leaks. For the entire site as one document, fetch `/llms-full.txt`.",
    "",
    "## Pages",
    ...pageLines,
    "",
    "## Blog",
    ...blogLines,
  ].join("\n");

  return new Response(`${body}\n`, { headers: HEADERS });
}
