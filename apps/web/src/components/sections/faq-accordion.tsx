"use client";
import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from "@contentful/live-preview/react";
import { Badge } from "@workspace/ui/components/badge";
import { ArrowUpRight, ChevronDown } from "lucide-react";
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
    <section id="faq" className="my-8 md:my-14 relative">
      <div className="container relative">
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
              className="text-base md:text-lg text-balance max-w-3xl text-zinc-700 dark:text-zinc-300"
              {...inspectorProps({ fieldId: "subtitle" })}
            >
              {subtitle}
            </h3>
          </div>
        </div>
        <div className="mt-[76px] max-w-[700px] mx-auto relative z-10">
          <div className="w-full" {...inspectorProps({ fieldId: "faqs" })}>
            {faqs?.map((faq, index) => {
              const itemId = faq?.sys.id ?? `faq-${index}`;
              return (
                <details
                  key={itemId}
                  name={`faq-${updatedProps.sys.id}`}
                  open={index === 0}
                  className="faq-disclosure group my-4 rounded-2xl bg-white dark:bg-zinc-900 px-4 py-2 text-lg"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
                    <h3 className="font-medium text-base">
                      {faq?.fields?.question}
                    </h3>
                    <ChevronDown className="pointer-events-none size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  {faq?.fields?.answer ? (
                    <div className="pb-2 text-muted-foreground">
                      <ContentfulRichText
                        richText={faq.fields.answer}
                        className="text-sm md:text-base"
                      />
                    </div>
                  ) : null}
                </details>
              );
            })}
          </div>
          {link && (
            <div className="w-full py-6 text-center flex flex-col items-center">
              <p className="mb-1 text-lg text-zinc-700 dark:text-zinc-400">
                More questions?
              </p>
              <Link href={link} className="flex items-center gap-2">
                <p className="text-lg font-medium leading-7">
                  Get in touch with sales
                </p>
                <Badge className="rounded-full p-1 before:rounded-full">
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
