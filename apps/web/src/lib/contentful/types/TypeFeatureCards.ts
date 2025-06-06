import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeFeatureCardSkeleton } from "./TypeFeatureCard";

export interface TypeFeatureCardsFields {
  eyebrow?: EntryFieldTypes.Symbol;
  title: EntryFieldTypes.Symbol;
  richText?: EntryFieldTypes.RichText;
  cards?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeFeatureCardSkeleton>
  >;
}

export type TypeFeatureCardsSkeleton = EntrySkeletonType<
  TypeFeatureCardsFields,
  "featureCards"
>;
export type TypeFeatureCards<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeFeatureCardsSkeleton, Modifiers, Locales>;
