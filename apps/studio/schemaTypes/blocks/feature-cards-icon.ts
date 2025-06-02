import { LayoutGrid } from "lucide-react";
import { defineField } from "sanity";
import { defineType } from "sanity";
import { preview } from "sanity-plugin-icon-picker";

import { iconField } from "../common";
import { customRichText } from "../definitions/rich-text";

const featureCardIcon = defineField({
  name: "featureCardIcon",
  type: "object",
  fields: [
    iconField,
    defineField({
      name: "title",
      type: "string",
    }),
    customRichText(["block"]),
  ],
  preview: {
    select: {
      title: "title",
      icon: "icon",
    },
    prepare: ({ title, icon }) => {
      return {
        title: `${title ?? "Untitled"}`,
        media: icon ? preview(icon) : null,
      };
    },
  },
});

export const featureCardsIcon = defineType({
  name: "featureCardsIcon",
  type: "object",
  icon: LayoutGrid,
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
    }),
    defineField({
      name: "title",
      type: "string",
    }),
    customRichText(["block"]),
    defineField({
      name: "cards",
      type: "array",
      of: [featureCardIcon],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title,
      subtitle: "Feature Cards with Icon",
    }),
  },
});
