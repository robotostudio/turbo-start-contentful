"use client";

import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from "@contentful/live-preview/react";
import { Badge } from "@workspace/ui/components/badge";

import type { TypeFeatureCard, TypeFeatureCards } from "@/lib/contentful/types";

import { ContentfulImage } from "../contentful-image";
import { ContentfulRichText } from "../contentful-richtext";

type FeatureCardsWithIconProps = TypeFeatureCards<"WITHOUT_UNRESOLVABLE_LINKS">;

type FeatureCardProps = {
  card?: TypeFeatureCard<"WITHOUT_UNRESOLVABLE_LINKS">;
};

function FeatureCard({ card, ...props }: FeatureCardProps) {
  const updatedCard = useContentfulLiveUpdates(card);
  const { title, icon, richText } = updatedCard?.fields ?? {};
  const inspectorProps = useContentfulInspectorMode({
    entryId: updatedCard?.sys?.id,
  });
  return (
    <div
      className="rounded-3xl bg-accent p-8 md:min-h-[300px] md:p-8"
      {...props}
    >
      <span className="mb-9 flex w-fit p-3 items-center justify-center rounded-full bg-background drop-shadow-xl">
        {icon && (
          <ContentfulImage
            image={icon}
            {...inspectorProps({ fieldId: "icon" })}
          />
        )}
      </span>

      <div {...inspectorProps({ fieldId: "richText" })}>
        <h3
          className="text-lg font-medium md:text-2xl mb-2"
          {...inspectorProps({ fieldId: "title" })}
        >
          {title}
        </h3>
        <ContentfulRichText
          richText={richText}
          className="font-normal text-sm md:text-[16px] text-black/90 leading-7 text-balance dark:text-neutral-300"
          {...inspectorProps({ fieldId: "richText" })}
        />
      </div>
    </div>
  );
}

export function FeatureCardsWithIcon(props: FeatureCardsWithIconProps) {
  const updatedProps = useContentfulLiveUpdates(props);
  const inspectorProps = useContentfulInspectorMode({
    entryId: updatedProps.sys.id,
  });
  const { eyebrow, title, richText, cards } = updatedProps.fields ?? {};
  return (
    <section id="features" className="my-6 md:my-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
            {eyebrow && (
              <Badge
                variant="secondary"
                {...inspectorProps({ fieldId: "eyebrow" })}
              >
                {eyebrow}
              </Badge>
            )}
            <h2
              className="text-3xl font-semibold md:text-5xl"
              {...inspectorProps({ fieldId: "title" })}
            >
              {title}
            </h2>
            <ContentfulRichText
              richText={richText}
              className="text-base md:text-lg text-balance max-w-3xl"
              {...inspectorProps({ fieldId: "richText" })}
            />
          </div>
        </div>
        <div className="mx-auto mt-20 grid gap-8 lg:grid-cols-3">
          {cards?.map((card, index) => {
            return (
              <FeatureCard
                key={`FeatureCard-${card?.sys.id || `feature-card-${index}`}-${index}`}
                card={card}
                {...inspectorProps({ fieldId: "cards" })}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
