import type { ApolloClient } from "@apollo/client";

import type {
  CallToAction,
  CallToActionCollection,
  Hero,
  HeroCollection,
  Page,
  PageCollection,
} from "../../__generated__/graphql";
import { getClient } from "./client";
import {
  GET_CALL_TO_ACTIONS,
  GET_HEROES,
  GET_PAGE_BY_SLUG,
  GET_PAGES,
  SEARCH_CONTENT,
} from "./query";

interface ServiceOptions {
  preview?: boolean;
}

interface PaginatedResult<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

interface GetPageBySlugParams {
  slug: string;
  preview?: boolean;
}

interface SearchContentParams {
  query: string;
  preview?: boolean;
}

/**
 * Fetch all pages
 */
export async function getPages(
  options: ServiceOptions = {},
): Promise<PaginatedResult<Page>> {
  const { preview = false } = options;

  const client = getClient(preview);
  try {
    const result = await client.query({
      query: GET_PAGES,
      variables: { preview },
      errorPolicy: "all",
      fetchPolicy: preview ? "no-cache" : "cache-first",
    });

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
    }

    const collection = result.data?.pageCollection as PageCollection;
    if (!collection) {
      throw new Error("Page collection not found in response");
    }

    return {
      items:
        collection.items?.filter(
          (item: Page | null): item is Page => item !== null,
        ) ?? [],
      total: collection.total ?? 0,
      skip: collection.skip ?? 0,
      limit: collection.limit ?? 0,
    };
  } catch (error) {
    console.error("Error fetching pages:", error);
    throw new Error("Failed to fetch pages");
  }
}

/**
 * Fetch a single page by slug
 */
export async function getPageBySlug(
  params: GetPageBySlugParams,
): Promise<Page | null> {
  const { slug, preview = false } = params;

  if (!slug) {
    throw new Error("Slug is required");
  }

  const client = getClient(preview);

  try {
    const result = await client.query({
      query: GET_PAGE_BY_SLUG,
      variables: { slug, preview },
      errorPolicy: "all",
      fetchPolicy: preview ? "no-cache" : "cache-first",
    });

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
    }

    const collection = result.data?.pageCollection as PageCollection;
    if (!collection) {
      return null;
    }

    return collection.items?.[0] ?? null;
  } catch (error) {
    console.error(`Error fetching page with slug ${slug}:`, error);
    throw new Error(`Failed to fetch page: ${slug}`);
  }
}

/**
 * Search content
 */
export async function searchContent(
  client: ApolloClient<unknown>,
  params: SearchContentParams,
): Promise<PaginatedResult<Page>> {
  const { query: searchQuery, preview = false } = params;

  if (!searchQuery.trim()) {
    return {
      items: [],
      total: 0,
      skip: 0,
      limit: 20,
    };
  }

  try {
    const result = await client.query({
      query: SEARCH_CONTENT,
      variables: { preview },
      errorPolicy: "all",
      fetchPolicy: preview ? "no-cache" : "cache-first",
    });

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
    }

    const collection = result.data?.pageCollection as PageCollection;
    if (!collection) {
      throw new Error("Page collection not found in response");
    }

    // Filter results based on search query
    const filteredItems =
      collection.items?.filter((item: Page | null) => {
        if (!item) return false;

        const searchableText = [item.title, item.description, item.slug]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchQuery.toLowerCase());
      }) ?? [];

    return {
      items: filteredItems.filter((item): item is Page => item !== null),
      total: filteredItems.length,
      skip: 0,
      limit: 20,
    };
  } catch (error) {
    console.error("Error searching content:", error);
    throw new Error("Failed to search content");
  }
}

/**
 * Fetch all heroes
 */
export async function getHeroes(
  client: ApolloClient<unknown>,
  options: ServiceOptions = {},
): Promise<PaginatedResult<Hero>> {
  const { preview = false } = options;

  try {
    const result = await client.query({
      query: GET_HEROES,
      variables: { preview },
      errorPolicy: "all",
      fetchPolicy: preview ? "no-cache" : "cache-first",
    });

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
    }

    const collection = result.data?.heroCollection as HeroCollection;
    if (!collection) {
      throw new Error("Hero collection not found in response");
    }

    return {
      items:
        collection.items?.filter(
          (item: Hero | null): item is Hero => item !== null,
        ) ?? [],
      total: collection.total ?? 0,
      skip: collection.skip ?? 0,
      limit: collection.limit ?? 0,
    };
  } catch (error) {
    console.error("Error fetching heroes:", error);
    throw new Error("Failed to fetch heroes");
  }
}

/**
 * Fetch all call-to-actions
 */
export async function getCallToActions(
  client: ApolloClient<unknown>,
  options: ServiceOptions = {},
): Promise<PaginatedResult<CallToAction>> {
  const { preview = false } = options;

  try {
    const result = await client.query({
      query: GET_CALL_TO_ACTIONS,
      variables: { preview },
      errorPolicy: "all",
      fetchPolicy: preview ? "no-cache" : "cache-first",
    });

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
    }

    const collection = result.data
      ?.callToActionCollection as CallToActionCollection;
    if (!collection) {
      throw new Error("Call-to-action collection not found in response");
    }

    return {
      items:
        collection.items?.filter(
          (item: CallToAction | null): item is CallToAction => item !== null,
        ) ?? [],
      total: collection.total ?? 0,
      skip: collection.skip ?? 0,
      limit: collection.limit ?? 0,
    };
  } catch (error) {
    console.error("Error fetching call-to-actions:", error);
    throw new Error("Failed to fetch call-to-actions");
  }
}

/**
 * Utility functions for common operations
 */
export const contentfulUtils = {
  /**
   * Filter pages by a search query
   */
  filterPagesByQuery: (pages: Page[], searchQuery: string): Page[] => {
    if (!searchQuery.trim()) return pages;

    return pages.filter((page) => {
      const searchableText = [page.title, page.description, page.slug]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchQuery.toLowerCase());
    });
  },

  /**
   * Check if page should be indexed by search engines
   */
  shouldIndexPage: (page: Page): boolean => {
    return !page.seoNoIndex;
  },

  /**
   * Get page SEO title with fallback
   */
  getPageSeoTitle: (page: Page): string => {
    return page.seoTitle || page.title || "Untitled Page";
  },

  /**
   * Get page SEO description with fallback
   */
  getPageSeoDescription: (page: Page): string => {
    return page.seoDescription || page.description || "";
  },
} as const;
