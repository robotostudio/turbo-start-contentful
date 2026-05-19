"use client";

import type { Asset } from "contentful";
import Image, { type ImageProps } from "next/image";

type ContentfulLoaderArgs = {
  src: string;
  width?: number;
  quality?: number;
  format?: "webp" | "avif" | "jpg" | "png";
};

const contentfulLoader = ({
  src,
  width,
  quality,
  format = "webp",
}: ContentfulLoaderArgs) => {
  const params = new URLSearchParams();
  if (width) params.set("w", width.toString());
  params.set("q", (quality || 75).toString());
  params.set("fm", format);

  return `${src}?${params.toString()}`;
};

export type ContentfulImageProps = {
  image: Asset<"WITHOUT_UNRESOLVABLE_LINKS", string> | undefined;
  width?: number;
  quality?: number;
  format?: "webp" | "avif" | "jpg" | "png";
} & Omit<ImageProps, "alt" | "src" | "loader">;

export function ContentfulImage({
  image,
  width: _width,
  height: _height,
  quality,
  format = "avif",
  ...rest
}: ContentfulImageProps) {
  const { title, file, description } = image?.fields ?? {};

  if (!file) return null;

  const { url, details } = file;
  if (!url) return null;
  const { width, height } = details?.image ?? {};

  // Build clean props without optional width/height/quality to satisfy exactOptionalPropertyTypes
  type CleanImageProps = Omit<
    ImageProps,
    "alt" | "src" | "loader" | "width" | "height" | "quality"
  >;
  const cleanProps = rest as unknown as CleanImageProps;
  const resolvedWidth = _width ?? width;
  const resolvedHeight = _height ?? height;

  return (
    <Image
      alt={title ?? description ?? ""}
      loader={(loaderProps) => contentfulLoader({ ...loaderProps, format })}
      src={`https:${url}`}
      {...(resolvedWidth !== undefined && { width: resolvedWidth })}
      {...(resolvedHeight !== undefined && { height: resolvedHeight })}
      {...(quality !== undefined && { quality })}
      {...cleanProps}
    />
  );
}
