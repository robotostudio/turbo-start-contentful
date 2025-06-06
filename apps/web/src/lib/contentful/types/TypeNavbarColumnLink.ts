import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

import type { TypeNavbarLinkSkeleton } from "./TypeNavbarLink";

export interface TypeNavbarColumnLinkFields {
  label: EntryFieldTypes.Symbol;
  links?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeNavbarLinkSkeleton>
  >;
}

export type TypeNavbarColumnLinkSkeleton = EntrySkeletonType<
  TypeNavbarColumnLinkFields,
  "navbarColumnLink"
>;
export type TypeNavbarColumnLink<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeNavbarColumnLinkSkeleton, Modifiers, Locales>;
