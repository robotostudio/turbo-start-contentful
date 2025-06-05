import { Badge } from "@workspace/ui/components/badge";

import type { TypeHero } from "@/lib/contentful/types";

import { ContentfulButtons } from "../contentful-button";
import { ContentfulImage } from "../contentful-image";
import { ContentfulRichText } from "../contentful-richtext";

export type HeroBlockProps = TypeHero<"WITHOUT_UNRESOLVABLE_LINKS">;

export function HeroBlock({ fields }: HeroBlockProps) {
  const { badge, title, richText, buttons, image } = fields;
  return (
    <section id="hero" className="mt-4 md:my-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="grid h-full grid-rows-[auto_1fr_auto] gap-4 items-center justify-items-center text-center lg:items-start lg:justify-items-start lg:text-left">
            <Badge variant="secondary">{badge}</Badge>
            <div className="grid gap-4">
              <h1 className="text-4xl lg:text-6xl font-semibold text-balance">
                {title}
              </h1>
              <ContentfulRichText
                richText={richText}
                className="text-base md:text-lg font-normal"
              />
            </div>

            {buttons && (
              <ContentfulButtons
                buttons={buttons}
                buttonClassName="w-full sm:w-auto"
                className="w-full sm:w-fit grid gap-2 sm:grid-flow-col lg:justify-start mb-8"
              />
            )}
          </div>

          {image && (
            <div className="h-96 w-full">
              <ContentfulImage
                image={image}
                loading="eager"
                width={800}
                height={800}
                priority
                quality={80}
                className="max-h-96 w-full rounded-3xl object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
