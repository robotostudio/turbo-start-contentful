import { cache } from "react";

import { getClient, parseContentfulError } from "./client";
import type {
  TypeBlog,
  TypeBlogSkeleton,
  TypeGlobalSettings,
  TypeGlobalSettingsSkeleton,
  TypePage,
  TypePageSkeleton,
} from "./types";

export async function getPageBySlug(
  slug: string,
  preview = false,
): Promise<TypePage<"WITHOUT_UNRESOLVABLE_LINKS">> {
  try {
    const client = getClient(preview);

    const res = await client.getEntries<TypePageSkeleton>({
      content_type: "page",
      "fields.slug": slug,
      include: 10,
    });

    if (!res?.items?.length) {
      throw new Error(`No page found with slug: ${slug}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return res.items[0]!;
  } catch (error) {
    console.error(`Error fetching page with slug ${slug}:`, error);
    throw new Error(parseContentfulError(error));
  }
}

export async function getPageByID(
  id: string,
  preview = false,
): Promise<TypePage<"WITHOUT_UNRESOLVABLE_LINKS"> | undefined> {
  try {
    const client = getClient(preview);

    const res = await client.getEntries<TypePageSkeleton>({
      content_type: "page",
      "sys.id": id,
      select: [
        "fields.image",
        "fields.seoTitle",
        "fields.title",
        "fields.slug",
        "fields.seoImage",
        "fields.description",
      ],
      include: 10,
      limit: 1,
    });

    if (!res?.items?.length) {
      throw new Error(`No page found with id: ${id}`);
    }

    return res.items[0];
  } catch (error) {
    console.error(`Error fetching page with id ${id}:`, error);
    throw new Error(parseContentfulError(error));
  }
}

export async function getAllPageSlugs(): Promise<string[]> {
  try {
    const client = getClient();
    const res = await client.getEntries<TypePageSkeleton>({
      content_type: "page",
      select: ["fields.slug"],
      "fields.slug[ne]": "/",
    });
    return res.items.map((item) => item.fields.slug);
  } catch (error) {
    console.error("Error fetching page slugs:", error);
    throw new Error(parseContentfulError(error));
  }
}

export async function getBlogPaths(): Promise<string[]> {
  try {
    const client = getClient();
    const res = await client.getEntries<TypeBlogSkeleton>({
      content_type: "blog",
      select: ["fields.slug"],
    });
    return res.items.map((item) => item.fields.slug);
  } catch (error) {
    console.error("Error fetching blog paths:", error);
    throw new Error(parseContentfulError(error));
  }
}

export async function getGlobalSettingsUncached(
  preview = false,
): Promise<TypeGlobalSettings<"WITHOUT_UNRESOLVABLE_LINKS">> {
  try {
    const client = getClient(preview);
    const res = await client.getEntries<TypeGlobalSettingsSkeleton>({
      content_type: "globalSettings",
      include: 10,
    });

    if (!res?.items?.length) {
      throw new Error("No global settings found");
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return res.items[0]!;
  } catch (error) {
    console.error("Error fetching global settings:", error);
    throw new Error(parseContentfulError(error));
  }
}

export const getGlobalSettings = cache(getGlobalSettingsUncached);

export type GlobalSettings = Awaited<ReturnType<typeof getGlobalSettings>>;

export async function getAllBlogs(preview = false): Promise<{
  featured: TypeBlog<"WITHOUT_UNRESOLVABLE_LINKS">;
  blogs: TypeBlog<"WITHOUT_UNRESOLVABLE_LINKS">[];
}> {
  try {
    const client = getClient(preview);

    const globalSettings = await getGlobalSettings(preview);
    // featuredBlog is optional in the schema; cast preserves existing call-site contract
    const featuredBlog = globalSettings?.fields
      ?.featuredBlog as TypeBlog<"WITHOUT_UNRESOLVABLE_LINKS">;
    const featuredId = featuredBlog?.sys?.id;

    const res = await client.getEntries<TypeBlogSkeleton>({
      content_type: "blog",
      include: 10,
      "fields.hideFromList[ne]": true,
      "sys.id[ne]": featuredId,
      order: ["-fields.publishedDate"],
    });
    return {
      featured: featuredBlog,
      blogs: res.items,
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw new Error(parseContentfulError(error));
  }
}

export async function getBlogByID(
  id: string,
  preview = false,
): Promise<TypeBlog<"WITHOUT_UNRESOLVABLE_LINKS"> | undefined> {
  try {
    const client = getClient(preview);
    const res = await client.getEntries<TypeBlogSkeleton>({
      content_type: "blog",
      "sys.id": id,
      select: [
        "fields.image",
        "fields.seoTitle",
        "fields.title",
        "fields.slug",
        "fields.seoImage",
        "fields.publishedDate",
        "fields.description",
      ],
      limit: 1,
      include: 10,
    });
    return res.items[0];
  } catch (error) {
    console.error(`Error fetching blog with id ${id}:`, error);
    throw new Error(parseContentfulError(error));
  }
}

export async function getBlogBySlug(
  slug: string,
  preview = false,
): Promise<TypeBlog<"WITHOUT_UNRESOLVABLE_LINKS"> | undefined> {
  try {
    const client = getClient(preview);
    const res = await client.getEntries<TypeBlogSkeleton>({
      content_type: "blog",
      "fields.slug": slug,
      limit: 1,
      include: 10,
    });
    return res.items[0];
  } catch (error) {
    console.error(`Error fetching blog with slug ${slug}:`, error);
    throw new Error(parseContentfulError(error));
  }
}
