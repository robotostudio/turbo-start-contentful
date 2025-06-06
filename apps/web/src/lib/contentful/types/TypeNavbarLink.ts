import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

import type { TypePageSkeleton } from "./TypePage";

export interface TypeNavbarLinkFields {
  label: EntryFieldTypes.Symbol;
  internal?: EntryFieldTypes.EntryLink<TypePageSkeleton>;
  href?: EntryFieldTypes.Symbol;
}

export type TypeNavbarLinkSkeleton = EntrySkeletonType<
  TypeNavbarLinkFields,
  "navbarLink"
>;
export type TypeNavbarLink<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeNavbarLinkSkeleton, Modifiers, Locales>;
