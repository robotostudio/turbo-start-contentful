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
    <section
      id="hero"
      className="relative py-20 md:py-32 md:pb-56 overflow-hidden"
    >
      <div className="absolute z-0 inset-0 bg-[url('/hero-bg.png')] bg-cover bg-center pointer-events-none opacity-[20%]" />
      <div className="absolute z-1 inset-0 rounded-full bg-zinc-100 dark:bg-zinc-900 blur-[250px] pointer-events-none" />
      <div className="absolute -bottom-20 -inset-x-10 h-[180px] bg-[linear-gradient(90deg,_rgba(250,250,250,0.8)_0%,_#FAFAFA_50%,_rgba(250,250,250,1)_100%)] dark:bg-[linear-gradient(90deg,_rgba(0,0,0,0.8)_0%,_rgba(0,0,0,0.8)_50%,_rgba(0,0,0,1)_100%)] blur-[40px] pointer-events-none z-5" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="grid place-items-center gap-8 lg:grid-cols-2">
          <div className="grid h-full items-center justify-items-center text-center lg:items-start lg:justify-items-start lg:text-left">
            {badge && (
              <Badge className="mb-4" {...inspectorProps({ fieldId: "badge" })}>
                {badge}
              </Badge>
            )}
            <h1
              className="text-4xl lg:text-7xl font-medium text-balance mb-6"
              {...inspectorProps({ fieldId: "title" })}
            >
              {title}
            </h1>
            <ContentfulRichText
              richText={richText}
              className="text-base md:text-lg text-balance mb-8"
              {...inspectorProps({ fieldId: "richText" })}
            />

            {buttons && (
              <ContentfulButtons
                buttons={buttons}
                buttonClassName="w-full sm:w-auto"
                className="w-full sm:w-fit grid gap-4 sm:grid-flow-col lg:justify-start mb-8"
                {...inspectorProps({ fieldId: "buttons" })}
              />
            )}
          </div>

          {image && (
            <div className="relative max-h-[500px] aspect-square w-full overflow-hidden">
              <ContentfulImage
                image={image}
                loading="eager"
                priority
                fetchPriority="high"
                quality={80}
                className="mix-blend-darken"
                {...inspectorProps({ fieldId: "image" })}
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,_transparent_0%,transparent_100%)]" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
