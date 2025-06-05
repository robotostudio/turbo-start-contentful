"use client";

import type { Asset } from "contentful";
import Image, { type ImageProps } from "next/image";

interface ContentfulImageSrcProps {
  src: string;
  width?: number;
  quality?: number;
  [key: string]: any; // For other props that might be passed
}

const contentfulLoader = ({ src, width, quality }: ContentfulImageSrcProps) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

export function ContentfulImageWithSrc(props: ContentfulImageSrcProps) {
  return <Image alt={props.alt} loader={contentfulLoader} {...props} />;
}

export type ContentfulImageProps = {
  image: Asset<"WITHOUT_UNRESOLVABLE_LINKS", string> | undefined;
  width?: number;
  quality?: number;
} & Omit<ImageProps, "alt" | "src" | "loader">;

export function ContentfulImage({
  image,
  width: _width,
  height: _height,
  quality,
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
      loader={contentfulLoader}
      src={`https:${url}`}
      width={_width ?? width}
      height={_height ?? height}
      quality={quality}
      {...props}
    />
  );
}
