import { faker } from "@faker-js/faker";
import { PromisePool } from "@supercharge/promise-pool";
import type { SanityClient } from "sanity";
import slugify from "slugify";

import {
  BADGES,
  generateButtons,
  generatePageTitle,
  MOCK_ICONS,
  QUESTIONS,
  TITLE_EYEBROW_PAIRS,
} from "./const-mock-data";
import { retryPromise } from "./helper";
import { createFakeBlockContent, parseHTML } from "./parse-body";

// Core types
interface ImageAsset {
  id: string;
  type: ImageType;
}

type ImageType = "heroBlock" | "slugPage" | "author" | "blog" | "logo" | "og";

interface ImageOptions {
  width?: number;
  height?: number;
  url?: string;
  category?: string;
  type: ImageType;
}

// Image generation
const DEFAULT_IMAGE_CONFIG = {
  width: 800,
  height: 600,
  blur: 0,
  grayscale: false,
} as const;

const LOGO_URL =
  "https://cdn.sanity.io/images/rqdz6bx6/production/56ec9a9bbac2260f825a5ad471dd9581a3f92868-167x32.svg";

async function generateImage(
  client: SanityClient,
  { width, height, url, type, category }: ImageOptions,
): Promise<ImageAsset> {
  const imageUrl = url ?? getImageUrl({ width, height, category });
  const imageBuffer = await fetchImageBuffer(imageUrl);
  const imageAsset = await uploadImageToSanity(client, imageBuffer);

  return {
    id: imageAsset._id,
    type,
  };
}

function getImageUrl({
  width,
  height,
  category,
}: Partial<ImageOptions>): string {
  if (category === "author") {
    return faker.image.avatar();
  }
  return faker.image.urlPicsumPhotos({
    width: width ?? DEFAULT_IMAGE_CONFIG.width,
    height: height ?? DEFAULT_IMAGE_CONFIG.height,
    blur: DEFAULT_IMAGE_CONFIG.blur,
    grayscale: DEFAULT_IMAGE_CONFIG.grayscale,
  });
}

async function fetchImageBuffer(url: string): Promise<ArrayBuffer> {
  return fetch(url).then((res) => res.arrayBuffer());
}

async function uploadImageToSanity(client: SanityClient, buffer: ArrayBuffer) {
  return client.assets.upload("image", Buffer.from(buffer), {
    title: faker.lorem.words(3),
  });
}

// Image asset configurations
const IMAGE_ASSETS_CONFIG = [
  { type: "heroBlock" as const, width: 1200, height: 1200 },
  { type: "heroBlock" as const, width: 1200, height: 1200 },
  { type: "slugPage" as const, width: 2560, height: 1440 },
  { type: "slugPage" as const, width: 2560, height: 1440 },
  { type: "slugPage" as const, width: 2560, height: 1440 },
  { type: "author" as const, category: "author" },
  { type: "author" as const, category: "author" },
  { type: "blog" as const, width: 2560, height: 1440 },
  { type: "blog" as const, width: 2560, height: 1440 },
  { type: "blog" as const, width: 2560, height: 1440 },
  { type: "logo" as const, url: LOGO_URL },
  {
    type: "og" as const,
    url: "https://raw.githubusercontent.com/robotostudio/turbo-start-sanity/refs/heads/main/turbo-start-sanity-og.png",
  },
] as const;

// Main export for image generation
export async function generateAndUploadMockImages(
  client: SanityClient,
): Promise<ImageAsset[]> {
  console.log("🎨 Starting image generation...");

  const { results } = await PromisePool.withConcurrency(2)
    .for(IMAGE_ASSETS_CONFIG)
    .process(async (asset, index) => {
      console.log(
        `📸 Generating image ${index + 1}/${IMAGE_ASSETS_CONFIG.length} (${asset.type})`,
      );

      return retryPromise(async () => generateImage(client, asset), {
        onRetry(error, attempt) {
          console.log(
            `🔄 Retrying image generation attempt ${attempt} for ${asset.type}:`,
            error.message,
          );
        },
      });
    });

  console.log(`✅ Created ${results.length} images`);
  return results;
}

type ImageStore = Awaited<ReturnType<typeof generateAndUploadMockImages>>;

// Block generation utilities
function generateHeroBlock(
  imagesStore: ImageStore,
  { title }: { title?: string } = {},
) {
  const heroImages = imagesStore.filter((image) => image.type === "heroBlock");
  const heroImage = faker.helpers.arrayElement(heroImages);

  return {
    _key: faker.string.uuid(),
    _type: "hero" as const,
    title: title ?? generatePageTitle(),
    badge: faker.helpers.arrayElement(BADGES),
    image: {
      _type: "image",
      asset: {
        _ref: heroImage.id,
        _type: "reference",
      },
    },
    richText: createFakeBlockContent({
      maxParagraphs: 2,
      minParagraphs: 1,
    }),
    buttons: generateButtons(),
  };
}

function generateCTABlock() {
  return {
    _key: faker.string.uuid(),
    _type: "cta" as const,
    title: generatePageTitle(),
    richText: createFakeBlockContent({
      maxParagraphs: 1,
      minParagraphs: 1,
    }),
    buttons: generateButtons(),
  };
}

function generateFeatureIconsCard() {
  return Array.from({ length: 4 }).map(() => ({
    _key: faker.string.uuid(),
    _type: "featureCardIcon" as const,
    title: faker.company.catchPhrase(),
    icon: faker.helpers.arrayElement(MOCK_ICONS),
    richText: createFakeBlockContent({
      maxParagraphs: 1,
      minParagraphs: 1,
    }),
  }));
}

function generateFeatureCardsIconBlock() {
  const selectedPair = faker.helpers.arrayElement(TITLE_EYEBROW_PAIRS);

  return {
    _key: faker.string.uuid(),
    _type: "featureCardsIcon" as const,
    title: selectedPair.title,
    eyebrow: selectedPair.eyebrow,
    richText: createFakeBlockContent({
      maxParagraphs: 2,
      minParagraphs: 1,
    }),
    cards: generateFeatureIconsCard(),
  };
}

interface FAQGenerationOptions {
  min?: number;
  max?: number;
  minParagraphs?: number;
  maxParagraphs?: number;
}

export function generateFAQs({ min = 5, max = 7 }: FAQGenerationOptions = {}) {
  const length = faker.number.int({ min, max });

  return Array.from({ length }).map(() => {
    const questionsPool = Array.from(
      { length: faker.number.int({ min: 20, max: 50 }) },
      () => faker.helpers.arrayElement(QUESTIONS),
    );
    const selectedQuestion = faker.helpers.arrayElement(questionsPool);

    return {
      _type: "faq",
      _id: faker.string.uuid(),
      title: selectedQuestion.value,
      richText: parseHTML(selectedQuestion.answer),
    };
  });
}

type FAQs = ReturnType<typeof generateFAQs>;

function generateFAQBlock(faqs: FAQs) {
  return {
    _key: faker.string.uuid(),
    _type: "faqAccordion" as const,
    title: "Frequently Asked Questions",
    subtitle:
      "Find out all the essential details about our platform and how it can serve your needs.",
    faqs: faqs.map((faq) => ({
      _key: faker.string.uuid(),
      _type: "reference",
      _ref: faq._id,
    })),
  };
}

export async function checkIfDataExists(
  client: SanityClient,
): Promise<boolean> {
  const { homePage } = await client.fetch(`{
    "homePage": defined(*[_type == 'homePage' && _id == 'homePage'][0]._id),
  }`);
  return Boolean(homePage);
}

interface HomePageGenerationOptions {
  imagesStore: ImageStore;
  faqs: FAQs;
}

export function getMockHomePageData({
  imagesStore,
  faqs,
}: HomePageGenerationOptions) {
  const seoImage = imagesStore.find((image) => image.type === "og");
  const blocks = [
    generateHeroBlock(imagesStore, {
      title: "Welcome to our website",
    }),
    generateCTABlock(),
    generateFeatureCardsIconBlock(),
    generateFAQBlock(faqs),
  ];

  return {
    _id: "homePage",
    _type: "homePage" as const,
    title: "Home Page",
    description: faker.lorem.paragraph(),
    slug: {
      type: "slug" as const,
      current: "/",
    },
    ...(seoImage
      ? {
          seoImage: {
            _type: "image",
            asset: {
              _ref: seoImage.id,
              _type: "reference",
            },
          },
        }
      : {}),
    pageBuilder: blocks,
  };
}

interface SlugPageGenerationOptions {
  faqs: FAQs;
  imagesStore: ImageStore;
}

export function generateMockSlugPages({
  faqs,
  imagesStore,
}: SlugPageGenerationOptions) {
  const length = faker.number.int({ min: 2, max: 5 });
  const slugPageImages = imagesStore.filter(
    (image) => image.type === "slugPage",
  );

  return Array.from({ length }).map(() => {
    const image = faker.helpers.arrayElement(slugPageImages);
    const blocks = [
      generateHeroBlock(imagesStore),
      generateCTABlock(),
      generateFeatureCardsIconBlock(),
      generateFAQBlock(faqs),
    ];

    const title = generatePageTitle();
    return {
      _id: faker.string.uuid(),
      _type: "page" as const,
      title,
      description: faker.lorem.paragraph(),
      seoNoIndex: false,
      seoHideFromLists: false,
      image: {
        _type: "image",
        asset: {
          _ref: image.id,
          _type: "reference",
        },
      },
      slug: {
        type: "slug",
        current: `/${slugify(title, {
          lower: true,
          remove: /[^a-zA-Z0-9 ]/g,
        })}`,
      },
      pageBuilder: blocks,
    };
  });
}

export function generateMockAuthors(imagesStore: ImageStore) {
  const length = faker.number.int({ min: 2, max: 5 });
  const authorImages = imagesStore.filter((image) => image.type === "author");

  return Array.from({ length }).map(() => {
    const image = faker.helpers.arrayElement(authorImages);
    return {
      _id: faker.string.uuid(),
      _type: "author",
      name: faker.person.fullName(),
      position: faker.person.jobTitle(),
      bio: faker.person.bio(),
      image: {
        _type: "image",
        asset: {
          _ref: image.id,
          _type: "reference",
        },
      },
    };
  });
}

type Author = ReturnType<typeof generateMockAuthors>[number];

interface BlogPageGenerationOptions {
  imagesStore: ImageStore;
  authors: Author[];
}

export function generateMockBlogPages({
  imagesStore,
  authors,
}: BlogPageGenerationOptions) {
  const length = faker.number.int({ min: 2, max: 5 });
  const blogImages = imagesStore.filter((image) => image.type === "blog");

  return Array.from({ length }).map(() => {
    const title = generatePageTitle();
    const author = faker.helpers.arrayElement(authors);
    const image = faker.helpers.arrayElement(blogImages);

    return {
      _id: faker.string.uuid(),
      _type: "blog" as const,
      title,
      image: {
        _type: "image",
        asset: {
          _ref: image.id,
          _type: "reference",
        },
      },
      seoNoIndex: false,
      seoHideFromLists: false,
      publishedAt: new Date(faker.date.past()).toISOString().split("T")[0],
      description: faker.lorem.paragraph(),
      slug: {
        type: "slug",
        current: `/blog/${slugify(title, {
          lower: true,
          remove: /[^a-zA-Z0-9 ]/g,
        })}`,
      },
      richText: createFakeBlockContent({
        minParagraphs: 7,
        maxParagraphs: 12,
        rich: true,
      }),
      authors: [
        {
          _key: faker.string.uuid(),
          _type: "reference",
          _ref: author._id,
        },
      ],
    };
  });
}

export function generateBlogIndexPage() {
  return {
    _id: "blogIndex" as const,
    _type: "blogIndex" as const,
    title: "Insights & Updates",
    description:
      "Discover our latest blogs, industry insights, and expert perspectives on technology, development, and digital innovation. Stay informed with in-depth analysis and practical guides.",
    slug: {
      type: "slug",
      current: "/blog",
    },
    displayFeaturedBlogs: "yes",
    featuredBlogsCount: "1",
  };
}
