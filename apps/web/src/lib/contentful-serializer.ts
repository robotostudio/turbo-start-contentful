import type { Asset, Entry, EntrySkeletonType } from "contentful";

// Base types for serialized content
export interface SerializedAsset {
  id: string;
  title: string;
  description?: string;
  url: string;
  width?: number;
  height?: number;
  size?: number;
  contentType?: string;
  fileName?: string;
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

// Utility type for extracting field types
export type ContentfulFields<T extends EntrySkeletonType> = T["fields"];

/**
 * Serializes a Contentful asset into a clean, usable format
 */
export function serializeAsset(asset: Asset): SerializedAsset | null {
  if (!asset?.fields) {
    return null;
  }

  const { title, description, file } = asset.fields;

  if (!file || typeof file === "string" || !file.url) {
    return null;
  }

  const fileUrl = typeof file.url === "string" ? file.url : "";
  const safeUrl = fileUrl.startsWith("//") ? `https:${fileUrl}` : fileUrl;

  return {
    id: asset.sys.id,
    title: typeof title === "string" ? title : "",
    description: typeof description === "string" ? description : undefined,
    url: safeUrl,
    width:
      file.details && "image" in file.details
        ? file.details.image?.width
        : undefined,
    height:
      file.details && "image" in file.details
        ? file.details.image?.height
        : undefined,
    size:
      file.details && "size" in file.details ? file.details.size : undefined,
    contentType:
      typeof file.contentType === "string" ? file.contentType : undefined,
    fileName: typeof file.fileName === "string" ? file.fileName : undefined,
  };
}

/**
 * Serializes a single Contentful entry into a clean format
 */
export function serializeEntry<T extends EntrySkeletonType>(
  entry: Entry<T>,
): SerializedEntry<ContentfulFields<T>> | null {
  if (!entry?.fields || !entry?.sys) {
    return null;
  }

  return {
    id: entry.sys.id,
    contentType: entry.sys.contentType.sys.id,
    createdAt: entry.sys.createdAt,
    updatedAt: entry.sys.updatedAt,
    fields: serializeFields(entry.fields) as ContentfulFields<T>,
  };
}

/**
 * Recursively serializes field values, handling references and assets
 */
function serializeFields(fields: Record<string, any>): Record<string, any> {
  const serializedFields: Record<string, any> = {};

  for (const [key, value] of Object.entries(fields)) {
    serializedFields[key] = serializeFieldValue(value);
  }

  return serializedFields;
}

/**
 * Serializes individual field values based on their type
 */
function serializeFieldValue(value: any): any {
  if (value === null || value === undefined) {
    return null;
  }

  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(serializeFieldValue).filter(Boolean);
  }

  // Handle Entry references
  if (value?.sys?.type === "Entry") {
    return serializeEntry(value);
  }

  // Handle Asset references
  if (value?.sys?.type === "Asset") {
    return serializeAsset(value);
  }

  // Handle Link objects (unresolved references)
  if (value?.sys?.type === "Link") {
    return {
      id: value.sys.id,
      linkType: value.sys.linkType,
      type: "unresolved",
    };
  }

  // Handle rich text content
  if (value?.nodeType) {
    return value; // Keep rich text as-is for now, or implement custom serialization
  }

  // Handle location fields
  if (value?.lat && value?.lon) {
    return {
      latitude: value.lat,
      longitude: value.lon,
    };
  }

  // Return primitive values as-is
  return value;
}

/**
 * Serializes a collection of Contentful entries
 */
export function serializeCollection<T extends EntrySkeletonType>(collection: {
  items: Entry<T>[];
  total: number;
  skip: number;
  limit: number;
}): SerializedCollection<ContentfulFields<T>> {
  return {
    items: collection.items
      .map(serializeEntry)
      .filter(
        (entry): entry is SerializedEntry<ContentfulFields<T>> =>
          entry !== null,
      ),
    total: collection.total,
    skip: collection.skip,
    limit: collection.limit,
  };
}

/**
 * Type-safe content type serializers factory
 */
export function createContentTypeSerializer<T extends EntrySkeletonType>() {
  return {
    serializeEntry: (entry: Entry<T>) => serializeEntry(entry),
    serializeCollection: (collection: {
      items: Entry<T>[];
      total: number;
      skip: number;
      limit: number;
    }) => serializeCollection(collection),
  };
}

// Serialized interfaces based on your contentfulTypes.d.ts
export interface SerializedButton {
  id: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
  fields: {
    href?: string;
    internal?: SerializedEntry;
    label: string;
    variant: string;
  };
}

export interface SerializedHero {
  id: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
  fields: {
    badge?: string;
    buttons?: SerializedButton[];
    image: SerializedAsset;
    richText?: any;
    title: string;
  };
}

export interface SerializedCallToAction {
  id: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
  fields: {
    buttons?: SerializedButton[];
    eyebrow?: string;
    richText?: any;
    title: string;
  };
}

export interface SerializedPage {
  id: string;
  contentType: string;
  createdAt: string;
  updatedAt: string;
  fields: {
    description: string;
    image?: SerializedAsset;
    pageBuilder?: Array<SerializedEntry>;
    seoDescription?: string;
    seoImage?: SerializedAsset;
    seoNoIndex?: boolean;
    seoTitle?: string;
    slug: string;
    title: string;
  };
}

/**
 * Generic helper to serialize any content type safely
 */
export function serializeContentfulResponse<T extends EntrySkeletonType>(
  response: any,
):
  | SerializedEntry<ContentfulFields<T>>
  | SerializedCollection<ContentfulFields<T>>
  | null {
  if (!response) {
    return null;
  }

  // Handle single entry
  if (response.sys?.type === "Entry") {
    return serializeEntry(response);
  }

  // Handle collection
  if (response.items && Array.isArray(response.items)) {
    return serializeCollection(response);
  }

  // Handle asset
  if (response.sys?.type === "Asset") {
    return serializeAsset(response) as any;
  }

  return null;
}
