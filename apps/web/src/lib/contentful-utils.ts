import type {
  ButtonSkeleton,
  CallToActionSkeleton,
  FaqAccordionSkeleton,
  FeatureCardsSkeleton,
  HeroSkeleton,
  PageSkeleton,
} from "./contentful-queries";
import type { SerializedAsset, SerializedEntry } from "./contentful-serializer";

// Type guards for page builder components
export function isHeroBlock(
  block: SerializedEntry,
): block is SerializedEntry & { contentType: "hero" } {
  return block.contentType === "hero";
}

export function isCallToActionBlock(
  block: SerializedEntry,
): block is SerializedEntry & { contentType: "callToAction" } {
  return block.contentType === "callToAction";
}

export function isFaqAccordionBlock(
  block: SerializedEntry,
): block is SerializedEntry & { contentType: "faqAccordion" } {
  return block.contentType === "faqAccordion";
}

export function isFeatureCardsBlock(
  block: SerializedEntry,
): block is SerializedEntry & { contentType: "featureCards" } {
  return block.contentType === "featureCards";
}

// Helper to filter page builder blocks by type
export function getBlocksByType<T extends SerializedEntry>(
  blocks: SerializedEntry[] | undefined,
  typeguard: (block: SerializedEntry) => block is T,
): T[] {
  if (!blocks) return [];
  return blocks.filter(typeguard);
}

// Specific getters for each block type
export function getHeroBlocks(blocks: SerializedEntry[] | undefined) {
  return getBlocksByType(blocks, isHeroBlock);
}

export function getCallToActionBlocks(blocks: SerializedEntry[] | undefined) {
  return getBlocksByType(blocks, isCallToActionBlock);
}

export function getFaqAccordionBlocks(blocks: SerializedEntry[] | undefined) {
  return getBlocksByType(blocks, isFaqAccordionBlock);
}

export function getFeatureCardsBlocks(blocks: SerializedEntry[] | undefined) {
  return getBlocksByType(blocks, isFeatureCardsBlock);
}

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

// Helper to get optimized image URL with transformations
export function getOptimizedImageUrl(
  asset: SerializedAsset | null | undefined,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "webp" | "jpg" | "png";
  } = {},
): string | null {
  if (!asset?.url) return null;

  const { width, height, quality = 80, format } = options;
  const url = new URL(asset.url);

  // Add Contentful image transformation parameters
  if (width) url.searchParams.set("w", width.toString());
  if (height) url.searchParams.set("h", height.toString());
  if (quality) url.searchParams.set("q", quality.toString());
  if (format) url.searchParams.set("fm", format);

  return url.toString();
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

// Helper to find the first hero block in page builder
export function getPageHero(pageBuilder: SerializedEntry[] | undefined) {
  const heroBlocks = getHeroBlocks(pageBuilder);
  return heroBlocks.length > 0 ? heroBlocks[0] : null;
}

// Helper to get all buttons from a page (from all page builder blocks)
export function getAllPageButtons(
  pageBuilder: SerializedEntry[] | undefined,
): any[] {
  if (!pageBuilder) return [];

  const buttons: any[] = [];

  pageBuilder.forEach((block) => {
    if (block.fields?.buttons && Array.isArray(block.fields.buttons)) {
      buttons.push(...block.fields.buttons);
    }
  });

  return buttons;
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

// Helper to group page builder blocks by type
export function groupPageBuilderBlocks(
  pageBuilder: SerializedEntry[] | undefined,
) {
  if (!pageBuilder) return {};

  return {
    hero: getHeroBlocks(pageBuilder),
    callToAction: getCallToActionBlocks(pageBuilder),
    faqAccordion: getFaqAccordionBlocks(pageBuilder),
    featureCards: getFeatureCardsBlocks(pageBuilder),
  };
}
