const ogImageDimensions = {
  width: 1200,
  height: 630,
};

export const getOgMetaData = (searchParams: URLSearchParams) => {
  const width = searchParams.get("width") as string;
  const height = searchParams.get("height") as string;

  const ogWidth = Number.isNaN(Number.parseInt(width))
    ? ogImageDimensions.width
    : Number.parseInt(width);

  const ogHeight = Number.isNaN(Number.parseInt(height))
    ? ogImageDimensions.height
    : Number.parseInt(height);

  return { width: ogWidth, height: ogHeight };
};
