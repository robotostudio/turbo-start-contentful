import { getImageDimensions } from "@sanity/asset-utils";
import { cn } from "@workspace/ui/lib/utils";
import Image, { type ImageProps as NextImageProps } from "next/image";

import { urlFor } from "@/lib/sanity/client";
import type { SanityImageProps } from "@/types";

type ImageProps = {
  asset: SanityImageProps;
  alt?: string;
} & Omit<NextImageProps, "alt" | "src">;

function getImageConfig(asset: unknown) {
  const config: {
    blurDataURL?: string;
    placeholder?: "blur";
    alt?: string;
  } = {};

  if (asset && typeof asset === "object") {
    // Add blur data if available
    if ("blurData" in asset && asset.blurData) {
      config.blurDataURL = asset.blurData as string;
      config.placeholder = "blur";
    }

    // Add alt text if available
    if ("alt" in asset && typeof asset.alt === "string") {
      config.alt = asset.alt;
    }
  }

  return config;
}

export function SanityImage({
  asset,
  alt,
  width,
  height,
  className,
  quality = 75,
  fill,
  ...props
}: ImageProps) {
  if (!asset?.asset) return null;
  const dimensions = getImageDimensions(asset.asset);

  const url = urlFor({ ...asset, _id: asset?.asset?._ref })
    .size(
      Number(width ?? dimensions.width),
      Number(height ?? dimensions.height),
    )
    .dpr(2)
    .auto("format")
    .quality(Number(quality))
    .url();

  const imageConfig = getImageConfig(asset);

  // Base image props
  const imageProps = {
    alt: alt ?? imageConfig.alt ?? "Image",
    "aria-label": alt ?? imageConfig.alt ?? "Image",
    src: url,
    className: cn(className),
    // Optimize image sizes for performance and LCP
    // Use smaller percentages to reduce initial load size while maintaining quality
    // Order from smallest to largest breakpoint for better browser parsing
    // Define responsive image sizes for optimal loading:
    // - Mobile (<640px): Image takes up 80% of viewport width
    // - Tablet (<768px): Image takes up 50% of viewport width
    // - Small desktop (<1200px): Image takes up 33% of viewport width
    // - Large desktop (>1200px): Image takes up 25% of viewport width
    sizes:
      "(max-width: 640px) 75vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw",
    ...imageConfig,
    ...props,
  };

  // Add width and height only if fill is not true
  if (!fill) {
    return (
      <Image
        {...imageProps}
        width={width ?? dimensions.width}
        height={height ?? dimensions.height}
      />
    );
  }

  return <Image {...imageProps} fill={fill} />;
}
