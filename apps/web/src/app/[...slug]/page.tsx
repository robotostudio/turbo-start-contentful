import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { PageBuilder } from "@/components/pagebuilder";
import { getPageBySlug } from "@/lib/contentful/query";
import { getSEOMetadata } from "@/lib/seo";
import { safeAsync } from "@/safe-async";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const fullSlug = `/${slug.join("/")}`;

  if (
    fullSlug.startsWith("/.") ||
    fullSlug.startsWith("/_") ||
    fullSlug.startsWith("/.well-known")
  ) {
    return getSEOMetadata({
      title: "404",
      description: "404",
      slug: fullSlug,
      seoNoIndex: true,
    });
  }
  const result = await safeAsync(getPageBySlug(fullSlug));
  if (!result.success) return getSEOMetadata();
  const page = result.data;
  const {
    title,
    description,
    slug: pageSlug,
    seoNoIndex,
    seoTitle,
    seoDescription,
  } = page?.fields ?? {};
  const { id: contentId, contentType } = page?.sys ?? {};
  return getSEOMetadata({
    title: seoTitle || title,
    description: seoDescription || description,
    slug: pageSlug,
    seoNoIndex,
    contentType: contentType?.sys?.id,
    contentId: contentId,
  });
}

export default async function CatchAllSlugPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const fullSlug = `/${slug.join("/")}`;

  if (
    fullSlug.startsWith("/.") ||
    fullSlug.startsWith("/_") ||
    fullSlug.startsWith("/.well-known")
  ) {
    return notFound();
  }

  const { isEnabled: preview } = await draftMode();
  const result = await safeAsync(getPageBySlug(fullSlug, preview));
  if (!result.success) {
    return <div>Error: {result.error.message}</div>;
  }
  const pageBuilder = result.data?.fields.pageBuilder;
  return <PageBuilder pageBuilder={pageBuilder} />;
}
