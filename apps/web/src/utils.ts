import type { Asset } from "contentful";
import slugify from "slugify";

export const isRelativeUrl = (url: string) =>
  url.startsWith("/") || url.startsWith("#") || url.startsWith("?");

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return isRelativeUrl(url);
  }
};

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const getTitleCase = (name: string) => {
  const titleTemp = name.replace(/([A-Z])/g, " $1");
  return titleTemp.charAt(0).toUpperCase() + titleTemp.slice(1);
};

export function convertToSlug(
  text?: string,
  { fallback }: { fallback?: string } = { fallback: "top-level" },
) {
  if (!text) return fallback;
  return slugify(text.trim(), {
    lower: true,
    remove: /[^a-zA-Z0-9 ]/g,
  });
}

export function getImageUrl(
  image: Asset<"WITHOUT_UNRESOLVABLE_LINKS", string> | undefined,
) {
  if (!image) return undefined;
  const { url, details } = image?.fields?.file ?? {};
  if (!url) return undefined;
  const { width, height } = details?.image ?? {};
  return { url: `https:${url}?w=${width}&h=${height}`, width, height };
}
