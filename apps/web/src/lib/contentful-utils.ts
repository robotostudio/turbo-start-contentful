// Helper to extract button URLs with internal link resolution
export function getButtonUrl(button: any): string | null {
  if (!button?.fields) return null;

  // External URL
  if (button.fields.href) {
    return button.fields.href;
  }

  // Internal page reference
  if (button.fields.internal?.fields?.slug) {
    return `/${button.fields.internal.fields.slug}`;
  }

  return null;
}

// Helper to extract rich text as plain text (basic implementation)
export function getRichTextAsPlainText(richText: any): string {
  if (!richText?.content) return "";

  function extractText(node: any): string {
    if (node.nodeType === "text") {
      return node.value || "";
    }

    if (node.content && Array.isArray(node.content)) {
      return node.content.map(extractText).join("");
    }

    return "";
  }

  return richText.content.map(extractText).join(" ").trim();
}

// SEO helpers
export function getPageSeoData(page: any) {
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
export function validatePageContent(page: any): {
  isValid: boolean;
  errors: string[];
} {
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
