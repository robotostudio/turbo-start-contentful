import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { PageBuilder } from "@/components/pagebuilder";
import { getAllPageSlugs, getPageBySlug } from "@/lib/contentful/query";
import { safeAsync } from "@/safe-async";

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  const paths = slugs.map((slug) => ({
    slug: slug.split("/").filter(Boolean),
  }));
  return paths;
}

export default async function CatchAllSlugPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const fullSlug = `/${slug.join("/")}`;

  if (fullSlug.startsWith("/.") || fullSlug.startsWith("/_")) {
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
