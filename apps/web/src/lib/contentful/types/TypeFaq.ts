import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

export interface TypeFaqFields {
  question: EntryFieldTypes.Symbol;
  answer?: EntryFieldTypes.RichText;
}

export type TypeFaqSkeleton = EntrySkeletonType<TypeFaqFields, "faq">;
export type TypeFaq<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeFaqSkeleton, Modifiers, Locales>;
