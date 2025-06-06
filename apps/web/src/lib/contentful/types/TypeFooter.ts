import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

import type { TypeNavbarColumnLinkSkeleton } from "./TypeNavbarColumnLink";

export interface TypeFooterFields {
  label?: EntryFieldTypes.Symbol;
  columns?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeNavbarColumnLinkSkeleton>
  >;
}

export type TypeFooterSkeleton = EntrySkeletonType<TypeFooterFields, "footer">;
export type TypeFooter<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeFooterSkeleton, Modifiers, Locales>;
