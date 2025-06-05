import { getClient, parseContentfulError } from "./client";
import type {
  TypeGlobalSettings,
  TypeGlobalSettingsSkeleton,
  TypePageSkeleton,
} from "./types";

export async function getPageBySlug(slug: string, preview = false) {
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

    return res.items[0];
  } catch (error) {
    console.error(`Error fetching page with slug ${slug}:`, error);
    throw new Error(parseContentfulError(error));
  }
}

export async function getGlobalSettings(preview = false) {
  try {
    const client = getClient(preview);
    const res = await client.getEntries({
      content_type: "globalSettings",
      include: 10,
    });

    if (!res?.items?.length) {
      throw new Error("No global settings found");
    }

    return res.items[0] as TypeGlobalSettings<"WITHOUT_UNRESOLVABLE_LINKS">;
  } catch (error) {
    console.error("Error fetching global settings:", error);
    throw new Error(parseContentfulError(error));
  }
}

export type GlobalSettings = Awaited<ReturnType<typeof getGlobalSettings>>;
