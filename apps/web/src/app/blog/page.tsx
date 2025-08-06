import { draftMode } from "next/headers";

import { BlogCard, BlogHeader, FeaturedBlogCard } from "@/components/blog-card";
import { getAllBlogs } from "@/lib/contentful/query";
import { getSEOMetadata } from "@/lib/seo";
import { safeAsync } from "@/safe-async";

export async function generateMetadata() {
  return getSEOMetadata({
    title: "Blog | Latest Articles and Insights",
    description:
      "Explore our latest blog posts, articles, and insights. Stay updated with our expert analysis, industry trends, and valuable information.",
    slug: "/blog",
    seoNoIndex: false,
    contentType: "blogIndex",
    contentId: "blogIndex",
  });
}

export default async function BlogIndexPage() {
  const { isEnabled } = await draftMode();
  const result = await safeAsync(getAllBlogs(isEnabled));

  if (!result.success) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-24 md:px-6">
          <BlogHeader title="Blog" description="Blog" />
          <div className="mt-8 text-center text-gray-400">Not Found</div>
        </div>
      </main>
    );
  }
  const { featured, blogs } = result.data;

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-24 md:px-6">
        <BlogHeader title="Blog" description="Blog" />
        <div className="mt-12">
          <FeaturedBlogCard blog={featured} />
        </div>
        {blogs.length > 0 && (
          <div className="mt-16 grid grid-cols-1 gap-12 md:gap-16 lg:grid-cols-2">
            {blogs.map((blog) => (
              <BlogCard key={blog.sys.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
