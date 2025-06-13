"use client";

import type { Asset } from "contentful";
import Image, { type ImageProps } from "next/image";

interface ContentfulImageSrcProps {
  src: string;
  width?: number;
  quality?: number;
  format?: "webp" | "avif" | "jpg" | "png";
  [key: string]: any; // For other props that might be passed
}

const contentfulLoader = ({
  src,
  width,
  quality,
  format = "webp",
}: ContentfulImageSrcProps) => {
  const params = new URLSearchParams();
  if (width) params.set("w", width.toString());
  params.set("q", (quality || 75).toString());
  params.set("fm", format);

  return `${src}?${params.toString()}`;
};

export function ContentfulImageWithSrc(props: ContentfulImageSrcProps) {
  const { format = "webp", ...imageProps } = props;
  return (
    <Image
      alt={props.alt}
      loader={(loaderProps) => contentfulLoader({ ...loaderProps, format })}
      {...imageProps}
    />
  );
}

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
  ...props
}: ContentfulImageProps) {
  const { title, file, description } = image?.fields ?? {};

  if (!file) return null;

  const { url, details } = file;
  if (!url) return null;
  const { width, height } = details?.image ?? {};

  return (
    <Image
      alt={title ?? description ?? ""}
      loader={(loaderProps) => contentfulLoader({ ...loaderProps, format })}
      src={`https:${url}`}
      width={_width ?? width}
      height={_height ?? height}
      quality={quality}
      {...props}
    />
  );
}
