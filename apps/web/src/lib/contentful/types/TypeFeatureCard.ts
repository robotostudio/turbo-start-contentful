import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeFeatureCardFields {
  icon?: EntryFieldTypes.AssetLink;
  title: EntryFieldTypes.Symbol;
  richText?: EntryFieldTypes.RichText;
  cardLink?: EntryFieldTypes.Symbol;
}

export type TypeFeatureCardSkeleton = EntrySkeletonType<
  TypeFeatureCardFields,
  "featureCard"
>;
export type TypeFeatureCard<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeFeatureCardSkeleton, Modifiers, Locales>;
