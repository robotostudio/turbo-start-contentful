import type { Entry, UnresolvedLink } from "contentful";

import type {
  TypeCallToActionSkeleton,
  TypeFaqAccordionSkeleton,
  TypeFeatureCardsSkeleton,
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
export type PageBuilderArray = (
  | UnresolvedLink<"Entry">
  | Entry<PageBuilderSkeleton, undefined, string>
  | Entry<PageBuilderSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
  | undefined
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

type AnyPageBuilderEntry =
  | Entry<PageBuilderSkeleton, undefined, string>
  | Entry<PageBuilderSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>;

export function isResolvedEntry(
  block:
    | UnresolvedLink<"Entry">
    | Entry<PageBuilderSkeleton, undefined, string>
    | Entry<PageBuilderSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
    | undefined,
): block is AnyPageBuilderEntry {
  return (
    block !== undefined &&
    "sys" in block &&
    "contentType" in block.sys &&
    "id" in block.sys.contentType.sys
  );
}

function ErrorBlock({ contentType }: { id: string; contentType: string }) {
  return (
    <div
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
          // block is UnresolvedLink | undefined here
          if (!block) return null;
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

        const Component = BLOCK_COMPONENTS[contentType];
        // Single cast: registry key matches runtime contentType, sound by construction.
        // TS cannot narrow Entry<union> by the string discriminant, so one cast is unavoidable.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <Component key={block.sys.id} {...(block as any)} />;
      })}
    </div>
  );
}
