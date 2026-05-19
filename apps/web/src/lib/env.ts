export function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}

export const spaceId = assertValue(
  process.env["CONTENTFUL_SPACE_ID"],
  "Missing environment variable: CONTENTFUL_SPACE_ID",
);

export const accessToken = assertValue(
  process.env["CONTENTFUL_ACCESS_TOKEN"],
  "Missing environment variable: CONTENTFUL_ACCESS_TOKEN",
);

export const previewToken = process.env["CONTENTFUL_PREVIEW_ACCESS_TOKEN"];

export const draftToken = assertValue(
  process.env["CONTENTFUL_DRAFT_TOKEN"],
  "Missing environment variable: CONTENTFUL_DRAFT_TOKEN",
);

export const revalidationSecret: string | undefined =
  process.env["CONTENTFUL_REVALIDATION_SECRET"];

export const previewSecret: string | undefined =
  process.env["CONTENTFUL_PREVIEW_SECRET"];

export const vercelBypassSecret: string | undefined =
  process.env["VERCEL_AUTOMATION_BYPASS_SECRET"];
