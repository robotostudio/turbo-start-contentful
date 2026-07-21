"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { Plus } from "lucide-react";
import type * as React from "react";

import { cn } from "@workspace/ui/lib/utils";

function Accordion(props: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b border-border", className)}
      data-slot="accordion-item"
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 items-center justify-between py-4 text-left font-medium text-sm outline-hidden transition-all hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        data-slot="accordion-trigger"
        {...props}
      >
        {children}
        <Plus className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-panel-open:rotate-45" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Panel>) {
  return (
    <AccordionPrimitive.Panel
      className="h-[var(--accordion-panel-height)] overflow-hidden text-sm transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0"
      data-slot="accordion-content"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
