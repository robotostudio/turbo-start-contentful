import type { Answer, FAQPage, Question, WithContext } from "schema-dts";

import type { TypeFaqAccordion } from "@/lib/contentful/types";
import { richTextToPlainText } from "@/utils";

type FaqList = NonNullable<
  TypeFaqAccordion<"WITHOUT_UNRESOLVABLE_LINKS">["fields"]
>["faqs"];

export function faqAccordionToJsonLd(
  faqs: FaqList,
): WithContext<FAQPage> | null {
  const validFaqs = (faqs ?? []).filter((faq): faq is NonNullable<typeof faq> =>
    Boolean(faq?.fields?.question),
  );
  if (!validFaqs.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: validFaqs.map(
      (faq): Question => ({
        "@type": "Question",
        name: faq.fields.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: richTextToPlainText(faq.fields.answer),
        } as Answer,
      }),
    ),
  };
}
