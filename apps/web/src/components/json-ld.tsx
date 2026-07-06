import type {
  Article,
  ContactPoint,
  ImageObject,
  Organization,
  Person,
  WebPage,
  WebSite,
  WithContext,
} from "schema-dts";

import { getBaseUrl } from "@/config";
import type { GlobalSettings } from "@/lib/contentful/query";
import { getGlobalSettings } from "@/lib/contentful/query";
import type { TypeBlog } from "@/lib/contentful/types";
import { safeAsync } from "@/safe-async";

// Escape <, >, & to \uXXXX so a "</script>" in any CMS field can't break out of
// the tag. JSON-LD is parsed as data (not executed), so escaping `<` is what
// matters; the result stays valid JSON for crawlers.
function serializeJsonLd<T>(data: T): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function JsonLdScript<T>({ data, id }: { data: T; id: string }) {
  return (
    <script
      type="application/ld+json"
      id={id}
      // Raw injection so the JSON-LD reaches crawlers unescaped; serializeJsonLd
      // already escapes <, >, & to prevent script breakout.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}

// Article JSON-LD Component
interface ArticleJsonLdProps {
  article: TypeBlog<"WITHOUT_UNRESOLVABLE_LINKS">;
  settings?: GlobalSettings;
}
export function ArticleJsonLd({ article, settings }: ArticleJsonLdProps) {
  if (!article) return null;

  const { title, description, image, slug, authors, publishedDate } =
    article.fields ?? {};

  const { siteTitle, logo } = settings?.fields ?? {};
  const baseUrl = getBaseUrl();
  const articleUrl = `${baseUrl}/blog/${slug}`;
  const imageUrl = image?.fields?.file?.url
    ? `https:${image?.fields?.file?.url}`
    : undefined;

  const articleJsonLd: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    ...(description && { description }),
    ...(imageUrl && { image: [imageUrl] }),
    author: authors
      ? authors.map(
          (author) =>
            ({
              "@type": "Person",
              name: author?.fields.name,
              url: `${baseUrl}`,
              image: author?.fields.image?.fields?.file?.url
                ? ({
                    "@type": "ImageObject",
                    url: `https:${author?.fields.image?.fields?.file?.url}`,
                  } as ImageObject)
                : undefined,
            }) as Person,
        )
      : [],
    publisher: {
      "@type": "Organization",
      name: siteTitle || "Website",
      logo: logo?.fields?.file?.url
        ? ({
            "@type": "ImageObject",
            url: `https:${logo?.fields?.file?.url}`,
          } as ImageObject)
        : undefined,
    } as Organization,
    datePublished: new Date(
      publishedDate || new Date().toISOString(),
    ).toISOString(),
    dateModified: new Date(
      publishedDate || new Date().toISOString(),
    ).toISOString(),
    url: articleUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    } as WebPage,
  };

  return <JsonLdScript data={articleJsonLd} id={`article-json-ld-${slug}`} />;
}

// Organization JSON-LD Component
interface OrganizationJsonLdProps {
  settings: GlobalSettings;
}

export function OrganizationJsonLd({ settings }: OrganizationJsonLdProps) {
  if (!settings) return null;

  const { siteTitle, siteDescription, logo, contactEmail, twitter, linkedin } =
    settings.fields;

  const baseUrl = getBaseUrl();

  const socialLinks = [twitter, linkedin].filter(Boolean) as string[];

  const organizationJsonLd: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteTitle,
    ...(siteDescription && { description: siteDescription }),
    url: baseUrl,
    ...(logo?.fields?.file?.url && {
      logo: {
        "@type": "ImageObject",
        url: `https:${logo.fields.file.url}`,
      } as ImageObject,
    }),
    ...(contactEmail && {
      contactPoint: {
        "@type": "ContactPoint",
        email: contactEmail,
        contactType: "customer service",
      } as ContactPoint,
    }),
    ...(socialLinks.length && { sameAs: socialLinks }),
  };

  return <JsonLdScript data={organizationJsonLd} id="organization-json-ld" />;
}

// Website JSON-LD Component
interface WebSiteJsonLdProps {
  settings: GlobalSettings;
}

export function WebSiteJsonLd({ settings }: WebSiteJsonLdProps) {
  if (!settings) return null;

  const { siteTitle, siteDescription } = settings.fields;
  const baseUrl = getBaseUrl();

  const websiteJsonLd: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteTitle,
    ...(siteDescription && { description: siteDescription }),
    url: baseUrl,
    publisher: {
      "@type": "Organization",
      name: siteTitle,
    } as Organization,
  };

  return <JsonLdScript data={websiteJsonLd} id="website-json-ld" />;
}

// Combined JSON-LD Component for pages with multiple structured data
interface CombinedJsonLdProps {
  article?: TypeBlog<"WITHOUT_UNRESOLVABLE_LINKS">;
  includeWebsite?: boolean;
  includeOrganization?: boolean;
}

export async function CombinedJsonLd({
  article,
  includeWebsite = false,
  includeOrganization = false,
}: CombinedJsonLdProps) {
  const result = await safeAsync(getGlobalSettings());

  if (!result.success) {
    return null;
  }

  const settingsData = result.data;

  return (
    <>
      {includeWebsite && settingsData && (
        <WebSiteJsonLd settings={settingsData} />
      )}
      {includeOrganization && settingsData && (
        <OrganizationJsonLd settings={settingsData} />
      )}
      {article && <ArticleJsonLd article={article} settings={settingsData} />}
    </>
  );
}
