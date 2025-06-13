"use client";
import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from "@contentful/live-preview/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Badge } from "@workspace/ui/components/badge";

import type { TypeFaqAccordion } from "@/lib/contentful/types";

import { ContentfulRichText } from "../contentful-richtext";

export type FaqAccordionProps = TypeFaqAccordion<"WITHOUT_UNRESOLVABLE_LINKS">;

export function FaqAccordion(props: FaqAccordionProps) {
  const updatedProps = useContentfulLiveUpdates(props);
  const { eyebrow, title, subtitle, faqs } = updatedProps.fields ?? {};
  const inspectorProps = useContentfulInspectorMode({
    entryId: updatedProps.sys.id,
  });
  return (
    <section id="faq" className="my-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
            <Badge
              variant="secondary"
              {...inspectorProps({ fieldId: "eyebrow" })}
            >
              {eyebrow}
            </Badge>
            <h2
              className="text-3xl font-semibold md:text-5xl"
              {...inspectorProps({ fieldId: "title" })}
            >
              {title}
            </h2>
            <h3
              className="text-lg font-normal text-[#374151] text-balance dark:text-zinc-400"
              {...inspectorProps({ fieldId: "subtitle" })}
            >
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
            {...inspectorProps({ fieldId: "faqs" })}
          >
            {faqs?.map((faq, index) => (
              <AccordionItem
                value={faq?.sys.id || `faq-${index}`}
                key={`AccordionItem-${faq?.sys.id || `faq-${index}`}-${index}`}
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
