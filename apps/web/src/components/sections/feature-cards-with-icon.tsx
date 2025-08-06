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
      className="rounded-2xl relative md:min-h-[300px] p-7 bg-white dark:bg-zinc-900 overflow-hidden z-10"
      {...props}
    >
      {/* Ellipse 70 */}
      <div className="absolute w-[225.65px] h-[261.63px] left-[-41.43px] top-[-52.57px] bg-[#ECF8F8] dark:bg-[#111827] blur-[50px] rounded-full z-5 pointer-events-none" />

      {/* Ellipse 71 */}
      <div className="absolute w-[194.28px] h-[256.82px] left-[269.58px] top-[-15.43px] bg-[#EBF4F5] dark:bg-[#111827] blur-[37.5px] rounded-full z-5 pointer-events-none" />

      {/* Ellipse 72 */}
      <div className="absolute w-[194.28px] h-[256.82px] left-[137.82px] top-[-210.42px] bg-[#EEF6F7] dark:bg-[#111827] blur-[37.5px] rounded-full z-5 pointer-events-none" />

      <span className="mb-9 flex w-fit p-3 items-center justify-center rounded-full bg-background drop-shadow-sm z-10">
        {icon && (
          <ContentfulImage
            image={icon}
            className="dark:invert"
            {...inspectorProps({ fieldId: "icon" })}
          />
        )}
      </span>

      <div
        className="relative z-10"
        {...inspectorProps({ fieldId: "richText" })}
      >
        <h3
          className="text-lg font-medium md:text-2xl mb-2"
          {...inspectorProps({ fieldId: "title" })}
        >
          {title}
        </h3>
        <ContentfulRichText
          richText={richText}
          className="font-normal text-sm md:text-[16px] text-black/90 leading-7 text-balance dark:text-neutral-300 line-clamp-5"
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
    <section id="features" className="my-6 md:my-16 max-w-6xl mx-auto">
      <div className="container relative mx-auto px-4 md:px-6">
        <div className="flex w-full relative flex-col items-center z-1">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
            {eyebrow && (
              <Badge {...inspectorProps({ fieldId: "eyebrow" })}>
                {eyebrow}
              </Badge>
            )}
            <h2
              className="text-3xl font-medium md:text-5xl tracking-[-0.96px] text-zinc-900 dark:text-zinc-100"
              {...inspectorProps({ fieldId: "title" })}
            >
              {title}
            </h2>
            <ContentfulRichText
              richText={richText}
              className="text-base md:text-lg text-balance max-w-3xl text-zinc-700 dark:text-zinc-300"
              {...inspectorProps({ fieldId: "richText" })}
            />
          </div>
        </div>
        <div className="mx-auto mt-20 relative grid gap-12 lg:grid-cols-3 z-1">
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
        <div className="absolute bottom-[-80px] left-[-100px] size-[300px] md:bg-[#EDF7F7] md:dark:bg-[#11182780] blur-[25px] rounded-full z-0" />
        <div className="absolute bottom-[-80px] right-[350px] size-[300px] md:bg-[#EDF7F7] md:dark:bg-[#11182770] blur-[25px] rounded-full z-0" />
      </div>
    </section>
  );
}
