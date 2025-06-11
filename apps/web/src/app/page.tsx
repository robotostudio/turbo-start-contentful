import { draftMode } from "next/headers";

import { PageBuilder } from "@/components/pagebuilder";
import { getPageBySlug } from "@/lib/contentful/query";
import { getSEOMetadata } from "@/lib/seo";
import { safeAsync } from "@/safe-async";

export async function generateMetadata() {
  const result = await safeAsync(getPageBySlug("/"));
  if (!result.success) return getSEOMetadata();
  const page = result.data;
  const { title, description, slug, seoNoIndex, seoTitle, seoDescription } =
    page?.fields ?? {};
  const { id: contentId } = page?.sys ?? {};
  return getSEOMetadata({
    title: seoTitle || title,
    description: seoDescription || description,
    slug,
    seoNoIndex,
    contentType: "home",
    contentId,
  });
}

export default async function Page() {
  const { isEnabled } = await draftMode();
  const result = await safeAsync(getPageBySlug("/", isEnabled));

  if (!result.success) {
    return <div>Error: </div>;
  }

  if (!result.data) {
    return <div>No page builder found</div>;
  }

  return <PageBuilder pageBuilder={result.data.fields.pageBuilder} />;
}
