import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeNavbarColumnLinkSkeleton } from "./TypeNavbarColumnLink";
import type { TypeNavbarLinkSkeleton } from "./TypeNavbarLink";

export interface TypeNavbarFields {
    columns: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeNavbarColumnLinkSkeleton | TypeNavbarLinkSkeleton>>;
    label?: EntryFieldTypes.Symbol;
}

export type TypeNavbarSkeleton = EntrySkeletonType<TypeNavbarFields, "navbar">;
export type TypeNavbar<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeNavbarSkeleton, Modifiers, Locales>;
