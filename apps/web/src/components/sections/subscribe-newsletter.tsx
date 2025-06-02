"use client";
import { Button } from "@workspace/ui/components/button";
import { ChevronRight, LoaderCircle } from "lucide-react";
import Form from "next/form";
import { useFormStatus } from "react-dom";

import { newsletterSubmission } from "@/action/newsletter-submission";
import type { PagebuilderType } from "@/types";

import { RichText } from "../richtext";

// const InteractiveGridPattern = dynamic(
//   () =>
//     import("@workspace/ui/components/interactive-grid-pattern").then(
//       (mod) => mod.InteractiveGridPattern,
//     ),
//   {
//     ssr: false,
//   },
// );

type SubscribeNewsletterProps = PagebuilderType<"subscribeNewsletter">;
export default function SubscribeNewsletterButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      size="icon"
      type="submit"
      disabled={pending}
      className="size-8 aspect-square bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
      aria-label={pending ? "Subscribing..." : "Subscribe to newsletter"}
    >
      <span className="flex items-center justify-center gap-2">
        {pending ? (
          <LoaderCircle
            className="animate-spin text-black"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        ) : (
          <ChevronRight
            className="text-black dark:text-neutral-300"
            size={16}
            strokeWidth={2}
            aria-hidden="true"
          />
        )}
      </span>
    </Button>
  );
}

export function SubscribeNewsletter({
  title,
  subTitle,
  helperText,
}: SubscribeNewsletterProps) {
  return (
    <section id="subscribe" className="px-4 py-8 sm:py-12 md:py-16">
      <div className="relative container mx-auto px-4 md:px-8 py-8 sm:py-16 md:py-24 lg:py-32 bg-gray-50 dark:bg-zinc-900 rounded-3xl overflow-hidden">
        <div className="relative z-10 mx-auto text-center">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-neutral-300 sm:text-3xl md:text-5xl text-balance">
            {title}
          </h2>
          {subTitle && (
            <RichText
              richText={subTitle}
              className="mb-6 text-sm text-gray-600 sm:mb-8 text-balance sm:text-base dark:text-neutral-300"
            />
          )}
          <Form
            className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-2"
            action={newsletterSubmission}
          >
            <div className="flex bg-white dark:bg-zinc-200 items-center border rounded-xl p-2 drop-shadow-lg md:w-96 justify-between pl-4">
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email address"
                className="rounded-e-none border-e-0 focus-visible:ring-0 outline-none bg-transparent w-full dark:text-zinc-900 dark:placeholder:text-zinc-900"
              />
              <SubscribeNewsletterButton />
            </div>
          </Form>
          {helperText && (
            <RichText
              richText={helperText}
              className="mt-3 text-sm text-gray-800 opacity-80 sm:mt-4 dark:text-neutral-300"
            />
          )}
        </div>
        {/* <InteractiveGridPattern
          className={cn(
            "absolute scale-125 inset-0 -z-0 w-full opacity-50",
            "[mask-image:radial-gradient(1000px_circle_at_center,transparent,white)]",
          )}
        /> */}
      </div>
    </section>
  );
}
