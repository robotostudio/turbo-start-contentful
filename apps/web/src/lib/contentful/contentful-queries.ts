import { getClient } from "../contentful";
import {
  type ButtonFields,
  type CallToActionFields,
  type HeroFields,
  type PageFields,
  transformCollection,
  transformEntry,
} from "./contentful-serializer";

/**
 * Clean, simple functions for fetching and transforming Contentful data
 * No complex skeletons or type gymnastics - just straightforward data fetching
 */

/**
 * Fetch all pages
 */
export async function getPages(preview = false) {
  const client = getClient(preview);

  try {
    const response = await client.getEntries({
      content_type: "page",
      include: 2,
    });

    return transformCollection<PageFields>(response);
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
    console.log("🚀 ~ getPageBySlug ~ entry:", entry.fields);

    return transformEntry<PageFields>(entry);
  } catch (error) {
    console.error("Error fetching page:", error);
    throw new Error(`Failed to fetch page with slug: ${slug}`);
  }
}

/**
 * Generic function to fetch any content type
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
    return transformCollection(response);
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

    return transformCollection(response);
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

    const transformed = transformCollection(response);

    return {
      ...transformed,
      pagination: {
        page,
        pageSize,
        totalPages: Math.ceil(transformed.total / pageSize),
        hasNextPage: skip + pageSize < transformed.total,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching paginated content:", error);
    throw new Error(`Failed to fetch paginated content for: ${contentType}`);
  }
}
