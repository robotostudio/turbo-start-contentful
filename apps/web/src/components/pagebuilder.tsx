import type {
  CallToAction,
  FaqAccordion as FaqAccordionType,
  FeatureCards,
  Hero,
} from "contentfulTypes";

import type { SerializedEntry } from "@/lib/contentful-serializer";

import { CTABlock } from "./sections/cta";
import { FaqAccordion } from "./sections/faq-accordion";
import { FeatureCardsWithIcon } from "./sections/feature-cards-with-icon";
import { HeroBlock } from "./sections/hero";

type BlockComponent = {
  contentType: string;
  id: string;
  fields: Record<string, unknown>;
};

interface PageBuilderProps {
  pageBuilder: BlockComponent[];
}

const BLOCK_COMPONENTS = {
  callToAction: CTABlock,
  faqAccordion: FaqAccordion,
  hero: HeroBlock,
  featureCards: FeatureCardsWithIcon,
} as const;

type BlockType = keyof typeof BLOCK_COMPONENTS;

function isValidBlockType(type: string): type is BlockType {
  return type in BLOCK_COMPONENTS;
}

function ErrorBlock({ id, contentType }: { id: string; contentType: string }) {
  return (
    <div
      key={id}
      className="p-4 border border-red-200 rounded-md"
      role="alert"
      aria-label={`Component ${contentType} not found`}
    >
      <h2 className="text-red-600 font-medium">
        Component not found: {contentType}
      </h2>
    </div>
  );
}

export function PageBuilder({ pageBuilder }: PageBuilderProps) {
  if (!pageBuilder?.length) return null;

  return (
    <div className="flex flex-col gap-8">
      {pageBuilder.map((block) => {
        if (!block?.contentType || !isValidBlockType(block.contentType)) {
          return (
            <ErrorBlock
              key={block?.id}
              id={block?.id}
              contentType={block?.contentType}
            />
          );
        }

        switch (block.contentType) {
          case "callToAction": {
            const typedProps =
              block as unknown as SerializedEntry<CallToAction>;
            return <CTABlock key={block.id} {...typedProps} />;
          }
          case "faqAccordion": {
            const typedProps =
              block as unknown as SerializedEntry<FaqAccordionType>;
            return <FaqAccordion key={block.id} {...typedProps} />;
          }
          case "hero": {
            const typedProps = block as unknown as SerializedEntry<Hero>;
            return <HeroBlock key={block.id} {...typedProps} />;
          }
          case "featureCards": {
            const typedProps =
              block as unknown as SerializedEntry<FeatureCards>;
            return <FeatureCardsWithIcon key={block.id} {...typedProps} />;
          }
          default:
            return (
              <ErrorBlock
                key={block.id}
                id={block.id}
                contentType={block.contentType}
              />
            );
        }
      })}
    </div>
  );
}
