/**
 * Serializes a Contentful rich-text `Document` to semantic Markdown.
 *
 * Contentful ships no official rich-text → Markdown renderer, so this is a
 * hand-written walk of the node tree — the Markdown analogue of
 * `contentful-richtext.tsx`. Author text is escaped so literal metacharacters
 * (`user_name`, `foo[bar]`) are not reinterpreted as formatting, and unknown /
 * embedded blocks degrade to text or `""` rather than leaking markup.
 */

import type {
  Block,
  Document,
  Inline,
  Text,
} from "@contentful/rich-text-types";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";

import { isSafeUri } from "@/lib/uri";

export type RichTextDocument = Document | null | undefined;

/** A resolved Contentful asset as it appears on a rich-text embed / link. */
export interface MarkdownAsset {
  fields?: {
    title?: string;
    description?: string;
    file?: {
      url?: string;
      contentType?: string;
      fileName?: string;
    };
  };
}

type RichTextNode = Block | Inline | Text;

/** Escapes Markdown metacharacters (and `<`/`>`) in author-supplied text. */
export function escapeMarkdown(text: string): string {
  return text.replace(/([\\`*_{}[\]<>|~])/g, "\\$1");
}

/** Makes a URL safe as a Markdown link target (parens/spaces break `](url)`). */
export function formatUrl(url: string): string {
  return url
    .trim()
    .replace(/ /g, "%20")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
}

/** Resolves a Contentful asset to an absolute URL (protocol-relative → https). */
export function resolveAssetUrl(asset?: MarkdownAsset | null): string | null {
  const url = asset?.fields?.file?.url;
  if (!url) {
    return null;
  }
  return url.startsWith("//") ? `https:${url}` : url;
}

/** `![alt](url)` for image assets, a `[label](url)` link otherwise, else text. */
export function assetToMarkdown(asset?: MarkdownAsset | null): string {
  const url = resolveAssetUrl(asset);
  const alt = (asset?.fields?.description ?? asset?.fields?.title ?? "").trim();
  const fileName = asset?.fields?.file?.fileName ?? "";
  const isImage = asset?.fields?.file?.contentType?.startsWith("image/");
  if (!url) {
    return escapeMarkdown(alt);
  }
  if (isImage) {
    return `![${escapeMarkdown(alt)}](${formatUrl(url)})`;
  }
  const label = alt || fileName || "Download file";
  return `[${escapeMarkdown(label)}](${formatUrl(url)})`;
}

function isText(node: RichTextNode): node is Text {
  return node.nodeType === "text";
}

function hasMark(node: Text, type: string): boolean {
  return node.marks.some((mark) => mark.type === type);
}

/** Wraps a code span in a backtick fence longer than any run inside it. */
function codeSpan(value: string): string {
  const runs = value.match(/`+/g);
  const fence = "`".repeat(
    (runs ? Math.max(...runs.map((r) => r.length)) : 0) + 1,
  );
  // Pad when the value starts/ends with a backtick so the fence stays distinct.
  const pad = value.startsWith("`") || value.endsWith("`") ? " " : "";
  return `${fence}${pad}${value}${pad}${fence}`;
}

function renderText(node: Text): string {
  // Code spans are literal — don't escape inside backticks.
  let text = hasMark(node, MARKS.CODE)
    ? codeSpan(node.value)
    : escapeMarkdown(node.value);
  if (hasMark(node, MARKS.BOLD)) {
    text = `**${text}**`;
  }
  if (hasMark(node, MARKS.ITALIC)) {
    text = `_${text}_`;
  }
  // Underline has no Markdown equivalent — rendered as plain text.
  return text;
}

function renderInlineChildren(node: Block | Inline): string {
  return node.content.map((child) => renderInline(child)).join("");
}

function entryHref(target: unknown): string | null {
  const slug = (target as { fields?: { slug?: string } } | undefined)?.fields
    ?.slug;
  if (!slug) {
    return null;
  }
  return slug.startsWith("/") ? slug : `/${slug}`;
}

function renderInline(node: RichTextNode): string {
  if (isText(node)) {
    return renderText(node);
  }

  switch (node.nodeType) {
    case INLINES.HYPERLINK: {
      const uri = node.data?.["uri"] as string | undefined;
      const label = renderInlineChildren(node);
      return uri && isSafeUri(uri) ? `[${label}](${formatUrl(uri)})` : label;
    }
    case INLINES.ENTRY_HYPERLINK: {
      const href = entryHref(node.data?.["target"]);
      const label = renderInlineChildren(node);
      return href ? `[${label}](${href})` : label;
    }
    case INLINES.ASSET_HYPERLINK: {
      const url = resolveAssetUrl(node.data?.["target"] as MarkdownAsset);
      const label = renderInlineChildren(node);
      return url ? `[${label}](${formatUrl(url)})` : label;
    }
    case INLINES.EMBEDDED_ENTRY:
      return "";
    default:
      return "content" in node ? renderInlineChildren(node) : "";
  }
}

const HEADING_LEVEL: Record<string, number> = {
  [BLOCKS.HEADING_1]: 1,
  [BLOCKS.HEADING_2]: 2,
  [BLOCKS.HEADING_3]: 3,
  [BLOCKS.HEADING_4]: 4,
  [BLOCKS.HEADING_5]: 5,
  [BLOCKS.HEADING_6]: 6,
};

function renderList(node: Block, ordered: boolean, depth: number): string {
  return node.content
    .map((item, index) => renderListItem(item as Block, ordered, index, depth))
    .join("\n");
}

function renderListItem(
  item: Block,
  ordered: boolean,
  index: number,
  depth: number,
): string {
  const indent = "  ".repeat(depth);
  const marker = ordered ? `${index + 1}.` : "-";
  const lines: string[] = [];
  const nested: string[] = [];

  for (const child of item.content) {
    if (
      child.nodeType === BLOCKS.UL_LIST ||
      child.nodeType === BLOCKS.OL_LIST
    ) {
      nested.push(
        renderList(
          child as Block,
          child.nodeType === BLOCKS.OL_LIST,
          depth + 1,
        ),
      );
    } else {
      const rendered = renderBlock(child as Block);
      if (rendered.trim()) {
        lines.push(rendered);
      }
    }
  }

  let out = `${indent}${marker} ${lines.join(" ").trim()}`.trimEnd();
  if (nested.length) {
    out += `\n${nested.join("\n")}`;
  }
  return out;
}

function renderBlock(node: Block): string {
  const level = HEADING_LEVEL[node.nodeType];
  if (level) {
    const text = renderInlineChildren(node).trim();
    return text ? `${"#".repeat(level)} ${text}` : "";
  }

  switch (node.nodeType) {
    case BLOCKS.PARAGRAPH:
      return renderInlineChildren(node).trim();
    case BLOCKS.UL_LIST:
      return renderList(node, false, 0);
    case BLOCKS.OL_LIST:
      return renderList(node, true, 0);
    case BLOCKS.QUOTE: {
      const inner = node.content
        .map((child) => renderBlock(child as Block))
        .filter((block) => block.trim())
        .join("\n\n");
      return inner
        .split("\n")
        .map((line) => (line ? `> ${line}` : ">"))
        .join("\n");
    }
    case BLOCKS.HR:
      return "---";
    case BLOCKS.EMBEDDED_ASSET:
      return assetToMarkdown(node.data?.["target"] as MarkdownAsset);
    // Unknown / embedded entry blocks serialize to "" — never leak as markup.
    default:
      return "";
  }
}

/** Walks a Contentful rich-text `Document` and returns semantic Markdown. */
export function richTextToMarkdown(doc: RichTextDocument): string {
  if (!doc?.content) {
    return "";
  }
  return doc.content
    .map((node) => renderBlock(node as Block))
    .filter((block) => block.trim())
    .join("\n\n");
}
