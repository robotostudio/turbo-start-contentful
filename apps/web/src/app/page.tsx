import { draftMode } from "next/headers";

import { PageBuilder } from "@/components/pagebuilder";
import { getClient } from "@/lib/contentful";
import { getPageBySlug } from "@/lib/contentful-queries";
import { getMetaData } from "@/lib/seo";
import { safeAsync } from "@/safe-async";

async function fetchHomePageData() {
  const { isEnabled } = await draftMode();
  const client = getClient(isEnabled);
  const page = await client.getEntries({
    content_type: "page",
    limit: 1,
    "fields.slug[match]": "/",
  });

  console.log(page);

  return page;
}

export async function generateMetadata() {
  return getMetaData();
}

export default async function Page() {
  const { isEnabled } = await draftMode();
  const res = await safeAsync(getPageBySlug("/", isEnabled));

  if (!res.success) {
    return <div>Error: {res.error.message}</div>;
  }

  const { pageBuilder } = res.data?.fields ?? { pageBuilder: [] };
  console.log("🚀 ~ Page ~ pageBuilder:", pageBuilder);

  // const { _id, _type, pageBuilder } = homePageData ?? {};

  // return <PageBuilder pageBuilder={pageBuilder} />;

  return <PageBuilder pageBuilder={pageBuilder} />;
}
