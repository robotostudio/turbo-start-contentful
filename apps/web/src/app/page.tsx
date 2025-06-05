import { draftMode } from "next/headers";

import { PageBuilder } from "@/components/pagebuilder";
import { getPageBySlug } from "@/lib/contentful/query";
import { getMetaData } from "@/lib/seo";
import { safeAsync } from "@/safe-async";

export async function generateMetadata() {
  return getMetaData();
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
