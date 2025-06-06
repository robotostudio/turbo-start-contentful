import type {
  Block,
  Document,
  Inline,
  Text,
} from "@contentful/rich-text-types";

import type { TypeBlog, TypeButton, TypePage } from "./contentful/types";

// Union type for page-like entries that have SEO fields
type PageLikeEntry =
  | TypePage<"WITHOUT_UNRESOLVABLE_LINKS", string>
  | TypeBlog<"WITHOUT_UNRESOLVABLE_LINKS", string>;

// Rich text node types for processing
interface RichTextNode {
  nodeType: string;
  value?: string;
  content?: RichTextNode[];
}

interface RichTextDocument {
  content: RichTextNode[];
  nodeType: string;
  data: Record<string, unknown>;
}

// SEO data interface
interface SeoData {
  title: string;
  description: string;
  image?: unknown; // Using unknown since we can receive either AssetLink or resolved Asset
  noIndex: boolean;
  ogTitle: string;
  ogDescription: string;
}

// Content validation result interface
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

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

// Helper to extract rich text as plain text (basic implementation)
export function getRichTextAsPlainText(
  richText: Document | RichTextDocument | null | undefined,
): string {
  if (!richText?.content) return "";

  function extractText(node: RichTextNode | Block | Inline | Text): string {
    if (node.nodeType === "text") {
      return (node as Text).value || "";
    }

    if ("content" in node && Array.isArray(node.content)) {
      return node.content.map(extractText).join("");
    }

    return "";
  }

  return richText.content.map(extractText).join(" ").trim();
}

// SEO helpers
export function getPageSeoData(
  page: PageLikeEntry | null | undefined,
): SeoData | null {
  if (!page?.fields) return null;

  const { title, description, seoTitle, seoDescription, seoImage, seoNoIndex } =
    page.fields;

  return {
    title: seoTitle || title || "",
    description: seoDescription || description || "",
    image: seoImage,
    noIndex: seoNoIndex || false,
    ogTitle: seoTitle || title || "",
    ogDescription: seoDescription || description || "",
  };
}

// Content validation helpers
export function validatePageContent(
  page: PageLikeEntry | null | undefined,
): ValidationResult {
  const errors: string[] = [];

  if (!page?.fields) {
    errors.push("Page data is missing");
    return { isValid: false, errors };
  }

  const { title, slug, description } = page.fields;

  if (!title) errors.push("Page title is required");
  if (!slug) errors.push("Page slug is required");
  if (!description) errors.push("Page description is required");

  // Validate slug format (basic check)
  if (slug && !/^[a-z0-9-]+$/.test(slug)) {
    errors.push(
      "Page slug should only contain lowercase letters, numbers, and hyphens",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
