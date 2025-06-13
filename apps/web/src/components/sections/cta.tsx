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
      <div className="container mx-auto px-4 md:px-8">
        <div className="bg-muted py-16 rounded-3xl px-4">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            {eyebrow && (
              <Badge
                variant="secondary"
                className="bg-zinc-200 dark:text-black"
                {...inspectorProps({ fieldId: "eyebrow" })}
              >
                {eyebrow}
              </Badge>
            )}
            <h2
              className="text-3xl font-semibold md:text-5xl text-balance"
              {...inspectorProps({ fieldId: "title" })}
            >
              {title}
            </h2>
            <div className="text-lg text-muted-foreground">
              <ContentfulRichText
                richText={richText}
                className="text-balance"
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
      </div>
    </section>
  );
}
