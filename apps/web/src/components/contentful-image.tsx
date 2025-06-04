"use client";

import Image, { type ImageProps } from "next/image";

import type { SerializedAsset } from "@/lib/contentful/contentful-serializer";

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
  image: SerializedAsset;
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
  const { url, title, width, height } = image ?? {};
  if (!url) return null;
  return (
    <Image
      alt={title}
      loader={contentfulLoader}
      src={url}
      width={_width ?? width}
      height={_height ?? height}
      quality={quality}
      {...props}
    />
  );
}
