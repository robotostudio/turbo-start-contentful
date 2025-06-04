import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Badge } from "@workspace/ui/components/badge";

import type {
  FaqAccordionFields,
  SerializedEntry,
} from "@/lib/contentful/contentful-serializer";

import { ContentfulRichText } from "../contentful-richtext";

export type FaqAccordionProps = SerializedEntry<FaqAccordionFields>;

export function FaqAccordion({ fields }: FaqAccordionProps) {
  const { eyebrow, title, subtitle, faqs } = fields;
  return (
    <section id="faq" className="my-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
            <Badge variant="secondary">{eyebrow}</Badge>
            <h2 className="text-3xl font-semibold md:text-5xl">{title}</h2>
            <h3 className="text-lg font-normal text-[#374151] text-balance dark:text-zinc-400">
              {subtitle}
            </h3>
          </div>
        </div>
        <div className="my-16 max-w-xl mx-auto">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="3"
          >
            {faqs?.map((faq, index) => (
              <AccordionItem
                value={faq?.id}
                key={`AccordionItem-${faq?.id}-${index}`}
                className="py-2"
              >
                <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline group">
                  {faq?.fields?.question}
                </AccordionTrigger>
                <AccordionContent className="pb-2 text-muted-foreground">
                  <ContentfulRichText
                    richText={faq?.fields?.answer}
                    className="text-sm md:text-base"
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
