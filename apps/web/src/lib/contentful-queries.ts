import type { EntrySkeletonType } from "contentful";

import type {
  Button,
  CallToAction,
  Faq,
  FaqAccordion,
  FeatureCard,
  FeatureCards,
  Hero,
  Page,
} from "../../contentfulTypes";
import { getClient } from "./contentful";
import { serializeCollection, serializeEntry } from "./contentful-serializer";

// Define content type skeletons based on your contentfulTypes.d.ts
export interface ButtonSkeleton extends EntrySkeletonType {
  contentTypeId: "button";
  fields: Button;
}

export interface CallToActionSkeleton extends EntrySkeletonType {
  contentTypeId: "callToAction";
  fields: CallToAction;
}

export interface FaqSkeleton extends EntrySkeletonType {
  contentTypeId: "faq";
  fields: Faq;
}

export interface FaqAccordionSkeleton extends EntrySkeletonType {
  contentTypeId: "faqAccordion";
  fields: FaqAccordion;
}

export interface FeatureCardSkeleton extends EntrySkeletonType {
  contentTypeId: "featureCard";
  fields: FeatureCard;
}

export interface FeatureCardsSkeleton extends EntrySkeletonType {
  contentTypeId: "featureCards";
  fields: FeatureCards;
}

export interface HeroSkeleton extends EntrySkeletonType {
  contentTypeId: "hero";
  fields: Hero;
}

export interface PageSkeleton extends EntrySkeletonType {
  contentTypeId: "page";
  fields: Page;
}

// Union type for page builder blocks
export type PageBuilderSkeleton =
  | HeroSkeleton
  | CallToActionSkeleton
  | FaqAccordionSkeleton
  | FeatureCardsSkeleton;

/**
 * Fetch all pages with serialization
 */
export async function getPages(preview = false) {
  const client = getClient(preview);

  try {
    const response = await client.getEntries<PageSkeleton>({
      content_type: "page",
      include: 2,
    });

    return serializeCollection(response);
  } catch (error) {
    console.error("Error fetching pages:", error);
    throw new Error("Failed to fetch pages");
  }
}

/**
 * Fetch a single page by slug
 */
export async function getPageBySlug(slug: string, preview = false) {
  const client = getClient(preview);

  try {
    const response = await client.getEntries({
      content_type: "page",
      include: 2,
      limit: 1,
      "fields.slug": slug,
    });

    if (!response.items.length) {
      return null;
    }

    const entry = response.items[0];
    if (!entry) {
      return null;
    }

    return serializeEntry(entry);
  } catch (error) {
    console.error("Error fetching page:", error);
    throw new Error(`Failed to fetch page with slug: ${slug}`);
  }
}

/**
 * Generic function to fetch any content type with serialization
 */
export async function getContentByType(
  contentType: string,
  options: {
    preview?: boolean;
    limit?: number;
    skip?: number;
    order?: string[];
    filters?: Record<string, any>;
  } = {},
) {
  const {
    preview = false,
    limit = 100,
    skip = 0,
    order,
    filters = {},
  } = options;
  const client = getClient(preview);

  try {
    const queryParams = {
      content_type: contentType,
      include: 2,
      limit,
      skip,
      ...(order && { order }),
      ...filters,
    };

    const response = await client.getEntries(queryParams);
    return serializeCollection(response);
  } catch (error) {
    console.error(`Error fetching content type ${contentType}:`, error);
    throw new Error(`Failed to fetch content type: ${contentType}`);
  }
}

/**
 * Search content across multiple content types
 */
export async function searchContent(query: string, preview = false) {
  const client = getClient(preview);

  try {
    const response = await client.getEntries({
      query,
      include: 2,
      limit: 20,
    });

    return serializeCollection(response);
  } catch (error) {
    console.error("Error searching content:", error);
    throw new Error("Failed to search content");
  }
}

/**
 * Fetch content with pagination
 */
export async function getContentWithPagination(
  contentType: string,
  page = 1,
  pageSize = 10,
  preview = false,
) {
  const client = getClient(preview);
  const skip = (page - 1) * pageSize;

  try {
    const response = await client.getEntries({
      content_type: contentType,
      include: 2,
      limit: pageSize,
      skip,
    });

    const serialized = serializeCollection(response);

    return {
      ...serialized,
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(serialized.total / pageSize),
        hasNextPage: skip + pageSize < serialized.total,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching paginated content:", error);
    throw new Error(`Failed to fetch paginated content for: ${contentType}`);
  }
}
