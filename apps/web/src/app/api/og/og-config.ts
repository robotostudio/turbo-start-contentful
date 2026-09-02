const ogImageDimensions = {
  width: 1200,
  height: 630,
};

const MIN_DIMENSION = 200;
const MAX_DIMENSION = 2400;

// Clamp to a sane range so ?width=/&height= can't be used to render-bomb the endpoint.
const clampDimension = (raw: string | null, fallback: number) => {
  const parsed = raw === null ? Number.NaN : Number.parseInt(raw, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, MIN_DIMENSION), MAX_DIMENSION);
};

export const getOgMetaData = (searchParams: URLSearchParams) => {
  const width = clampDimension(
    searchParams.get("width"),
    ogImageDimensions.width,
  );
  const height = clampDimension(
    searchParams.get("height"),
    ogImageDimensions.height,
  );

  return { width, height };
};
