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
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { TypeFaqAccordion } from "@/lib/contentful/types";

import { ContentfulRichText } from "../contentful-richtext";

export type FaqAccordionProps = TypeFaqAccordion<"WITHOUT_UNRESOLVABLE_LINKS">;

export function FaqAccordion(props: FaqAccordionProps) {
  const updatedProps = useContentfulLiveUpdates(props);
  const { eyebrow, title, subtitle, faqs, link } = updatedProps.fields ?? {};
  const inspectorProps = useContentfulInspectorMode({
    entryId: updatedProps.sys.id,
  });
  return (
    <section id="faq" className="my-8 relative">
      <div className="container relative mx-auto px-4 md:px-6">
        <div className="flex w-full flex-col items-center relative z-10">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
            <Badge {...inspectorProps({ fieldId: "eyebrow" })}>{eyebrow}</Badge>
            <h2
              className="text-3xl font-medium md:text-5xl text-zinc-900 dark:text-zinc-100 tracking-[-0.96px]"
              {...inspectorProps({ fieldId: "title" })}
            >
              {title}
            </h2>
            <h3
              className="text-lg font-normal text-zinc-700 text-balance dark:text-zinc-400"
              {...inspectorProps({ fieldId: "subtitle" })}
            >
              {subtitle}
            </h3>
          </div>
        </div>
        <div className="my-[76px] max-w-[700px] mx-auto relative z-10">
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
                className="my-4 border-none px-4 py-2 text-lg hover:no-underline group bg-white dark:bg-zinc-900 rounded-2xl"
              >
                <AccordionTrigger className="h-full">
                  {faq?.fields?.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <ContentfulRichText
                    richText={faq?.fields?.answer}
                    className="text-sm md:text-base"
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          {link && (
            <div className="w-full py-6 text-center flex flex-col items-center">
              <p className="mb-1 text-lg text-zinc-700 dark:text-zinc-400">
                More questions?
              </p>
              <Link href={link ?? "#"} className="flex items-center gap-2">
                <p className="text-lg font-medium leading-7">
                  Get in touch with sales
                </p>
                <Badge className="rounded-full p-1">
                  <ArrowUpRight
                    size={20}
                    className="text-[#374151] dark:text-neutral-300"
                  />
                </Badge>
              </Link>
            </div>
          )}
        </div>
        <div className="absolute size-[300px] bottom-0 right-[50px] bg-[#EDE5F5] dark:bg-[#2e1044] blur-[125px] rounded-full z-0" />
        <div className="absolute size-[300px] top-[100px] left-[50px] bg-[#F3E7EA] dark:bg-[#411044] blur-[125px] rounded-full z-0" />
      </div>
    </section>
  );
}
