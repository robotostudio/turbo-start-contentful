import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { ContentfulImage } from "@/components/contentful-image";
import { ContentfulRichText } from "@/components/contentful-richtext";
// import { ArticleJsonLd } from "@/components/json-ld";
import { RichText } from "@/components/richtext";
import { TableOfContent } from "@/components/table-of-content";
import { getBlogBySlug } from "@/lib/contentful/query";
import { getMetaData } from "@/lib/seo";
import { safeAsync } from "@/safe-async";

// async function fetchBlogSlugPageData(slug: string) {
//   return await sanityFetch({
//     query: queryBlogSlugPageData,
//     params: { slug: `/blog/${slug}` },
//   });
// }

async function fetchBlogPaths() {
  // const slugs = await client.fetch(queryBlogPaths);
  // const paths: { slug: string }[] = [];
  // for (const slug of slugs) {
  //   if (!slug) continue;
  //   const [, , path] = slug.split("/");
  //   if (path) paths.push({ slug: path });
  // }
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // const { data } = await fetchBlogSlugPageData(slug);
  // return await getMetaData(data ?? {});
  return await getMetaData({});
}

export async function generateStaticParams() {
  return await fetchBlogPaths();
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
          {/* <ArticleJsonLd article={data} /> */}
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
            {/* <TableOfContent richText={richText} /> */}
            TOC
          </div>
        </aside>
      </div>
    </div>
  );
}
