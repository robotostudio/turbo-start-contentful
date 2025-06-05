import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

import type { TypeFooterSkeleton } from "./TypeFooter";
import type { TypeNavbarSkeleton } from "./TypeNavbar";

export interface TypeGlobalSettingsFields {
  siteTitle: EntryFieldTypes.Symbol;
  siteDescription?: EntryFieldTypes.Symbol;
  logo: EntryFieldTypes.AssetLink;
  navbar?: EntryFieldTypes.EntryLink<TypeNavbarSkeleton>;
  footer?: EntryFieldTypes.EntryLink<TypeFooterSkeleton>;
  contactEmail?: EntryFieldTypes.Symbol;
  twitter?: EntryFieldTypes.Symbol;
  linkedin?: EntryFieldTypes.Symbol;
}

export type TypeGlobalSettingsSkeleton = EntrySkeletonType<
  TypeGlobalSettingsFields,
  "globalSettings"
>;
export type TypeGlobalSettings<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeGlobalSettingsSkeleton, Modifiers, Locales>;
