import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeAuthorSkeleton } from "./TypeAuthor";
import type { TypeCallToActionSkeleton } from "./TypeCallToAction";
import type { TypeFaqAccordionSkeleton } from "./TypeFaqAccordion";
import type { TypeFeatureCardsSkeleton } from "./TypeFeatureCards";
import type { TypeHeroSkeleton } from "./TypeHero";

export interface TypeBlogFields {
    seoNoIndex?: EntryFieldTypes.Boolean;
    hideFromList?: EntryFieldTypes.Boolean;
    publishedDate: EntryFieldTypes.Date;
    title: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.Text;
    slug: EntryFieldTypes.Symbol;
    image?: EntryFieldTypes.AssetLink;
    authors?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeAuthorSkeleton>>;
    richText?: EntryFieldTypes.RichText;
    pageBuilder?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeCallToActionSkeleton | TypeFaqAccordionSkeleton | TypeFeatureCardsSkeleton | TypeHeroSkeleton>>;
    seoTitle?: EntryFieldTypes.Symbol;
    seoDescription?: EntryFieldTypes.Symbol;
    seoImage?: EntryFieldTypes.AssetLink;
}

export type TypeBlogSkeleton = EntrySkeletonType<TypeBlogFields, "blog">;
export type TypeBlog<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeBlogSkeleton, Modifiers, Locales>;
