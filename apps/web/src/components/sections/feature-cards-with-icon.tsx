"use client";

import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from "@contentful/live-preview/react";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

import type { TypeFeatureCard, TypeFeatureCards } from "@/lib/contentful/types";

import { ContentfulImage } from "../contentful-image";
import { ContentfulRichText } from "../contentful-richtext";

type FeatureCardsWithIconProps = TypeFeatureCards<"WITHOUT_UNRESOLVABLE_LINKS">;

type FeatureCardProps = {
  card?: TypeFeatureCard<"WITHOUT_UNRESOLVABLE_LINKS">;
};

function FeatureCard({ card, ...props }: FeatureCardProps) {
  const updatedCard = useContentfulLiveUpdates(card);
  const {
    title,
    icon,
    richText,
    cardGradientColor = "blue",
  } = updatedCard?.fields ?? {};
  const inspectorProps = useContentfulInspectorMode({
    entryId: updatedCard?.sys?.id,
  });

  const getGradientColor = () => {
    switch (cardGradientColor) {
      case "blue":
        return "bg-[#ECF8F8] dark:bg-[#19243e]";
      case "pink":
        return "bg-[#F0E9F7] dark:bg-[#271C35]";
      case "red":
        return "bg-[#F7EDEF] dark:bg-[#3A1B1F]";
      case "yellow":
        return "bg-[#F8F6EB] dark:bg-[#2C2B1A]";
    }
  };

  return (
    <div
      className="rounded-2xl relative p-7 bg-white dark:bg-zinc-900 overflow-hidden z-10 border border-white dark:border-zinc-900"
      {...props}
    >
      {/* Ellipse 70 */}
      <div
        className={cn(
          "absolute w-[225.65px] h-[261.63px] left-[-41.43px] top-[-52.57px] blur-[50px] rounded-full z-5 pointer-events-none",
          getGradientColor(),
        )}
      />

      {/* Ellipse 71 */}
      <div
        className={cn(
          "absolute w-[194.28px] h-[256.82px] left-[269.58px] top-[-15.43px] blur-[37.5px] rounded-full z-5 pointer-events-none",
          getGradientColor(),
        )}
      />

      {/* Ellipse 72 */}
      <div
        className={cn(
          "absolute w-[194.28px] h-[256.82px] left-[137.82px] top-[-210.42px] blur-[37.5px] rounded-full z-5 pointer-events-none",
          getGradientColor(),
        )}
      />

      <span className="mb-9 flex w-fit p-3 items-center justify-center rounded-full bg-background dark:bg-muted-foreground drop-shadow-sm z-10">
        {icon && (
          <ContentfulImage
            image={icon}
            className="size-6"
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

  const { eyebrow, title, richText, cards = [] } = updatedProps.fields ?? {};
  const cardCount = cards.length;

  const getGridCols = () => {
    if (cardCount >= 4) return "lg:grid-cols-4 gap-6";
    if (cardCount === 3) return "lg:grid-cols-3";
    if (cardCount === 2) return "lg:grid-cols-2";
    return "lg:grid-cols-1";
  };

  return (
    <section id="features" className="my-6 md:my-14 mx-auto">
      <div className="container relative mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center z-1">
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

        <div
          className={cn(
            "mx-auto mt-20 relative grid gap-12 z-1",
            getGridCols(),
          )}
        >
          {cards.map((card, index) => {
            const cardKey = `FeatureCard-${card?.sys?.id ?? index}`;
            const cardElement = (
              <FeatureCard
                key={cardKey}
                card={card}
                {...inspectorProps({ fieldId: "cards" })}
              />
            );

            const cardLink = card?.fields?.cardLink;
            return cardLink ? (
              <a
                key={cardKey}
                href={cardLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {cardElement}
              </a>
            ) : (
              cardElement
            );
          })}
        </div>

        {/* Background blobs */}
        <div className="absolute bottom-[-80px] left-[-100px] size-[300px] md:bg-[#EDF7F7] md:dark:bg-[#11182780] blur-[25px] rounded-full z-0" />
        <div className="absolute bottom-[-80px] right-[350px] size-[300px] md:bg-[#EDF7F7] md:dark:bg-[#11182770] blur-[25px] rounded-full z-0" />
      </div>
    </section>
  );
}
