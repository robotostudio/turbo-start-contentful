import type { Block, Inline, Text } from "@contentful/rich-text-types";
import { BLOCKS, type Document, INLINES } from "@contentful/rich-text-types";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronDown, Circle } from "lucide-react";
import Link from "next/link";
import { type FC, useCallback, useMemo } from "react";

interface TableOfContentProps {
  richText?: Document | null;
  className?: string;
  maxDepth?: number;
}

interface ProcessedHeading {
  readonly id: string;
  readonly text: string;
  readonly href: string;
  readonly level: number;
  readonly nodeType: string;
  readonly children: ProcessedHeading[];
  readonly isChild: boolean;
}

interface AnchorProps {
  readonly heading: ProcessedHeading;
  readonly maxDepth?: number;
  readonly currentDepth?: number;
}

interface TableOfContentState {
  readonly shouldShow: boolean;
  readonly headings: ProcessedHeading[];
  readonly error?: string;
}

const HEADING_BLOCKS = [
  BLOCKS.HEADING_2,
  BLOCKS.HEADING_3,
  BLOCKS.HEADING_4,
  BLOCKS.HEADING_5,
  BLOCKS.HEADING_6,
] as const;

const HEADING_LEVELS: Record<string, number> = {
  [BLOCKS.HEADING_2]: 2,
  [BLOCKS.HEADING_3]: 3,
  [BLOCKS.HEADING_4]: 4,
  [BLOCKS.HEADING_5]: 5,
  [BLOCKS.HEADING_6]: 6,
} as const;

const DEFAULT_MAX_DEPTH = 6;
const MIN_HEADINGS_TO_SHOW = 1;

function isHeadingNode(node: Block | Inline | Text): boolean {
  return (
    node &&
    typeof node === "object" &&
    "nodeType" in node &&
    HEADING_BLOCKS.includes(node.nodeType as (typeof HEADING_BLOCKS)[number])
  );
}

function hasValidContent(node: Block | Inline | Text): boolean {
  return (
    node &&
    "content" in node &&
    Array.isArray(node.content) &&
    node.content.length > 0
  );
}

function extractTextFromNode(node: Block | Inline | Text): string {
  if (!node) return "";

  // If it's a text node, return its value
  if (node.nodeType === "text" && "value" in node) {
    return node.value.trim();
  }

  // If it has content, recursively extract text
  if ("content" in node && Array.isArray(node.content)) {
    return node.content
      .map(extractTextFromNode)
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  return "";
}

function createSlug(text: string): string {
  if (!text?.trim()) {
    return "";
  }

  try {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  } catch (error) {
    console.warn("Failed to create slug for text:", text, error);
    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  }
}

function generateUniqueId(text: string, index: number): string {
  const baseId = createSlug(text) || `heading-${index}`;
  return `toc-${baseId}`;
}

function extractHeadingNodes(richText: Document): Block[] {
  if (!richText || !Array.isArray(richText.content)) {
    return [];
  }

  function findHeadings(nodes: (Block | Inline | Text)[]): Block[] {
    const headings: Block[] = [];

    for (const node of nodes) {
      if (isHeadingNode(node) && hasValidContent(node)) {
        headings.push(node as Block);
      }

      // Recursively search in nested content
      if ("content" in node && Array.isArray(node.content)) {
        headings.push(...findHeadings(node.content));
      }
    }

    return headings;
  }

  try {
    return findHeadings(richText.content);
  } catch (error) {
    console.error("Failed to extract heading nodes:", error);
    return [];
  }
}

function createProcessedHeading(
  node: Block,
  index: number,
): ProcessedHeading | null {
  try {
    const text = extractTextFromNode(node);

    if (!text) {
      return null;
    }

    const level = HEADING_LEVELS[node.nodeType] || 2;
    const slug = createSlug(text);
    const href = `#${slug}`;
    const id = generateUniqueId(text, index);

    return {
      id,
      text,
      href,
      level,
      nodeType: node.nodeType,
      children: [],
      isChild: false,
    };
  } catch (error) {
    console.warn("Failed to create processed heading:", error);
    return null;
  }
}

function buildHeadingHierarchy(
  flatHeadings: ProcessedHeading[],
  maxDepth: number = DEFAULT_MAX_DEPTH,
): ProcessedHeading[] {
  if (flatHeadings.length === 0) {
    return [];
  }

  try {
    const result: ProcessedHeading[] = [];
    const processed = new Set<number>();

    flatHeadings.forEach((heading, index) => {
      if (processed.has(index) || heading.level > maxDepth) {
        return;
      }

      const children = collectChildHeadings(
        flatHeadings,
        index,
        processed,
        maxDepth,
      );

      result.push({
        ...heading,
        children,
      });
    });

    return result;
  } catch (error) {
    console.error("Failed to build heading hierarchy:", error);
    return flatHeadings.map((heading) => ({ ...heading, children: [] }));
  }
}

function collectChildHeadings(
  headings: ProcessedHeading[],
  parentIndex: number,
  processed: Set<number>,
  maxDepth: number,
): ProcessedHeading[] {
  const parentHeading = headings[parentIndex];

  if (!parentHeading || parentHeading.level >= maxDepth) {
    return [];
  }

  const children: ProcessedHeading[] = [];
  const parentLevel = parentHeading.level;

  for (let i = parentIndex + 1; i < headings.length; i++) {
    const currentHeading = headings[i];

    if (!currentHeading || currentHeading.level <= parentLevel) {
      break;
    }

    if (processed.has(i) || currentHeading.level > maxDepth) {
      continue;
    }

    processed.add(i);

    const nestedChildren = collectChildHeadings(
      headings,
      i,
      processed,
      maxDepth,
    );

    children.push({
      ...currentHeading,
      children: nestedChildren,
      isChild: true,
    });
  }

  return children;
}

function processHeadingNodes(
  headingNodes: Block[],
  maxDepth: number = DEFAULT_MAX_DEPTH,
): ProcessedHeading[] {
  if (!Array.isArray(headingNodes) || headingNodes.length === 0) {
    return [];
  }

  try {
    const processedHeadings = headingNodes
      .map(createProcessedHeading)
      .filter((heading): heading is ProcessedHeading => heading !== null);

    return buildHeadingHierarchy(processedHeadings, maxDepth);
  } catch (error) {
    console.error("Failed to process heading nodes:", error);
    return [];
  }
}

function useTableOfContentState(
  richText?: Document | null,
  maxDepth: number = DEFAULT_MAX_DEPTH,
): TableOfContentState {
  return useMemo(() => {
    try {
      if (!richText || !richText.content || !Array.isArray(richText.content)) {
        return {
          shouldShow: false,
          headings: [],
        };
      }

      const headingNodes = extractHeadingNodes(richText);

      if (headingNodes.length < MIN_HEADINGS_TO_SHOW) {
        return {
          shouldShow: false,
          headings: [],
        };
      }

      const processedHeadings = processHeadingNodes(headingNodes, maxDepth);

      return {
        shouldShow: processedHeadings.length >= MIN_HEADINGS_TO_SHOW,
        headings: processedHeadings,
      };
    } catch (error) {
      console.error("Error processing table of contents:", error);
      return {
        shouldShow: false,
        headings: [],
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }, [richText, maxDepth]);
}

const TableOfContentAnchor: FC<AnchorProps> = ({
  heading,
  maxDepth = DEFAULT_MAX_DEPTH,
  currentDepth = 1,
}) => {
  const { href, text, children, isChild, level, id } = heading;

  const shouldRenderChildren = useCallback(() => {
    return (
      Array.isArray(children) && children.length > 0 && currentDepth < maxDepth
    );
  }, [children, currentDepth, maxDepth]);

  // Don't render if we're at max depth and this is a child
  if (currentDepth > maxDepth) {
    return null;
  }

  // Don't render if text or href is invalid
  if (!text?.trim() || !href?.trim()) {
    return null;
  }

  const hasChildren = shouldRenderChildren();

  return (
    <li
      className={cn(
        "list-inside my-2 transition-all duration-200",
        isChild && "ml-1.5",
      )}
    >
      <div className="flex items-center gap-2">
        <Circle
          className={cn(
            "min-w-1.5 min-h-1.5 size-1.5 transition-colors duration-200",
            !isChild
              ? "dark:fill-zinc-100 fill-zinc-900"
              : "dark:fill-zinc-400 fill-zinc-600",
          )}
          aria-hidden="true"
        />
        <Link
          href={href}
          className={cn(
            "hover:text-blue-500 hover:underline line-clamp-1",
            "transition-colors duration-200 focus:outline-none",
            "rounded-sm px-1 py-0.5",
          )}
          aria-describedby={`${id}-level`}
        >
          {text}
        </Link>
        <span id={`${id}-level`} className="sr-only">
          Heading level {level}
        </span>
      </div>

      {hasChildren && (
        <ul className="mt-1">
          {children.map((child, index) => (
            <TableOfContentAnchor
              key={child.id || `${child.text}-${index}-${currentDepth}`}
              heading={child}
              maxDepth={maxDepth}
              currentDepth={currentDepth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export const TableOfContent: FC<TableOfContentProps> = ({
  richText,
  className,
  maxDepth = DEFAULT_MAX_DEPTH,
}) => {
  const { shouldShow, headings, error } = useTableOfContentState(
    richText,
    maxDepth,
  );

  // Early return for error state
  if (error) {
    console.error("Table of Contents error:", error);
    return null;
  }

  // Early return if nothing to show
  if (!shouldShow || headings.length === 0) {
    return null;
  }

  return (
    <aside
      className={cn(
        "sticky top-8 flex flex-col w-full max-w-xs p-4",
        "bg-gradient-to-b from-zinc-50 to-zinc-100",
        "dark:from-zinc-800 dark:to-zinc-900",
        "shadow-sm rounded-lg border border-zinc-300 dark:border-zinc-700",
        "transition-all duration-200",
        className,
      )}
      aria-label="Table of contents"
      role="complementary"
    >
      <details className="group" open>
        <summary
          className={cn(
            "flex cursor-pointer items-center justify-between",
            "text-lg font-semibold text-zinc-800 dark:text-zinc-200",
            "hover:text-blue-600 dark:hover:text-blue-400",
            "transition-colors duration-200 focus:outline-none",
            "rounded-sm p-1",
          )}
          aria-expanded="true"
        >
          <span>Table of Contents</span>
          <ChevronDown
            className={cn(
              "h-5 w-5 transform transition-transform duration-200",
              "group-open:rotate-180",
            )}
            aria-hidden="true"
          />
        </summary>

        <nav className="mt-4 ml-3" aria-label="Document outline">
          <ul className="text-sm space-y-1">
            {headings.map((heading, index) => (
              <TableOfContentAnchor
                key={heading.id || `${heading.text}-${index}`}
                heading={heading}
                maxDepth={maxDepth}
                currentDepth={1}
              />
            ))}
          </ul>
        </nav>
      </details>
    </aside>
  );
};
