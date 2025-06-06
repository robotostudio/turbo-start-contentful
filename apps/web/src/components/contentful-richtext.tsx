import {
  documentToReactComponents,
  type Options,
} from "@contentful/rich-text-react-renderer";
import type { Block, Inline } from "@contentful/rich-text-types";
import {
  BLOCKS,
  type Document,
  INLINES,
  MARKS,
} from "@contentful/rich-text-types";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

import type { Maybe } from "@/types";

import { ContentfulImage } from "./contentful-image";

// Utility function to generate slugs from text content
function generateSlug(node: Block | Inline): string {
  if (!node || !node.content) return "";

  return node.content
    .filter((child) => child.nodeType === "text")
    .map((child) => child?.nodeType === "text" && child.value)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const renderOptions: Options = {
  renderNode: {
    [BLOCKS.HEADING_2]: (node, children) => {
      const slug = generateSlug(node);
      return (
        <h2
          id={slug}
          className="scroll-m-20 border-b pb-2 text-3xl font-semibold first:mt-0"
        >
          {children}
        </h2>
      );
    },
    [BLOCKS.HEADING_3]: (node, children) => {
      const slug = generateSlug(node);
      return (
        <h3 id={slug} className="scroll-m-20 text-2xl font-semibold">
          {children}
        </h3>
      );
    },
    [BLOCKS.HEADING_4]: (node, children) => {
      const slug = generateSlug(node);
      return (
        <h4 id={slug} className="scroll-m-20 text-xl font-semibold">
          {children}
        </h4>
      );
    },
    [BLOCKS.HEADING_5]: (node, children) => {
      const slug = generateSlug(node);
      return (
        <h5 id={slug} className="scroll-m-20 text-lg font-semibold">
          {children}
        </h5>
      );
    },
    [BLOCKS.HEADING_6]: (node, children) => {
      const slug = generateSlug(node);
      return (
        <h6 id={slug} className="scroll-m-20 text-base font-semibold">
          {children}
        </h6>
      );
    },
    [BLOCKS.PARAGRAPH]: (node, children) => <p>{children}</p>,
    [BLOCKS.UL_LIST]: (node, children) => <ul>{children}</ul>,
    [BLOCKS.OL_LIST]: (node, children) => <ol>{children}</ol>,
    [BLOCKS.LIST_ITEM]: (node, children) => <li>{children}</li>,
    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-4" />,
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const asset = node.data?.target;
      if (!asset?.fields) return null;

      const { file, title, description } = asset.fields;
      if (!file?.url) return null;

      const url = file.url.startsWith("//") ? `https:${file.url}` : file.url;
      const isImage = file.contentType?.startsWith("image/");

      if (isImage) {
        return (
          <div className="my-4">
            <ContentfulImage
              image={file}
              className="w-full h-auto rounded-lg"
              width={file.details?.image?.width || 1600}
              quality={80}
            />
          </div>
        );
      }

      // For non-image assets, render a download link
      return (
        <div className="my-4">
          <a
            href={url}
            download
            className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            📎 {title || file.fileName || "Download file"}
          </a>
        </div>
      );
    },
    [INLINES.HYPERLINK]: (node, children) => {
      const uri = node.data?.uri;
      if (!uri) {
        return (
          <span className="underline decoration-dotted underline-offset-2">
            Link Broken
          </span>
        );
      }

      const isExternal = uri.startsWith("http") || uri.startsWith("//");

      return (
        <Link
          className="underline decoration-dotted underline-offset-2"
          href={uri}
          prefetch={false}
          aria-label={`Link to ${uri}`}
          target={isExternal ? "_blank" : "_self"}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          {children}
        </Link>
      );
    },
    [INLINES.ENTRY_HYPERLINK]: (node, children) => {
      const entry = node.data?.target;
      if (!entry?.fields?.slug) {
        return (
          <span className="underline decoration-dotted underline-offset-2">
            Link Broken
          </span>
        );
      }

      return (
        <Link
          className="underline decoration-dotted underline-offset-2"
          href={`/${entry.fields.slug}`}
          prefetch={false}
        >
          {children}
        </Link>
      );
    },
  },
  renderMark: {
    [MARKS.BOLD]: (text) => <strong>{text}</strong>,
    [MARKS.ITALIC]: (text) => <em>{text}</em>,
    [MARKS.UNDERLINE]: (text) => <u>{text}</u>,
    [MARKS.CODE]: (text) => (
      <code className="rounded-md border border-white/10 bg-opacity-5 p-1 text-sm lg:whitespace-nowrap">
        {text}
      </code>
    ),
  },
};

export interface ContentfulRichTextProps {
  richText?: Maybe<Document>;
  className?: string;
}

export function ContentfulRichText({
  richText,
  className,
}: ContentfulRichTextProps) {
  if (!richText) return null;

  return (
    <div
      className={cn(
        "prose prose-zinc prose-headings:scroll-m-24 prose-headings:text-opacity-90 prose-p:text-opacity-80 prose-a:decoration-dotted prose-ol:text-opacity-80 prose-ul:text-opacity-80 prose-h2:border-b prose-h2:pb-2 prose-h2:text-3xl prose-h2:font-semibold prose-h2:first:mt-0 max-w-none dark:prose-invert",
        className,
      )}
    >
      {documentToReactComponents(richText as Document, renderOptions)}
    </div>
  );
}
