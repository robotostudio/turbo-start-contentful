import { Badge } from "@workspace/ui/components/badge";

import type {
  CallToActionFields,
  SerializedEntry,
} from "@/lib/contentful-serializer";

import { ContentfulRichText } from "../contentful-richtext";

export type CTABlockProps = SerializedEntry<CallToActionFields>;

export function CTABlock({ fields }: CTABlockProps) {
  const { title, eyebrow, richText } = fields;
  return (
    <section id="features" className="my-6 md:my-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="bg-muted py-16 rounded-3xl px-4">
          <div className="text-center max-w-3xl mx-auto space-y-8">
            {eyebrow && (
              <Badge
                variant="secondary"
                className="bg-zinc-200 dark:text-black"
              >
                {eyebrow}
              </Badge>
            )}
            <h2 className="text-3xl font-semibold md:text-5xl text-balance">
              {title}
            </h2>
            <div className="text-lg text-muted-foreground">
              <ContentfulRichText
                richText={richText}
                className="text-balance"
              />
            </div>
            <div className="flex justify-center">
              {/* <SanityButtons
                buttons={buttons}
                buttonClassName="w-full sm:w-auto"
                className="w-full sm:w-fit grid gap-2 sm:grid-flow-col lg:justify-start mb-8"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
