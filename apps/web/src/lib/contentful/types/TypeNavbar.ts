import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";
import type { TypeButtonSkeleton } from "./TypeButton";
import type { TypeNavbarColumnLinkSkeleton } from "./TypeNavbarColumnLink";
import type { TypeNavbarLinkSkeleton } from "./TypeNavbarLink";

export interface TypeNavbarFields {
  label?: EntryFieldTypes.Symbol;
  columns: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      TypeNavbarColumnLinkSkeleton | TypeNavbarLinkSkeleton
    >
  >;
  buttons?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeButtonSkeleton>
  >;
}

export type TypeNavbarSkeleton = EntrySkeletonType<TypeNavbarFields, "navbar">;
export type TypeNavbar<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeNavbarSkeleton, Modifiers, Locales>;
