import { Badge } from "@workspace/ui/components/badge";

import type {
  FeatureCardFields,
  FeatureCardsFields,
  SerializedEntry,
} from "@/lib/contentful-serializer";

import { ContentfulImage } from "../contentful-image";
import { ContentfulRichText } from "../contentful-richtext";

type FeatureCardsWithIconProps = SerializedEntry<FeatureCardsFields>;

type FeatureCardProps = {
  card?: SerializedEntry<FeatureCardFields>;
};

function FeatureCard({ card }: FeatureCardProps) {
  const { title, icon, richText } = card?.fields ?? {};
  console.log("🚀 ~ FeatureCard ~ icon:", icon);
  return (
    <div className="rounded-3xl bg-accent p-8 md:min-h-[300px] md:p-8">
      <span className="mb-9 flex w-fit p-3 items-center justify-center rounded-full bg-background drop-shadow-xl">
        {icon && <ContentfulImage image={icon} />}
      </span>

      <div>
        <h3 className="text-lg font-medium md:text-2xl mb-2">{title}</h3>
        <ContentfulRichText
          richText={richText}
          className="font-normal text-sm md:text-[16px] text-black/90 leading-7 text-balance dark:text-neutral-300"
        />
      </div>
    </div>
  );
}

export function FeatureCardsWithIcon({ fields }: FeatureCardsWithIconProps) {
  const { eyebrow, title, richText, cards } = fields;

  return (
    <section id="features" className="my-6 md:my-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
            <Badge variant="secondary">{eyebrow}</Badge>
            <h2 className="text-3xl font-semibold md:text-5xl">{title}</h2>
            <ContentfulRichText
              richText={richText}
              className="text-base md:text-lg text-balance max-w-3xl"
            />
          </div>
        </div>
        <div className="mx-auto mt-20 grid gap-8 lg:grid-cols-3">
          {cards?.map((card, index) => {
            const serializedCard =
              card as unknown as SerializedEntry<FeatureCardFields>;
            return (
              <FeatureCard
                key={`FeatureCard-${serializedCard.id}-${index}`}
                card={serializedCard}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
