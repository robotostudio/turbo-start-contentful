/**
 * Document-level Markdown assembly for the content-negotiation surface.
 *
 * Fetches are done with `getClient(false)` (always published) and return `null`
 * for a genuinely missing document while letting real upstream errors throw —
 * so the route can distinguish `404` (missing) from `503` (fetch failure).
 * `getBlogBySlug` already has that shape, so it is reused directly.
 */

import { getClient } from "./contentful/client";
import {
  type MarkdownPageBuilder,
  pageBuilderToMarkdown,
} from "./contentful/page-builder-to-markdown";
import { getAllBlogs, getBlogBySlug } from "./contentful/query";
import {
  assetToMarkdown,
  escapeMarkdown,
  type MarkdownAsset,
  richTextToMarkdown,
} from "./contentful/rich-text-to-markdown";
import type { TypeBlog, TypePage, TypePageSkeleton } from "./contentful/types";

type Links = "WITHOUT_UNRESOLVABLE_LINKS";
type PageDoc = TypePage<Links, string>;
type BlogDoc = TypeBlog<Links, string>;

/** Fetches a page by slug, returning `null` when none exists (errors throw). */
export async function getPageBySlugForMarkdown(
  slug: string,
): Promise<PageDoc | null> {
  const res = await getClient(false).getEntries<TypePageSkeleton>({
    content_type: "page",
    "fields.slug": slug,
    include: 10,
    limit: 1,
  });
  return res.items[0] ?? null;
}

/** Fetches every page with full fields — used to assemble `llms-full.txt`. */
export async function getAllPagesForMarkdown(): Promise<PageDoc[]> {
  const client = getClient(false);
  const all: PageDoc[] = [];
  const limit = 100;
  let skip = 0;
  let total = Infinity;
  // Paginate so pages beyond the first batch aren't dropped.
  while (skip < total) {
    const res = await client.getEntries<TypePageSkeleton>({
      content_type: "page",
      include: 10,
      limit,
      skip,
    });
    all.push(...res.items);
    total = res.total;
    if (res.items.length === 0) break;
    skip += res.items.length;
  }
  return all;
}

export { getAllBlogs, getBlogBySlug };

function joinSections(sections: Array<string | null | undefined>): string {
  return sections.filter((section) => section?.trim()).join("\n\n");
}

function withTrailingNewline(
  sections: Array<string | null | undefined>,
): string {
  const body = joinSections(sections);
  return body ? `${body}\n` : "";
}

function documentHeader(
  title?: string | null,
  description?: string | null,
): string {
  const t = title?.trim();
  const d = description?.trim();
  return joinSections([
    t ? `# ${escapeMarkdown(t)}` : "",
    d ? escapeMarkdown(d) : "",
  ]);
}

export function pageToMarkdown(page: PageDoc): string {
  const f = page.fields;
  return withTrailingNewline([
    documentHeader(f?.title, f?.description),
    pageBuilderToMarkdown(f?.pageBuilder as MarkdownPageBuilder),
  ]);
}

export function blogPostToMarkdown(blog: BlogDoc): string {
  const f = blog.fields;
  return withTrailingNewline([
    documentHeader(f?.title, f?.description),
    assetToMarkdown(f?.image as MarkdownAsset | undefined),
    richTextToMarkdown(f?.richText),
    pageBuilderToMarkdown(f?.pageBuilder as MarkdownPageBuilder),
  ]);
}

export function blogIndexToMarkdown(
  featured: BlogDoc | undefined,
  blogs: BlogDoc[],
): string {
  // Featured first, then the (already `-publishedDate`-ordered) list — matching
  // the HTML index.
  const list = [featured, ...blogs]
    .map((post) => {
      const title = post?.fields?.title?.trim();
      const slug = post?.fields?.slug?.trim();
      if (!title || !slug) {
        return null;
      }
      return `- [${escapeMarkdown(title)}](/blog/${slug.replace(/^\//, "")})`;
    })
    .filter(Boolean)
    .join("\n");

  return withTrailingNewline([
    "# Blog",
    list ? `## Latest posts\n\n${list}` : "",
  ]);
}
