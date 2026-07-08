/**
 * Serializes a `pageBuilder` array to semantic Markdown by dispatching each
 * block on its `contentType.sys.id` — mirroring `BLOCK_COMPONENTS` in
 * `components/pagebuilder.tsx`, but emitting headings + text instead of React.
 *
 * The registry is the fail-safe: an **unknown block type serializes to `""`**,
 * so a component can never leak into Markdown as a raw tag. When you add a new
 * page-builder block, add its serializer here too (see CLAUDE.md).
 */

import type {
  TypeButton,
  TypeCallToAction,
  TypeFaqAccordion,
  TypeFeatureCards,
  TypeHero,
} from "@/lib/contentful/types";
import { getButtonUrl } from "@/lib/contentful-utils";

import {
  assetToMarkdown,
  escapeMarkdown,
  formatUrl,
  type MarkdownAsset,
  richTextToMarkdown,
} from "./rich-text-to-markdown";

type Links = "WITHOUT_UNRESOLVABLE_LINKS";

interface ResolvedBlock {
  sys?: { type?: string; contentType?: { sys?: { id?: string } } };
  fields?: Record<string, unknown>;
}

export type MarkdownPageBuilder =
  | ReadonlyArray<ResolvedBlock | undefined>
  | null
  | undefined;

function joinSections(sections: Array<string | null | undefined>): string {
  return sections.filter((section) => section?.trim()).join("\n\n");
}

function heading(title: string | undefined | null, level: 1 | 2 | 3): string {
  const text = title?.trim();
  return text ? `${"#".repeat(level)} ${escapeMarkdown(text)}` : "";
}

function eyebrow(text: string | undefined | null): string {
  const value = text?.trim();
  return value ? `**${escapeMarkdown(value)}**` : "";
}

function paragraph(text: string | undefined | null): string {
  const value = text?.trim();
  return value ? escapeMarkdown(value) : "";
}

function mdLink(label: string, href: string | null | undefined): string {
  const text = label.trim();
  if (!text) {
    return "";
  }
  return href
    ? `[${escapeMarkdown(text)}](${formatUrl(href)})`
    : escapeMarkdown(text);
}

function buttonsToMarkdown(
  buttons: ReadonlyArray<TypeButton<Links, string> | undefined> | undefined,
): string {
  if (!buttons?.length) {
    return "";
  }
  return buttons
    .map((button) => {
      if (!button?.fields) {
        return null;
      }
      const label = button.fields.label?.trim();
      if (!label) {
        return null;
      }
      return `- ${mdLink(label, getButtonUrl(button))}`;
    })
    .filter(Boolean)
    .join("\n");
}

function heroToMarkdown(block: TypeHero<Links, string>): string {
  const f = block.fields;
  if (!f) {
    return "";
  }
  return joinSections([
    eyebrow(f.badge),
    heading(f.title, 1),
    richTextToMarkdown(f.richText),
    assetToMarkdown(f.image as MarkdownAsset | undefined),
    buttonsToMarkdown(f.buttons),
  ]);
}

function faqAccordionToMarkdown(
  block: TypeFaqAccordion<Links, string>,
): string {
  const f = block.fields;
  if (!f) {
    return "";
  }
  const items = (f.faqs ?? [])
    .map((faq) => {
      const ff = faq?.fields;
      if (!ff) {
        return "";
      }
      return joinSections([
        heading(ff.question, 3),
        richTextToMarkdown(ff.answer),
      ]);
    })
    .filter((item) => item.trim())
    .join("\n\n");

  return joinSections([
    eyebrow(f.eyebrow),
    heading(f.title, 2),
    paragraph(f.subtitle),
    items,
    f.link ? mdLink("Get in touch with sales", f.link) : "",
  ]);
}

function featureCardsToMarkdown(
  block: TypeFeatureCards<Links, string>,
): string {
  const f = block.fields;
  if (!f) {
    return "";
  }
  const cards = (f.cards ?? [])
    .map((card) => {
      const cf = card?.fields;
      if (!cf) {
        return "";
      }
      // Icon is intentionally dropped from Markdown.
      const title =
        cf.cardLink && cf.title?.trim()
          ? `### ${mdLink(cf.title, cf.cardLink)}`
          : heading(cf.title, 3);
      return joinSections([title, richTextToMarkdown(cf.richText)]);
    })
    .filter((card) => card.trim())
    .join("\n\n");

  return joinSections([
    eyebrow(f.eyebrow),
    heading(f.title, 2),
    richTextToMarkdown(f.richText),
    cards,
  ]);
}

function callToActionToMarkdown(
  block: TypeCallToAction<Links, string>,
): string {
  const f = block.fields;
  if (!f) {
    return "";
  }
  // The newsletter form is interactive → intentionally dropped from Markdown.
  return joinSections([
    eyebrow(f.eyebrow),
    heading(f.title, 2),
    richTextToMarkdown(f.richText),
    buttonsToMarkdown(f.buttons),
    richTextToMarkdown(f.helperText),
  ]);
}

const SERIALIZERS: Record<string, (block: never) => string> = {
  hero: heroToMarkdown as (block: never) => string,
  faqAccordion: faqAccordionToMarkdown as (block: never) => string,
  featureCards: featureCardsToMarkdown as (block: never) => string,
  callToAction: callToActionToMarkdown as (block: never) => string,
};

function resolvedTypeId(block: ResolvedBlock | undefined): string | null {
  const sys = block?.sys;
  if (!sys || sys.type === "Link" || !block?.fields) {
    return null;
  }
  const id = sys.contentType?.sys?.id;
  return typeof id === "string" ? id : null;
}

export function pageBuilderToMarkdown(
  pageBuilder: MarkdownPageBuilder,
): string {
  if (!pageBuilder?.length) {
    return "";
  }
  return pageBuilder
    .map((block) => {
      const id = resolvedTypeId(block);
      const serialize = id ? SERIALIZERS[id] : undefined;
      return serialize ? serialize(block as never) : "";
    })
    .filter((section) => section.trim())
    .join("\n\n");
}
