import type { MetadataRoute } from "next";

import { getBaseUrl } from "@/config";
import { getAllPageSlugs, getBlogPaths } from "@/lib/contentful/query";
import { safeAsync } from "@/safe-async";

const baseUrl = getBaseUrl();

const INDEX_PAGES = ["", "/blog"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPages, slugPages] = await Promise.all([
    safeAsync(getBlogPaths()),
    safeAsync(getAllPageSlugs()),
  ]);
  if (!blogPages.success || !slugPages.success) return [];
  const blogPagesData = blogPages.data;
  const slugPagesData = slugPages.data;

  return [
    ...INDEX_PAGES.map((page) => ({
      url: `${baseUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    })),
    ...slugPagesData.map((page) => ({
      url: `${baseUrl}${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...blogPagesData.map((page) => ({
      url: `${baseUrl}/blog/${page}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
