import type { Asset, Entry } from "contentful";

/**
 * Contentful Serializer
 *
 * This module provides simple, clean functions to transform Contentful responses
 * into predictable, typed data structures.
 *
 * Key principles:
 * - No complex generics or abstractions
 * - Clear function names that describe what they do
 * - Consistent error handling with early returns
 * - Type-safe interfaces for all content types
 *
 * Usage:
 * ```ts
 * import { transformEntry, transformAsset, transformCollection } from './contentful-serializer'
 *
 * // Transform a single entry
 * const hero = transformEntry<HeroFields>(contentfulEntry)
 *
 * // Transform an asset
 * const image = transformAsset(contentfulAsset)
 *
 * // Transform a collection
 * const pages = transformCollection<PageFields>(contentfulCollection)
 * ```
 */

// Simple, clean interfaces for serialized content
export interface SerializedAsset {
  id: string;
  title: string;
  description: string;
  url: string;
  width: number;
  height: number;
  size: number;
  contentType: string;
  fileName: string;
}

export interface SerializedEntry<T = Record<string, any>> {
  id: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
  fields: T;
}

export interface SerializedCollection<T = Record<string, any>> {
  items: SerializedEntry<T>[];
  total: number;
  skip: number;
  limit: number;
}

/**
 * Converts a Contentful asset into a clean, usable format
 */
export function transformAsset(asset: Asset): SerializedAsset | null {
  if (!asset?.fields?.file) return null;

  const { title, description, file } = asset.fields;

  if (typeof file === "string" || !file?.url) return null;

  const fileUrl = typeof file.url === "string" ? file.url : "";
  const url = fileUrl.startsWith("//") ? `https:${fileUrl}` : fileUrl;

  const imageDetails =
    file.details && "image" in file.details ? file.details.image : null;
  const size = file.details && "size" in file.details ? file.details.size : 0;

  return {
    id: asset.sys.id,
    title: typeof title === "string" ? title : "",
    description: typeof description === "string" ? description : "",
    url,
    width: imageDetails?.width || 0,
    height: imageDetails?.height || 0,
    size: size || 0,
    contentType: typeof file.contentType === "string" ? file.contentType : "",
    fileName: typeof file.fileName === "string" ? file.fileName : "",
  };
}

/**
 * Converts a Contentful entry into a clean format
 */
export function transformEntry<T = Record<string, any>>(
  entry: Entry<any>,
): SerializedEntry<T> | null {
  if (!entry?.fields || !entry?.sys) return null;

  return {
    id: entry.sys.id,
    contentType: entry.sys.contentType.sys.id,
    createdAt: entry.sys.createdAt,
    updatedAt: entry.sys.updatedAt,
    fields: transformFields(entry.fields) as T,
  };
}

/**
 * Transforms all fields in an entry, handling nested content
 */
function transformFields(fields: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(fields)) {
    result[key] = transformFieldValue(value);
  }

  return result;
}

/**
 * Transforms individual field values based on their type
 */
function transformFieldValue(value: any): any {
  if (!value) return null;

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(transformFieldValue).filter(Boolean);
  }

  // Handle Entry references
  if (value.sys?.type === "Entry") {
    return transformEntry(value);
  }

  // Handle Asset references
  if (value.sys?.type === "Asset") {
    return transformAsset(value);
  }

  // Handle unresolved links
  if (value.sys?.type === "Link") {
    return {
      id: value.sys.id,
      linkType: value.sys.linkType,
      type: "unresolved",
    };
  }

  // Handle rich text (keep as-is)
  if (value.nodeType) {
    return value;
  }

  // Handle location coordinates
  if (value.lat && value.lon) {
    return {
      latitude: value.lat,
      longitude: value.lon,
    };
  }

  return value;
}

/**
 * Transforms a collection of Contentful entries
 */
export function transformCollection<T = Record<string, any>>(collection: {
  items: Entry<any>[];
  total: number;
  skip: number;
  limit: number;
}): SerializedCollection<T> {
  return {
    items: collection.items
      .map(transformEntry<T>)
      .filter((entry): entry is SerializedEntry<T> => entry !== null),
    total: collection.total,
    skip: collection.skip,
    limit: collection.limit,
  };
}

/**
 * Main function to transform any Contentful response
 */
export function transformContentfulData<T = Record<string, any>>(
  response: any,
): SerializedEntry<T> | SerializedCollection<T> | SerializedAsset | null {
  if (!response) return null;

  // Single entry
  if (response.sys?.type === "Entry") {
    return transformEntry<T>(response);
  }

  // Collection of entries
  if (response.items && Array.isArray(response.items)) {
    return transformCollection<T>(response);
  }

  // Single asset
  if (response.sys?.type === "Asset") {
    return transformAsset(response);
  }

  return null;
}

// Specific content type interfaces for better type safety
export interface HeroFields {
  badge?: string;
  title: string;
  richText?: any;
  buttons?: SerializedEntry[];
  image?: SerializedAsset;
}

export interface ButtonFields {
  label: string;
  href?: string;
  internal?: SerializedEntry;
  variant: string;
}

export interface CallToActionFields {
  title: string;
  eyebrow?: string;
  richText?: any;
  buttons?: SerializedEntry<ButtonFields>[];
}

export interface FaqFields {
  question: string;
  answer?: any; // Rich text content
}

export interface FaqAccordionFields {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  faqs?: SerializedEntry<FaqFields>[];
}

export interface FeatureCardFields {
  title: string;
  icon?: SerializedAsset;
  richText?: any; // Rich text content
}

export interface FeatureCardsFields {
  title: string;
  eyebrow?: string;
  richText?: any; // Rich text content
  cards?: SerializedEntry<FeatureCardFields>[];
}

export interface PageFields {
  title: string;
  slug: string;
  description: string;
  image?: SerializedAsset;
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: SerializedAsset;
  seoNoIndex?: boolean;
  pageBuilder?: SerializedEntry[];
}

// Type-safe transformers for specific content types
export const transformHero = (entry: Entry<any>) =>
  transformEntry<HeroFields>(entry);
export const transformButton = (entry: Entry<any>) =>
  transformEntry<ButtonFields>(entry);
export const transformCallToAction = (entry: Entry<any>) =>
  transformEntry<CallToActionFields>(entry);
export const transformFaq = (entry: Entry<any>) =>
  transformEntry<FaqFields>(entry);
export const transformFaqAccordion = (entry: Entry<any>) =>
  transformEntry<FaqAccordionFields>(entry);
export const transformFeatureCard = (entry: Entry<any>) =>
  transformEntry<FeatureCardFields>(entry);
export const transformFeatureCards = (entry: Entry<any>) =>
  transformEntry<FeatureCardsFields>(entry);
export const transformPage = (entry: Entry<any>) =>
  transformEntry<PageFields>(entry);
