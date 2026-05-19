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

// Utility function to safely render JSON-LD
export function JsonLdScript<T>({ data, id }: { data: T; id: string }) {
  return (
    <script type="application/ld+json" id={id}>
      {JSON.stringify(data, null, 0)}
    </script>
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
    description: description || undefined,
    image: imageUrl ? [imageUrl] : undefined,
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
    description: siteDescription || undefined,
    url: baseUrl,
    logo: logo?.fields?.file?.url
      ? ({
          "@type": "ImageObject",
          url: `https:${logo?.fields.file.url}`,
        } as ImageObject)
      : undefined,
    contactPoint: contactEmail
      ? ({
          "@type": "ContactPoint",
          email: contactEmail,
          contactType: "customer service",
        } as ContactPoint)
      : undefined,
    sameAs: socialLinks?.length ? socialLinks : undefined,
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
    description: siteDescription || undefined,
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
