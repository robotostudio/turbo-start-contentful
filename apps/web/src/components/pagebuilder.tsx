import type { Entry, UnresolvedLink } from "contentful";

import type {
  TypeCallToAction,
  TypeCallToActionSkeleton,
  TypeFaqAccordion,
  TypeFaqAccordionSkeleton,
  TypeFeatureCards,
  TypeFeatureCardsSkeleton,
  TypeHero,
  TypeHeroSkeleton,
} from "@/lib/contentful/types";

import { CTABlock } from "./sections/cta";
import { FaqAccordion } from "./sections/faq-accordion";
import { FeatureCardsWithIcon } from "./sections/feature-cards-with-icon";
import { HeroBlock } from "./sections/hero";

// Union type for all possible page builder skeletons
type PageBuilderSkeleton =
  | TypeCallToActionSkeleton
  | TypeFaqAccordionSkeleton
  | TypeFeatureCardsSkeleton
  | TypeHeroSkeleton;

// Type for the pageBuilder array that can contain resolved entries or unresolved links
type PageBuilderArray = (
  | UnresolvedLink<"Entry">
  | Entry<PageBuilderSkeleton, undefined, string>
)[];

interface PageBuilderProps {
  pageBuilder: PageBuilderArray | undefined;
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

function isResolvedEntry(
  block:
    | UnresolvedLink<"Entry">
    | Entry<PageBuilderSkeleton, undefined, string>,
): block is Entry<PageBuilderSkeleton, undefined, string> {
  return (
    "sys" in block &&
    "contentType" in block.sys &&
    "id" in block.sys.contentType.sys
  );
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

function UnresolvedBlock({ id }: { id: string }) {
  return (
    <div
      key={id}
      className="p-4 border border-yellow-200 rounded-md bg-yellow-50"
      role="alert"
      aria-label="Unresolved content entry"
    >
      <h2 className="text-yellow-600 font-medium">
        Content entry could not be loaded
      </h2>
      <p className="text-yellow-600 text-sm mt-1">Entry ID: {id}</p>
    </div>
  );
}

export function PageBuilder({ pageBuilder }: PageBuilderProps) {
  if (!pageBuilder?.length) return null;

  return (
    <div className="flex flex-col gap-8">
      {pageBuilder.map((block) => {
        if (!isResolvedEntry(block)) {
          return <UnresolvedBlock key={block.sys.id} id={block.sys.id} />;
        }

        const contentType = block.sys.contentType.sys.id;

        if (!isValidBlockType(contentType)) {
          return (
            <ErrorBlock
              key={block.sys.id}
              id={block.sys.id}
              contentType={contentType}
            />
          );
        }

        switch (block.sys.contentType.sys.id) {
          case "callToAction": {
            return (
              <CTABlock
                key={block.sys.id}
                {...(block as TypeCallToAction<"WITHOUT_UNRESOLVABLE_LINKS">)}
              />
            );
          }
          case "faqAccordion": {
            return (
              <FaqAccordion
                key={block.sys.id}
                {...(block as TypeFaqAccordion<"WITHOUT_UNRESOLVABLE_LINKS">)}
              />
            );
          }
          case "hero": {
            return (
              <HeroBlock
                key={block.sys.id}
                {...(block as TypeHero<"WITHOUT_UNRESOLVABLE_LINKS">)}
              />
            );
          }
          case "featureCards": {
            return (
              <FeatureCardsWithIcon
                key={block.sys.id}
                {...(block as TypeFeatureCards<"WITHOUT_UNRESOLVABLE_LINKS">)}
              />
            );
          }
          default:
            return (
              <ErrorBlock
                key={block.sys.id}
                id={block.sys.id}
                contentType={contentType}
              />
            );
        }
      })}
    </div>
  );
}
