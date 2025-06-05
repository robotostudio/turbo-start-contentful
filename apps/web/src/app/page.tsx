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
  const res = await safeAsync(getPageBySlug("/", isEnabled));

  if (!res.success) {
    return <div>Error: {res.error.message}</div>;
  }

  if (!res.data) {
    return <div>No page builder found</div>;
  }

  return <PageBuilder pageBuilder={res.data.fields.pageBuilder} />;
}
