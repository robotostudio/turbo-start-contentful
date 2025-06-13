"use client";

import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from "@contentful/live-preview/react";
import { Badge } from "@workspace/ui/components/badge";

import type { TypeHero } from "@/lib/contentful/types";

import { ContentfulButtons } from "../contentful-button";
import { ContentfulImage } from "../contentful-image";
import { ContentfulRichText } from "../contentful-richtext";

export type HeroBlockProps = TypeHero<"WITHOUT_UNRESOLVABLE_LINKS">;

export function HeroBlock(props: HeroBlockProps) {
  const updatedBlog = useContentfulLiveUpdates(props);

  const inspectorProps = useContentfulInspectorMode({
    entryId: updatedBlog.sys.id,
  });

  const { badge, title, richText, buttons, image } = updatedBlog.fields ?? {};
  return (
    <section id="hero" className="mt-4 md:my-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="grid h-full grid-rows-[auto_1fr_auto] gap-4 items-center justify-items-center text-center lg:items-start lg:justify-items-start lg:text-left">
            {badge && (
              <Badge
                variant="secondary"
                {...inspectorProps({ fieldId: "badge" })}
              >
                {badge}
              </Badge>
            )}
            <div className="grid gap-4">
              <h1
                className="text-4xl lg:text-6xl font-semibold text-balance"
                {...inspectorProps({ fieldId: "title" })}
              >
                {title}
              </h1>
              <ContentfulRichText
                richText={richText}
                className="text-base md:text-lg font-normal"
                {...inspectorProps({ fieldId: "richText" })}
              />
            </div>

            {buttons && (
              <ContentfulButtons
                buttons={buttons}
                buttonClassName="w-full sm:w-auto"
                className="w-full sm:w-fit grid gap-2 sm:grid-flow-col lg:justify-start mb-8"
                {...inspectorProps({ fieldId: "buttons" })}
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
                {...inspectorProps({ fieldId: "image" })}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
