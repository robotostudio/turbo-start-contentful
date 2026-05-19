import type { TypeBlog, TypeButton, TypePage } from "./contentful/types";

// Union type for page-like entries that have SEO fields
export type PageLikeEntry =
  | TypePage<"WITHOUT_UNRESOLVABLE_LINKS", string>
  | TypeBlog<"WITHOUT_UNRESOLVABLE_LINKS", string>;

// Helper to extract button URLs with internal link resolution
export function getButtonUrl(
  button: TypeButton<"WITHOUT_UNRESOLVABLE_LINKS", string>,
): string | null {
  if (!button?.fields) return null;

  // External URL
  if (button.fields.href) {
    return button.fields.href;
  }

  // Internal page reference for page links
  if (button.fields.internal?.fields?.slug) {
    if (button.fields.internal.sys.contentType.sys.id === "page") {
      return `/${button.fields.internal.fields.slug}`;
    }
    if (button.fields.internal.sys.contentType.sys.id === "blog") {
      return `/blog/${button.fields.internal.fields.slug}`;
    }
  }

  return null;
}
