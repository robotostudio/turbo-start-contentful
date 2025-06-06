import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

import type { TypeButtonSkeleton } from "./TypeButton";

export interface TypeHeroFields {
  title: EntryFieldTypes.Symbol;
  badge?: EntryFieldTypes.Symbol;
  richText?: EntryFieldTypes.RichText;
  image: EntryFieldTypes.AssetLink;
  buttons?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeButtonSkeleton>
  >;
}

export type TypeHeroSkeleton = EntrySkeletonType<TypeHeroFields, "hero">;
export type TypeHero<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeHeroSkeleton, Modifiers, Locales>;
