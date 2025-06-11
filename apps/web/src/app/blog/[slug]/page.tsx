import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { ContentfulImage } from "@/components/contentful-image";
import { ContentfulRichText } from "@/components/contentful-richtext";
import { ArticleJsonLd } from "@/components/json-ld";
import { TableOfContent } from "@/components/table-of-content";
import { getBlogBySlug, getBlogPaths } from "@/lib/contentful/query";
import { getSEOMetadata } from "@/lib/seo";
import { safeAsync } from "@/safe-async";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const response = await safeAsync(getBlogBySlug(slug));
  if (!response.success) return getSEOMetadata();
  const blog = response.data;
  const { title, description, slug: blogSlug, seoNoIndex } = blog?.fields ?? {};
  const { id: contentId, contentType } = blog?.sys ?? {};

  const metadata = getSEOMetadata({
    title,
    description,
    slug: blogSlug,
    contentId: contentId,
    contentType: contentType?.sys?.id,
    seoNoIndex,
    authors: blog?.fields?.authors?.map((author) => ({
      name: author?.fields.name,
    })),
  });
  return metadata;
}

export async function generateStaticParams() {
  const response = await safeAsync(getBlogPaths());
  if (!response.success) return [];
  const paths = response.data.map((slug) => ({ slug }));
  return paths;
}

export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  const response = await safeAsync(getBlogBySlug(slug, isEnabled));
  if (!response.success) {
    return <div>Error</div>;
  }
  const blog = response.data;

  if (!blog) return notFound();
  const { title, description, image, richText } = blog?.fields ?? {};

  return (
    <div className="container my-16 mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <main>
          <ArticleJsonLd article={blog} />
          <header className="mb-8">
            <h1 className="mt-2 text-4xl font-bold">{title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
          </header>
          {image && (
            <div className="mb-12">
              <ContentfulImage
                image={image}
                width={1600}
                loading="eager"
                priority
                height={900}
                className="rounded-lg h-auto w-full"
              />
            </div>
          )}
          <ContentfulRichText richText={richText} />
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-4 rounded-lg ">
            <TableOfContent richText={richText} />
          </div>
        </aside>
      </div>
    </div>
  );
}
