import type { Metadata } from "next";

import { capitalize } from "@/utils";

import { getBaseUrl } from "../config";

// Site-wide configuration interface
interface SiteConfig {
  title: string;
  description: string;
  twitterHandle: string;
  keywords: string[];
}

// Page-specific SEO data interface
interface PageSeoData {
  title?: string | undefined;
  description?: string | undefined;
  slug?: string | undefined;
  contentId?: string | undefined;
  contentType?: string | undefined;
  keywords?: string[] | undefined;
  seoNoIndex?: boolean | undefined;
  seoImage?: unknown;
  authors?: ({ name?: string | undefined } | { name?: never })[] | undefined;
}

// OpenGraph image generation parameters
interface OgImageParams {
  type?: string;
  id?: string;
}

// Default site configuration
const siteConfig: SiteConfig = {
  title: "Roboto Studio Demo",
  description: "Roboto Studio Demo",
  twitterHandle: "@studioroboto",
  keywords: ["roboto", "studio", "demo", "next", "react", "template"],
};

function generateOgImageUrl(params: OgImageParams = {}): string {
  const { type, id } = params;
  const searchParams = new URLSearchParams();

  if (id) searchParams.set("id", id);
  if (type) searchParams.set("type", type);

  const baseUrl = getBaseUrl();
  return `${baseUrl}/api/og?${searchParams.toString()}`;
}

/** Ensures a slug has a single leading slash. */
function normalizeSlug(slug: string): string {
  return slug.startsWith("/") ? slug : `/${slug}`;
}

function buildPageUrl({
  baseUrl,
  slug,
}: {
  baseUrl: string;
  slug: string;
}): string {
  return `${baseUrl}${normalizeSlug(slug)}`;
}

/** The URL of a page's Markdown twin (`/` → `/index.md`, else `<slug>.md`). */
function buildMarkdownUrl({
  baseUrl,
  slug,
}: {
  baseUrl: string;
  slug: string;
}): string {
  return `${baseUrl}${slug === "/" ? "/index.md" : `${normalizeSlug(slug)}.md`}`;
}

function extractTitle({
  pageTitle,
  slug,
  siteTitle,
}: {
  pageTitle?: string | null | undefined;
  slug: string;
  siteTitle: string;
}): string {
  if (pageTitle) return pageTitle;
  if (slug && slug !== "/") return capitalize(slug.replace(/^\//, ""));
  return siteTitle;
}

export function getSEOMetadata(page: PageSeoData = {}): Metadata {
  const {
    title: pageTitle,
    description: pageDescription,
    slug = "/",
    contentId,
    contentType,
    keywords: pageKeywords = [],
    seoNoIndex = false,
    authors: pageAuthors,
  } = page;

  const baseUrl = getBaseUrl();
  const pageUrl = buildPageUrl({ baseUrl, slug });
  // Advertise the Markdown twin so agents can discover content negotiation.
  const markdownUrl = buildMarkdownUrl({ baseUrl, slug });

  // Build default metadata values
  const defaultTitle = extractTitle({
    pageTitle,
    slug,
    siteTitle: siteConfig.title,
  });
  const defaultDescription = pageDescription || siteConfig.description;
  const allKeywords = [...siteConfig.keywords, ...pageKeywords];

  const ogImage = generateOgImageUrl({
    ...(contentType !== undefined && { type: contentType }),
    ...(contentId !== undefined && { id: contentId }),
  });

  const fullTitle =
    defaultTitle === siteConfig.title
      ? defaultTitle
      : `${defaultTitle} | ${siteConfig.title}`;

  // Build default metadata object
  const defaultMetadata: Metadata = {
    title: fullTitle,
    description: defaultDescription,
    metadataBase: new URL(baseUrl),
    creator: siteConfig.title,
    authors: pageAuthors ?? [{ name: siteConfig.title }],
    icons: {
      icon: `${baseUrl}/favicon.ico`,
    },
    keywords: allKeywords,
    robots: seoNoIndex ? "noindex, nofollow" : "index, follow",
    twitter: {
      card: "summary_large_image",
      images: [ogImage],
      creator: siteConfig.twitterHandle,
      title: defaultTitle,
      description: defaultDescription,
    },
    alternates: {
      canonical: pageUrl,
      types: { "text/markdown": markdownUrl },
    },
    openGraph: {
      type: "website",
      countryName: "UK",
      description: defaultDescription,
      title: defaultTitle,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: defaultTitle,
          secureUrl: ogImage,
        },
      ],
      url: pageUrl,
    },
  };

  return defaultMetadata;
}
