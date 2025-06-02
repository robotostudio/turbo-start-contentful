import { ImageIcon, ImagesIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { buttonsField, richTextField } from "../common";

const imageLinkCard = defineField({
  name: "imageLinkCard",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "title",
      title: "Card Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Card Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Card Image",
      type: "image",
      description: "Add an image or illustration for this card",
    }),
    defineField({
      name: "url",
      title: "Link URL",
      type: "customUrl",
    }),
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
      media: "image",
      externalUrl: "url.external",
      urlType: "url.type",
      internalUrl: "url.internal.slug.current",
      openInNewTab: "url.openInNewTab",
    },
    prepare: ({
      title,
      description,
      media,
      externalUrl,
      urlType,
      internalUrl,
      openInNewTab,
    }) => {
      const url = urlType === "external" ? externalUrl : internalUrl;
      const newTabIndicator = openInNewTab ? " ↗" : "";
      const truncatedUrl =
        url?.length > 30 ? `${url.substring(0, 30)}...` : url;
      const truncatedDesc =
        description?.length > 50
          ? `${description.substring(0, 50)}...`
          : description;

      return {
        title: title || "Untitled Card",
        subtitle:
          truncatedDesc + (url ? ` • ${truncatedUrl}${newTabIndicator}` : ""),
        media,
      };
    },
  },
});

export const imageLinkCards = defineType({
  name: "imageLinkCards",
  type: "object",
  icon: ImagesIcon,
  title: "Image Link Cards",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow Text",
      type: "string",
      description: "Optional text displayed above the title",
    }),
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      description: "The main heading for this cards section",
      validation: (Rule) => Rule.required(),
    }),
    richTextField,
    buttonsField,
    defineField({
      name: "cards",
      title: "Cards",
      type: "array",
      of: [imageLinkCard],
    }),
  ],
  preview: {
    select: {
      title: "title",
      eyebrow: "eyebrow",
      cards: "cards",
    },
    prepare: ({ title, eyebrow, cards = [] }) => ({
      title: title || "Image Link Cards",
      subtitle: `${eyebrow ? `${eyebrow} • ` : ""}${cards.length} card${cards.length === 1 ? "" : "s"}`,
    }),
  },
});
