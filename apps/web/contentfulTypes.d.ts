import type { Asset, Entry } from "contentful";
export const Button = "button";
export interface Button {
  //📌 Button
  /*  */
  readonly href?: string;
  readonly internal?: Entry<Page>;
  readonly label: string;
  readonly variant: string;
}

export const CallToAction = "callToAction";
export interface CallToAction {
  //🧱 Call to Action
  /* Call to action page builder block */
  readonly buttons?: ReadonlyArray<Entry<Button>>;
  readonly eyebrow?: string;
  readonly richText?: { content: any; data: any; nodeType: string };
  readonly title: string;
}

export const Faq = "faq";
export interface Faq {
  //❓ FAQ
  /*  */
  readonly answer?: { content: any; data: any; nodeType: string };
  readonly question: string;
}

export const FaqAccordion = "faqAccordion";
export interface FaqAccordion {
  //🧱 FAQ Accordion
  /* FAQ page builder block */
  readonly eyebrow?: string;
  readonly faqs?: ReadonlyArray<Entry<Faq>>;
  readonly subtitle?: string;
  readonly title: string;
}

export const FeatureCard = "featureCard";
export interface FeatureCard {
  //⚙️ Feature Card
  /* ⚙️ Feature Card block for feature cards */
  readonly icon?: Asset;
  readonly richText?: { content: any; data: any; nodeType: string };
  readonly title: string;
}

export const FeatureCards = "featureCards";
export interface FeatureCards {
  //🧱 Feature Cards
  /* Feature cards page builder block */
  readonly cards?: ReadonlyArray<Entry<FeatureCard>>;
  readonly eyebrow?: string;
  readonly richText?: { content: any; data: any; nodeType: string };
  readonly title: string;
}

export const Hero = "hero";
export interface Hero {
  //🧱 Hero
  /* Hero page builder block
   */
  readonly badge?: string;
  readonly buttons?: ReadonlyArray<Entry<Button>>;
  readonly image: Asset;
  readonly richText?: { content: any; data: any; nodeType: string };
  readonly title: string;
}

export const Page = "page";
export interface Page {
  //📄 Page
  /*  */
  readonly description: string;
  readonly image?: Asset;
  readonly pageBuilder?: ReadonlyArray<
    Entry<Hero | CallToAction | FaqAccordion | FeatureCards>
  >;
  readonly seoDescription?: string;
  readonly seoImage?: Asset;
  readonly seoNoIndex?: boolean;
  readonly seoTitle?: string;
  readonly slug: string;
  readonly title: string;
}
