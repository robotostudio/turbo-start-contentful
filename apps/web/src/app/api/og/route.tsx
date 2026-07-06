/* eslint-disable react/no-unknown-property */
/* eslint-disable @next/next/no-img-element */
import type { Asset } from "contentful";
import { ImageResponse } from "next/og";
import type { ImageResponseOptions } from "next/server";
import { cache } from "react";

import {
  getBlogByID,
  getGlobalSettings,
  getPageByID,
  getPageBySlug,
} from "@/lib/contentful/query";
import { safeAsync } from "@/safe-async";
import { getImageUrl, getTitleCase } from "@/utils";

import { getOgMetaData } from "./og-config";

// Removed edge runtime to support Contentful SDK which uses axios
// export const runtime = "edge";

export const revalidate = 3600;

const errorContent = (
  <div tw="flex flex-col w-full h-full items-center justify-center">
    <div tw=" flex w-full h-full items-center justify-center ">
      <h1 tw="text-white">Something went Wrong with image generation</h1>
    </div>
  </div>
);

type SeoImageRenderProps = {
  seoImage: string;
};

type ContentProps = Record<string, string>;

type SimpleOgRenderProps = {
  title?: string | null | undefined;
  _type?: string | null | undefined;
  siteTitle?: string | null | undefined;
};

const seoImageRender = ({ seoImage }: SeoImageRenderProps) => {
  return (
    <div tw="flex flex-col w-full h-full items-center justify-center">
      <img src={seoImage} alt="SEO preview" width={1200} height={630} />
    </div>
  );
};

const simpleOgRender = ({ title, _type, siteTitle }: SimpleOgRenderProps) => {
  return (
    <div
      style={{ backgroundColor: "#0A0A0A", fontFamily: "Inter" }}
      tw="flex flex-col justify-between w-full h-full p-[70px]"
    >
      <div tw="flex items-center justify-between w-full">
        <div tw="flex text-white text-2xl font-semibold">
          {siteTitle ?? "Turbo Start Contentful"}
        </div>
        {/* Type pill: blog posts only */}
        {_type === "blog" && (
          <div
            style={{
              borderColor: "#ffffff",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
            tw="flex border text-white px-6 py-3 rounded-full text-xl font-medium"
          >
            {getTitleCase(_type)}
          </div>
        )}
      </div>

      <h1
        style={{ lineHeight: 1.05, letterSpacing: "-0.02em", fontWeight: 400 }}
        tw="flex text-[76px] max-w-[90%] text-white"
      >
        {title ?? siteTitle ?? "Turbo Start Contentful"}
      </h1>
    </div>
  );
};

async function fetchTtfFont(
  family: string,
  axes: string[],
  value: number[],
): Promise<ArrayBuffer> {
  const familyParam = `${axes.join(",")}@${value.join(",")}`;

  // Get css style sheet with user agent Mozilla/5.0 Firefox/1.0 to ensure non-variable TTF is returned
  const cssCall = await fetch(
    `https://fonts.googleapis.com/css2?family=${family}:${familyParam}&display=swap`,
    {
      headers: {
        "User-Agent": "Mozilla/5.0 Firefox/1.0",
      },
      cache: "force-cache",
    },
  );

  const css = await cssCall.text();
  const ttfUrl = css.match(/url\(([^)]+)\)/)?.[1];

  if (!ttfUrl) {
    throw new Error("Failed to extract font URL from CSS");
  }

  return fetch(ttfUrl, { cache: "force-cache" }).then(async (res) => {
    if (!res.ok) {
      throw new Error(
        `Failed to fetch font ${ttfUrl}: ${res.status} ${res.statusText}`,
      );
    }
    return res.arrayBuffer();
  });
}

const getOptions = cache(
  async (width: number, height: number): Promise<ImageResponseOptions> => {
    const [interRegular, interBold, interSemiBold] = await Promise.all([
      fetchTtfFont("Inter", ["wght"], [400]),
      fetchTtfFont("Inter", ["wght"], [700]),
      fetchTtfFont("Inter", ["wght"], [600]),
    ]);
    return {
      width,
      height,
      fonts: [
        {
          name: "Inter",
          data: interRegular,
          style: "normal",
          weight: 400,
        },
        {
          name: "Inter",
          data: interBold,
          style: "normal",
          weight: 700,
        },
        {
          name: "Inter",
          data: interSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    };
  },
);

const getSiteTitle = async () => {
  const result = await safeAsync(getGlobalSettings());
  if (!result.success) return undefined;
  return result.data?.fields?.siteTitle;
};

const getHomePageContent = async () => {
  const result = await safeAsync(getPageBySlug("/"));
  if (!result.success) {
    console.error("Failed to fetch home page for OG image:", result.error);
    return undefined;
  }
  const page = result.data;
  const { seoImage, title } = page?.fields ?? {};

  const seoImageUrl = getImageUrl(
    seoImage as Asset<"WITHOUT_UNRESOLVABLE_LINKS", string>,
  );
  if (seoImageUrl) return seoImageRender({ seoImage: seoImageUrl.url });
  const siteTitle = await getSiteTitle();
  return simpleOgRender({ title, _type: "page", siteTitle });
};

const getSlugPageContent = async ({ id }: ContentProps) => {
  if (!id) return undefined;
  const result = await safeAsync(getPageByID(id));
  if (!result.success) {
    console.error("Failed to fetch page for OG image:", result.error);
    return undefined;
  }
  const page = result.data;
  const { seoImage, title } = page?.fields ?? {};

  const seoImageUrl = getImageUrl(seoImage);
  if (seoImageUrl) return seoImageRender({ seoImage: seoImageUrl.url });
  const siteTitle = await getSiteTitle();
  return simpleOgRender({ title, _type: "page", siteTitle });
};

const getBlogPageContent = async ({ id }: ContentProps) => {
  if (!id) return undefined;
  const result = await safeAsync(getBlogByID(id));
  if (!result.success) {
    console.error("Failed to fetch blog for OG image:", result.error);
    return undefined;
  }
  const blog = result.data;
  const { seoImage, title } = blog?.fields ?? {};
  const seoImageUrl = getImageUrl(seoImage);
  if (seoImageUrl) return seoImageRender({ seoImage: seoImageUrl.url });
  const siteTitle = await getSiteTitle();
  return simpleOgRender({ title, _type: "blog", siteTitle });
};

const block = {
  home: getHomePageContent,
  page: getSlugPageContent,
  blog: getBlogPageContent,
} as const;

export async function GET({ url }: Request): Promise<ImageResponse> {
  const { searchParams } = new URL(url);
  const type = searchParams.get("type") as keyof typeof block;
  const { width, height } = getOgMetaData(searchParams);
  const para = Object.fromEntries(searchParams.entries());
  const options = await getOptions(width, height);
  const image = block[type] ?? getHomePageContent;
  try {
    const content = await image(para);
    return new ImageResponse(content ? content : errorContent, options);
  } catch (err) {
    console.error("Error generating OG image:", err);
    return new ImageResponse(errorContent, options);
  }
}
