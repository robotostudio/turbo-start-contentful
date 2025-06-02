import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

import type { PagebuilderType } from "@/types";

import { SanityImage } from "./sanity-image";

export type CTACardProps = {
  card: NonNullable<PagebuilderType<"imageLinkCards">["cards"]>[number];
  className?: string;
};

export function CTACard({ card, className }: CTACardProps) {
  const { image, description, title, href } = card ?? {};
  return (
    <Link
      href={href ?? "#"}
      className={cn(
        "rounded-3xl p-4 md:p-8 transition-colors relative overflow-hidden group flex flex-col justify-end xl:h-[400px]",
        className,
      )}
    >
      {image?.asset && (
        <div className="absolute inset-0 z-[1] mix-blend-multiply">
          <SanityImage
            asset={image}
            loading="eager"
            priority
            quality={100}
            fill
            className="object-cover grayscale pointer-events-none group-hover:opacity-100 group-hover:transition-opacity duration-1000 opacity-40"
          />
        </div>
      )}
      <div className="z-[2] pt-64 flex flex-col space-y-2 mb-4 duration-500 xl:absolute xl:top-24 group-hover:top-8 xl:inset-x-8">
        <h3 className="text-xl font-[500] text-[#111827]">{title}</h3>
        <p className="text-sm text-[#374151] xl:opacity-0 xl:group-hover:opacity-100 transition-opacity duration-300 delay-150">
          {description}
        </p>
      </div>
    </Link>
  );
}
