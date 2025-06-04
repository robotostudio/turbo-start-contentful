import { draftMode } from "next/headers";

import { PageBuilder } from "@/components/pagebuilder";
import { getClient } from "@/lib/contentful";
import { getPageBySlug } from "@/lib/contentful/service";
import { getMetaData } from "@/lib/seo";
import { safeAsync } from "@/safe-async";

export async function generateMetadata() {
  return getMetaData();
}

export default async function Page() {
  const { isEnabled } = await draftMode();
  const res = await safeAsync(getPageBySlug({ slug: "/", preview: isEnabled }));

  if (!res.success) {
    return <div>Error: {res.error.message}</div>;
  }

  const pageBuilder = res.data?.pageBuilderCollection?.items;
  console.log("🚀 ~ Page ~ pageBuilder:", pageBuilder);

  if (!pageBuilder) {
    return <div>No page builder found</div>;
  }

  return <PageBuilder pageBuilder={pageBuilder} />;
}
