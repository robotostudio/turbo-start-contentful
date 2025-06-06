import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

import type { TypePageSkeleton } from "./TypePage";

export interface TypeButtonFields {
  variant: EntryFieldTypes.Symbol<"default" | "link" | "outline" | "secondary">;
  label: EntryFieldTypes.Symbol;
  internal?: EntryFieldTypes.EntryLink<TypePageSkeleton>;
  href?: EntryFieldTypes.Symbol;
}

export type TypeButtonSkeleton = EntrySkeletonType<TypeButtonFields, "button">;
export type TypeButton<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeButtonSkeleton, Modifiers, Locales>;
