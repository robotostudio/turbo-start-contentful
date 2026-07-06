import type { Entry } from "contentful";

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

  return (
    <>
      {pageBuilder.map((block) => {
        if (
          !isResolvedEntry(block) ||
          block.sys.contentType.sys.id !== "faqAccordion"
        ) {
          return null;
        }

        const faqBlock = block as Entry<
          TypeFaqAccordionSkeleton,
          "WITHOUT_UNRESOLVABLE_LINKS",
          string
        >;
        const data = faqAccordionToJsonLd(faqBlock.fields.faqs);
        if (!data) return null;

        return (
          <JsonLdScript
            key={`faq-json-ld-${block.sys.id}`}
            data={data}
            id={`faq-json-ld-${block.sys.id}`}
          />
        );
      })}
    </>
  );
}
