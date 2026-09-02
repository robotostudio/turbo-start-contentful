import type { Entry } from "contentful";
import type { FAQPage, WithContext } from "schema-dts";

import type { TypeFaqAccordionSkeleton } from "@/lib/contentful/types";

import { JsonLdScript } from "./json-ld";
import { isResolvedEntry, type PageBuilderArray } from "./pagebuilder";
import { faqAccordionToJsonLd } from "./sections/faq-accordion-json-ld";

export function PageBuilderJsonLd({
  pageBuilder,
}: {
  pageBuilder: PageBuilderArray | undefined;
}) {
  if (!pageBuilder?.length) return null;

  // Google reads one FAQPage per URL, so merge every faqAccordion block's questions.
  const mainEntity = pageBuilder.flatMap((block) => {
    if (
      !isResolvedEntry(block) ||
      block.sys.contentType.sys.id !== "faqAccordion"
    ) {
      return [];
    }

    const faqBlock = block as Entry<
      TypeFaqAccordionSkeleton,
      "WITHOUT_UNRESOLVABLE_LINKS",
      string
    >;
    return faqAccordionToJsonLd(faqBlock.fields.faqs)?.mainEntity ?? [];
  });

  if (!mainEntity.length) return null;

  const data: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };

  return <JsonLdScript data={data} id="faq-json-ld" />;
}
