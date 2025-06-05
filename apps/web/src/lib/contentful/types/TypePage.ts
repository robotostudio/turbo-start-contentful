import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeCallToActionSkeleton } from "./TypeCallToAction";
import type { TypeFaqAccordionSkeleton } from "./TypeFaqAccordion";
import type { TypeFeatureCardsSkeleton } from "./TypeFeatureCards";
import type { TypeHeroSkeleton } from "./TypeHero";

export interface TypePageFields {
    seoNoIndex?: EntryFieldTypes.Boolean;
    title: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.Text;
    slug: EntryFieldTypes.Symbol;
    image?: EntryFieldTypes.AssetLink;
    pageBuilder?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeCallToActionSkeleton | TypeFaqAccordionSkeleton | TypeFeatureCardsSkeleton | TypeHeroSkeleton>>;
    seoTitle?: EntryFieldTypes.Symbol;
    seoDescription?: EntryFieldTypes.Symbol;
    seoImage?: EntryFieldTypes.AssetLink;
}

export type TypePageSkeleton = EntrySkeletonType<TypePageFields, "page">;
export type TypePage<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypePageSkeleton, Modifiers, Locales>;
