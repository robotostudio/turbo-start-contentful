import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode,
} from "contentful";

import type { TypeFaqSkeleton } from "./TypeFaq";

export interface TypeFaqAccordionFields {
  eyebrow?: EntryFieldTypes.Symbol;
  title: EntryFieldTypes.Symbol;
  subtitle?: EntryFieldTypes.Symbol;
  faqs?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeFaqSkeleton>>;
  link?: EntryFieldTypes.Symbol;
}

export type TypeFaqAccordionSkeleton = EntrySkeletonType<
  TypeFaqAccordionFields,
  "faqAccordion"
>;
export type TypeFaqAccordion<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = Entry<TypeFaqAccordionSkeleton, Modifiers, Locales>;
