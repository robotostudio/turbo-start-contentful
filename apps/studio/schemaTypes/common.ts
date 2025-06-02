import { defineField } from "sanity";

import { GROUP } from "../utils/constant";

export const richTextField = defineField({
  name: "richText",
  type: "richText",
  description:
    "A text editor that lets you add formatting like bold text, links, and bullet points",
});

export const buttonsField = defineField({
  name: "buttons",
  type: "array",
  of: [{ type: "button" }],
  description:
    "Add one or more clickable buttons that visitors can use to navigate your website",
});

export const pageBuilderField = defineField({
  name: "pageBuilder",
  group: GROUP.MAIN_CONTENT,
  type: "pageBuilder",
  description:
    "Build your page by adding different sections like text, images, and other content blocks",
});

export const iconField = defineField({
  name: "icon",
  title: "Icon",
  options: {
    storeSvg: true,
    providers: ["fi"],
  },
  type: "iconPicker",
  description:
    "Choose a small picture symbol to represent this item, like a home icon or shopping cart",
});
