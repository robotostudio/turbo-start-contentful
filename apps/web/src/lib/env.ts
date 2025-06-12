function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}

export const spaceId = assertValue(
  process.env.CONTENTFUL_SPACE_ID,
  "Missing environment variable: CONTENTFUL_SPACE_ID",
);

export const accessToken = assertValue(
  process.env.CONTENTFUL_ACCESS_TOKEN,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const previewToken = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;
