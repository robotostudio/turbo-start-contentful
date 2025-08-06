"use client";
import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from "@contentful/live-preview/react";
import { Badge } from "@workspace/ui/components/badge";

import type { TypeCallToAction } from "@/lib/contentful/types";

import { ContentfulButtons } from "../contentful-button";
import { ContentfulRichText } from "../contentful-richtext";

export type CTABlockProps = TypeCallToAction<
  "WITHOUT_UNRESOLVABLE_LINKS",
  string
>;

export function CTABlock(props: CTABlockProps) {
  const updatedProps = useContentfulLiveUpdates(props);
  const { title, eyebrow, richText, buttons } = updatedProps.fields ?? {};
  const inspectorProps = useContentfulInspectorMode({
    entryId: updatedProps.sys.id,
  });

  return (
    <section id="features" className="my-6 md:my-16">
      <div className="container relative max-w-5xl mx-auto px-4 md:px-8">
        <div className="bg-[url('/cta-bg.png')] bg-cover bg-center py-16 rounded-2xl px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            {eyebrow && (
              <Badge {...inspectorProps({ fieldId: "eyebrow" })}>
                {eyebrow}
              </Badge>
            )}
            <h2
              className="text-3xl font-semibold md:text-5xl tracking-[-0.96px] text-balance text-white"
              {...inspectorProps({ fieldId: "title" })}
            >
              {title}
            </h2>
            <div className="text-lg text-white">
              <ContentfulRichText
                richText={richText}
                className="text-balance text-white [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-white/50"
                {...inspectorProps({ fieldId: "richText" })}
              />
            </div>
            <div className="flex justify-center">
              <ContentfulButtons
                buttons={buttons}
                buttonClassName="w-full sm:w-auto"
                className="w-full sm:w-fit grid gap-2 sm:grid-flow-col lg:justify-start"
                {...inspectorProps({ fieldId: "buttons" })}
              />
            </div>
          </div>
        </div>
        <div className="absolute top-10 -left-10 w-48 h-80 opacity-75 bg-gradient-to-b from-zinc-300 via-purple-400 to-rose-300 dark:from-orange-800 dark:via-red-600 dark:to-slate-600 rounded-full blur-[100px] z-0" />
        <div className="absolute bottom-0 -right-10 w-48 h-80 opacity-75 bg-gradient-to-b from-stone-300 to-emerald-200 dark:from-[#64a51ad6] dark:to-[#689516] rounded-full blur-[100px]" />
      </div>
    </section>
  );
}
