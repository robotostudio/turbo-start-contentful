import { getClient } from "./client";
import type { TypePageSkeleton } from "./types";

export async function getPageBySlug(slug: string, preview = false) {
  const client = getClient(preview);

  const res = await client.getEntries<TypePageSkeleton>({
    content_type: "page",
    "fields.slug": slug,
    include: 10,
  });

  return res.items[0];
}
