import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

import type { TypeButtonSkeleton } from "./TypeButton";

export interface TypeCallToActionFields {
  eyebrow?: EntryFieldTypes.Symbol;
  title: EntryFieldTypes.Symbol;
  richText?: EntryFieldTypes.RichText;
  buttons?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeButtonSkeleton>
  >;
  enableNewsletterForm?: EntryFieldTypes.Boolean;
  helperText?: EntryFieldTypes.RichText;
}

export type TypeCallToActionSkeleton = EntrySkeletonType<
  TypeCallToActionFields,
  "callToAction"
>;
export type TypeCallToAction<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeCallToActionSkeleton, Modifiers, Locales>;
