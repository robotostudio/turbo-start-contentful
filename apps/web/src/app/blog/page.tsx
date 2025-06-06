import { draftMode } from "next/headers";

import { BlogHeader } from "@/components/blog-card";
import { getAllBlogs, getGlobalSettings } from "@/lib/contentful/query";
import { safeAsync } from "@/safe-async";

// async function fetchBlogPosts() {
//   return await handleErrors(sanityFetch({ query: queryBlogIndexPageData }));
// }

// export async function generateMetadata() {
//   const result = await sanityFetch({ query: queryBlogIndexPageData });
//   return await getMetaData(result?.data ?? {});
// }

export default async function BlogIndexPage() {
  const { isEnabled } = await draftMode();
  const result = await safeAsync(getAllBlogs(isEnabled));

  if (!result.success) {
    return (
      <main className="container my-16 mx-auto px-4 md:px-6">
        <BlogHeader title="Blog" description="Blog" />
        Not Found
      </main>
    );
  }
  const { featured, blogs } = result.data;

  console.log("🚀 ~ BlogIndexPage ~ blogs:", featured, blogs);
  // const [res, err] = await fetchBlogPosts();
  // if (err || !res?.data) notFound();

  // const {
  //   blogs = [],
  //   title,
  //   description,
  //   pageBuilder = [],
  //   _id,
  //   _type,
  //   displayFeaturedBlogs,
  //   featuredBlogsCount,
  // } = res.data;

  // const validFeaturedBlogsCount = featuredBlogsCount
  //   ? Number.parseInt(featuredBlogsCount)
  //   : 0;

  // if (!blogs.length) {
  //   return (
  //     <main className="container my-16 mx-auto px-4 md:px-6">
  //       <BlogHeader title={title} description={description} />
  //       <div className="text-center py-12">
  //         <p className="text-muted-foreground">
  //           No blog posts available at the moment.
  //         </p>
  //       </div>
  //       {pageBuilder && pageBuilder.length > 0 && (
  //         <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
  //       )}
  //     </main>
  //   );
  // }

  // const shouldDisplayFeaturedBlogs =
  //   displayFeaturedBlogs && validFeaturedBlogsCount > 0;

  // const featuredBlogs = shouldDisplayFeaturedBlogs
  //   ? blogs.slice(0, validFeaturedBlogsCount)
  //   : [];
  // const remainingBlogs = shouldDisplayFeaturedBlogs
  //   ? blogs.slice(validFeaturedBlogsCount)
  //   : blogs;

  return (
    <main className="bg-background">
      <div className="container my-16 mx-auto px-4 md:px-6">
        <BlogHeader title="Blog" description="Blog" />
      </div>

      {/*
        {featuredBlogs.length > 0 && (
          <div className="mx-auto mt-8 sm:mt-12 md:mt-16 mb-12 lg:mb-20 grid grid-cols-1 gap-8 md:gap-12">
            {featuredBlogs.map((blog) => (
              <FeaturedBlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}

        {remainingBlogs.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:gap-12 lg:grid-cols-2 mt-8">
            {remainingBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>

      {pageBuilder && pageBuilder.length > 0 && (
        <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
      )} */}
    </main>
  );
}
