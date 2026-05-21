// Idempotent Contentful seed: blogs, pages, pageBuilder blocks, authors, assets.
// Re-running skips existing entries (deterministic IDs). Run: pnpm --filter web seed
//
// Requires env: CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT, CONTENTFUL_MANAGEMENT_TOKEN

import contentful from "contentful-management";

const { SPACE_ID, ENV_ID, TOKEN } = readEnv();
const PUBLISH = process.env.SEED_PUBLISH !== "false";

const client = contentful.createClient({ accessToken: TOKEN });
const space = await client.getSpace(SPACE_ID);
const env = await space.getEnvironment(ENV_ID);

const locales = await env.getLocales();
const LOCALE = locales.items.find((l) => l.default)?.code ?? "en-US";
log(`✓ space=${SPACE_ID} env=${ENV_ID} locale=${LOCALE} publish=${PUBLISH}`);

// ---------------------------------------------------------------- assets ----

const ASSETS = {
  "seed-hero-home": {
    title: "Glowing data center",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=2400&q=80",
  },
  "seed-hero-about": {
    title: "Team collaborating around laptop",
    url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=2400&q=80",
  },
  "seed-hero-pricing": {
    title: "Charts on a glass wall",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2400&q=80",
  },
  "seed-hero-features": {
    title: "Server racks blue light",
    url: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=2400&q=80",
  },
  "seed-hero-contact": {
    title: "Conversation over coffee",
    url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=2400&q=80",
  },
  "seed-blog-1": {
    title: "Abstract code on dark background",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80",
  },
  "seed-blog-2": {
    title: "Modern workspace setup",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&q=80",
  },
  "seed-blog-3": {
    title: "Designer color palette",
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&q=80",
  },
  "seed-blog-4": {
    title: "Network cables backlit",
    url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1600&q=80",
  },
  "seed-blog-5": {
    title: "Whiteboard sprint planning",
    url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80",
  },
  "seed-blog-6": {
    title: "Migration arrows on whiteboard",
    url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=80",
  },
  "seed-author-jane": {
    title: "Jane portrait",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
  },
  "seed-author-marcus": {
    title: "Marcus portrait",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
  },
  "seed-author-priya": {
    title: "Priya portrait",
    url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80",
  },
};

for (const [id, spec] of Object.entries(ASSETS)) {
  await upsertAsset(id, spec);
}

// ---------------------------------------------------------------- authors ---

const AUTHORS = {
  "seed-author-jane": {
    name: "Jane Okafor",
    position: "Principal Engineer",
    bio: "Jane leads platform engineering and writes about caching, edge runtimes, and developer experience.",
  },
  "seed-author-marcus": {
    name: "Marcus Lindgren",
    position: "Staff Frontend Engineer",
    bio: "Marcus ships React all day. Currently obsessed with React Compiler and zero-runtime CSS.",
  },
  "seed-author-priya": {
    name: "Priya Raman",
    position: "Head of Content Engineering",
    bio: "Priya bridges editors and engineers. Previously led content platforms at two unicorn startups.",
  },
};

for (const [id, spec] of Object.entries(AUTHORS)) {
  await upsertEntry(id, "author", {
    name: spec.name,
    position: spec.position,
    bio: spec.bio,
    image: link(id, "Asset"), // author id == matching asset id by convention
  });
}

// ----------------------------------------------------------- buttons (reusable)

await upsertEntry("seed-btn-primary-cta", "button", {
  variant: "default",
  label: "Get started",
  href: "/contact",
});
await upsertEntry("seed-btn-secondary-docs", "button", {
  variant: "outline",
  label: "Read the docs",
  href: "https://www.contentful.com/developers/docs/",
});
await upsertEntry("seed-btn-pricing-link", "button", {
  variant: "link",
  label: "See pricing →",
  href: "/pricing",
});

// ----------------------------------------------------------- pagebuilder blocks

// Heroes — one per page/blog so editors can iterate independently
await upsertEntry("seed-hero-home-block", "hero", {
  title: "Build content-driven sites without the rebuild treadmill",
  badge: "v2.0 ships today",
  richText: rt([
    "A composable content platform with Contentful, Next.js 16, and Tailwind v4. Designed for teams that want preview-grade DX without sacrificing production performance.",
  ]),
  image: link("seed-hero-home", "Asset"),
  buttons: [link("seed-btn-primary-cta"), link("seed-btn-secondary-docs")],
});

await upsertEntry("seed-hero-about-block", "hero", {
  title: "We're a small team obsessed with editor velocity",
  badge: "About us",
  richText: rt([
    "Founded in 2024 by content engineers tired of stale staging environments. We build tools that let writers and developers ship in the same hour.",
  ]),
  image: link("seed-hero-about", "Asset"),
  buttons: [link("seed-btn-pricing-link")],
});

await upsertEntry("seed-hero-pricing-block", "hero", {
  title: "Pricing that scales with your content team",
  badge: "Transparent pricing",
  richText: rt([
    "Start free for small projects. Pay only for active editors. No per-entry pricing, no surprise overage fees.",
  ]),
  image: link("seed-hero-pricing", "Asset"),
  buttons: [link("seed-btn-primary-cta")],
});

await upsertEntry("seed-hero-features-block", "hero", {
  title: "Everything you need, nothing you don't",
  badge: "Features",
  richText: rt([
    "Live preview, partial revalidation, type-safe content models, and a page builder that respects your design system.",
  ]),
  image: link("seed-hero-features", "Asset"),
  buttons: [link("seed-btn-secondary-docs"), link("seed-btn-pricing-link")],
});

await upsertEntry("seed-hero-contact-block", "hero", {
  title: "Get in touch",
  badge: "Contact",
  richText: rt([
    "Drop a note and we'll get back within one business day. For urgent support, paid plans include a dedicated Slack channel.",
  ]),
  image: link("seed-hero-contact", "Asset"),
  buttons: [link("seed-btn-primary-cta")],
});

await upsertEntry("seed-hero-careers-block", "hero", {
  title: "Build the future of content with us",
  badge: "We're hiring",
  richText: rt([
    "Remote-first across the EU and Americas. Async-by-default. Engineers, designers, and content folks welcome — see open roles below.",
  ]),
  image: link("seed-hero-about", "Asset"),
  buttons: [link("seed-btn-primary-cta"), link("seed-btn-secondary-docs")],
});

// Feature cards (children)
const featureCardDefs = [
  {
    id: "seed-fc-livepreview",
    title: "Live Preview without reloads",
    color: "blue",
    body: "See editor changes in the browser within ~100ms via Contentful's Live Preview SDK and React 19 server components.",
    icon: "seed-blog-1",
  },
  {
    id: "seed-fc-typed",
    title: "Type-safe content models",
    color: "pink",
    body: "Generated TypeScript types from your Contentful space — never ship a field rename that breaks production.",
    icon: "seed-blog-2",
  },
  {
    id: "seed-fc-revalidation",
    title: "Surgical revalidation",
    color: "yellow",
    body: "Tag-based cache invalidation via the /api/revalidate webhook means only changed entries refetch. The rest stays cached.",
    icon: "seed-blog-3",
  },
  {
    id: "seed-fc-pagebuilder",
    title: "Composable page builder",
    color: "red",
    body: "Hero, FAQ, CTA, and feature card blocks editors can rearrange. New block types take ~20 lines of code to add.",
    icon: "seed-blog-4",
  },
  {
    id: "seed-fc-starter",
    title: "Starter Plan",
    color: "blue",
    body: "Free forever for personal projects. 1 editor, 1 environment, community support.",
  },
  {
    id: "seed-fc-team",
    title: "Team Plan",
    color: "pink",
    body: "Everything in Starter plus unlimited editors, 3 environments, priority email support, and SSO.",
  },
  {
    id: "seed-fc-enterprise",
    title: "Enterprise Plan",
    color: "yellow",
    body: "Custom SLAs, dedicated infrastructure, advanced compliance, and a named customer success engineer.",
  },
];

for (const card of featureCardDefs) {
  await upsertEntry(card.id, "featureCard", {
    title: card.title,
    cardGradientColor: card.color,
    richText: rt([card.body]),
    ...(card.icon ? { icon: link(card.icon, "Asset") } : {}),
  });
}

await upsertEntry("seed-featurecards-home", "featureCards", {
  eyebrow: "WHAT YOU SHIP",
  title: "Four primitives that compose into anything",
  richText: rt([
    "Each block is a Contentful content type and a React component. Editors drag and drop, developers stay in their lane.",
  ]),
  cards: [
    link("seed-fc-livepreview"),
    link("seed-fc-typed"),
    link("seed-fc-revalidation"),
    link("seed-fc-pagebuilder"),
  ],
});

await upsertEntry("seed-featurecards-pricing", "featureCards", {
  eyebrow: "PLANS",
  title: "Pick a plan, change it any time",
  richText: rt([
    "Annual billing saves 15%. Every plan includes Live Preview and unlimited content types.",
  ]),
  cards: [
    link("seed-fc-starter"),
    link("seed-fc-team"),
    link("seed-fc-enterprise"),
  ],
});

await upsertEntry("seed-featurecards-features", "featureCards", {
  eyebrow: "CAPABILITIES",
  title: "Designed for content teams that ship daily",
  cards: [
    link("seed-fc-livepreview"),
    link("seed-fc-revalidation"),
    link("seed-fc-pagebuilder"),
  ],
});

// FAQ children
const faqDefs = [
  {
    id: "seed-faq-hosting",
    q: "Where is my content hosted?",
    a: "Contentful CDN globally. The Next.js app runs on Vercel by default but works on any Node 20+ host.",
  },
  {
    id: "seed-faq-migration",
    q: "Can I migrate from an existing CMS?",
    a: "Yes. We provide a content migration runbook and contentful-cli scripts for common platforms (Sanity, Strapi, WordPress).",
  },
  {
    id: "seed-faq-preview",
    q: "How does Live Preview work?",
    a: "The /api/preview route enables Next.js draft mode and the Contentful Live Preview SDK streams field-level updates over postMessage.",
  },
  {
    id: "seed-faq-cache",
    q: "How is caching handled?",
    a: "Next.js fetch cache + Contentful webhook → /api/revalidate → revalidateTag for surgical invalidation.",
  },
  {
    id: "seed-faq-pricing",
    q: "Do you charge per page view?",
    a: "No. Pricing is per editor seat. Page views are unmetered.",
  },
  {
    id: "seed-faq-support",
    q: "What does support look like?",
    a: "Community Discord for free, email for Team, dedicated Slack channel for Enterprise.",
  },
];

for (const f of faqDefs) {
  await upsertEntry(f.id, "faq", {
    question: f.q,
    answer: rt([f.a]),
  });
}

await upsertEntry("seed-faqs-home", "faqAccordion", {
  eyebrow: "FAQ",
  title: "Frequently asked questions",
  subtitle: "Can't find what you're looking for? Drop us a note.",
  faqs: [
    link("seed-faq-hosting"),
    link("seed-faq-preview"),
    link("seed-faq-cache"),
    link("seed-faq-migration"),
  ],
  link: "/contact",
});

await upsertEntry("seed-faqs-features", "faqAccordion", {
  eyebrow: "QUESTIONS",
  title: "Common questions about features",
  faqs: [link("seed-faq-preview"), link("seed-faq-cache"), link("seed-faq-support")],
});

// CTAs
await upsertEntry("seed-cta-home", "callToAction", {
  eyebrow: "GET STARTED",
  title: "Ready to ship?",
  richText: rt([
    "Start free, no credit card required. Get a feel for Live Preview in under five minutes.",
  ]),
  buttons: [link("seed-btn-primary-cta"), link("seed-btn-secondary-docs")],
});

await upsertEntry("seed-cta-about", "callToAction", {
  eyebrow: "JOIN US",
  title: "We're hiring",
  richText: rt(["We're a remote-first team. See open roles or send a note."]),
  buttons: [link("seed-btn-primary-cta")],
});

await upsertEntry("seed-cta-pricing", "callToAction", {
  eyebrow: "STILL DECIDING?",
  title: "Talk to sales",
  richText: rt(["Book a 20-minute call to see if we're a fit for your team."]),
  buttons: [link("seed-btn-primary-cta")],
});

await upsertEntry("seed-cta-contact", "callToAction", {
  eyebrow: "NEWSLETTER",
  title: "Stay in the loop",
  richText: rt(["Monthly product updates and engineering essays. No spam."]),
  enableNewsletterForm: true,
  helperText: rt(["We'll never share your email. Unsubscribe any time."]),
});

await upsertEntry("seed-cta-blog", "callToAction", {
  eyebrow: "READ MORE",
  title: "Get articles like this in your inbox",
  richText: rt([
    "Engineering essays on content platforms, React, and the modern web. One email a month.",
  ]),
  enableNewsletterForm: true,
});

// -------------------------------------------------------------- pages -------

// Note: existing space already has a "/" home page. We expose our home composition
// at "/home-demo" so editors can see all 4 block types without clobbering the live home.
await upsertEntry("seed-page-home", "page", {
  title: "Home Demo",
  description: "Demo composition showing all four pageBuilder blocks.",
  slug: "/home-demo",
  image: link("seed-hero-home", "Asset"),
  pageBuilder: [
    link("seed-hero-home-block"),
    link("seed-featurecards-home"),
    link("seed-faqs-home"),
    link("seed-cta-home"),
  ],
  seoTitle: "Home Demo — Roboto",
  seoDescription:
    "Contentful + Next.js 16 + Tailwind v4. Live Preview, type-safe content models, surgical revalidation.",
});

await upsertEntry("seed-page-about", "page", {
  title: "About",
  description: "Meet the team behind Roboto.",
  slug: "/about",
  image: link("seed-hero-about", "Asset"),
  pageBuilder: [link("seed-hero-about-block"), link("seed-cta-about")],
  seoTitle: "About — Roboto",
  seoDescription: "We're a small team obsessed with editor velocity and developer experience.",
});

await upsertEntry("seed-page-pricing", "page", {
  title: "Pricing",
  description: "Per-editor pricing. No per-pageview fees.",
  slug: "/pricing",
  image: link("seed-hero-pricing", "Asset"),
  pageBuilder: [
    link("seed-hero-pricing-block"),
    link("seed-featurecards-pricing"),
    link("seed-cta-pricing"),
  ],
  seoTitle: "Pricing — Roboto",
  seoDescription: "Per-editor pricing with no per-pageview fees. Plans for solo, team, and enterprise.",
});

await upsertEntry("seed-page-features", "page", {
  title: "Features",
  description: "Live Preview, type-safe content, and surgical revalidation.",
  slug: "/features",
  image: link("seed-hero-features", "Asset"),
  pageBuilder: [
    link("seed-hero-features-block"),
    link("seed-featurecards-features"),
    link("seed-faqs-features"),
  ],
  seoTitle: "Features — Roboto",
  seoDescription:
    "Live Preview, type-safe content models, surgical revalidation, composable page builder.",
});

await upsertEntry("seed-page-contact", "page", {
  title: "Contact",
  description: "Get in touch with the team.",
  slug: "/contact",
  image: link("seed-hero-contact", "Asset"),
  pageBuilder: [link("seed-hero-contact-block"), link("seed-cta-contact")],
  seoTitle: "Contact — Roboto",
  seoDescription: "Get in touch. Sales, support, partnerships — we read everything.",
});

await upsertEntry("seed-page-careers", "page", {
  title: "Careers",
  description: "We're hiring engineers, designers, and content folks.",
  slug: "/careers",
  image: link("seed-hero-about", "Asset"),
  pageBuilder: [link("seed-hero-careers-block"), link("seed-cta-about")],
  seoTitle: "Careers — Roboto",
  seoDescription:
    "Open roles at Roboto. Remote-first, async-by-default, generous equity.",
});

// -------------------------------------------------------------- blogs -------

const blogDefs = [
  {
    id: "seed-blog-1",
    title: "Why we rebuilt our content layer on Contentful",
    description: "A six-week migration from a legacy CMS, and what we'd do differently next time.",
    slug: "why-we-rebuilt-on-contentful",
    publishedDate: "2026-04-12",
    author: "seed-author-jane",
    paragraphs: [
      "When we started Roboto in late 2024, we inherited a legacy WordPress install that had grown into a content monolith. Editors loved the WYSIWYG, but every release required a cache stampede and a prayer.",
      "Contentful's content-as-data model gave us strict schemas, an API that's a joy to consume, and a Live Preview SDK that finally closed the editor feedback loop. Six weeks later we'd migrated every entry and retired the old stack.",
      "The biggest unlock wasn't speed — it was confidence. Editors can now ship copy at 5pm on a Friday without paging the on-call.",
    ],
  },
  {
    id: "seed-blog-2",
    title: "Live Preview without the loading spinners",
    description: "How we wired Contentful Live Preview into Next.js 16 server components.",
    slug: "live-preview-without-spinners",
    publishedDate: "2026-04-22",
    author: "seed-author-marcus",
    paragraphs: [
      "Next.js 16 server components plus Contentful's Live Preview SDK is a great combination — once you stop fighting it. The trick is to keep the editor in a single React tree and let postMessage updates drive re-renders.",
      "We use useContentfulLiveUpdates at the section level and useContentfulInspectorMode for tap-to-edit affordances. Field-level updates feel instantaneous.",
      "The reference implementation lives in apps/web/src/components/sections/hero.tsx. Copy it for new blocks.",
    ],
  },
  {
    id: "seed-blog-3",
    title: "Tailwind v4 in production: three months in",
    description: "What we love, what bit us, and the CSS-first migration we'd recommend.",
    slug: "tailwind-v4-three-months-in",
    publishedDate: "2026-05-01",
    author: "seed-author-marcus",
    paragraphs: [
      "Tailwind v4 removed the JS config and moved theme tokens into CSS via @theme. The migration took us a weekend and reduced our build pipeline complexity meaningfully.",
      "The wins: faster builds, simpler tooling, and design tokens live next to component CSS instead of in a separate config file. The pain: any custom plugin had to be rewritten as a CSS @plugin import.",
      "Three months in, we wouldn't go back. Even our designers like it — they can read globals.css.",
    ],
  },
  {
    id: "seed-blog-4",
    title: "Cache invalidation done right: revalidateTag patterns",
    description: "Surgical Next.js cache invalidation driven by Contentful webhooks.",
    slug: "revalidate-tag-patterns",
    publishedDate: "2026-05-08",
    author: "seed-author-jane",
    paragraphs: [
      "Phil Karlton was right: cache invalidation is hard. But it's a lot easier when your CMS tells you exactly what changed.",
      "Our /api/revalidate route accepts a tag or path from Contentful's webhook, validates the signing secret, and calls revalidateTag. The fetch layer tags every Contentful response with the entry ID, so updates propagate within seconds.",
      "The end result: editors publish, and the change appears on the live site without a redeploy or a manual cache flush.",
    ],
  },
  {
    id: "seed-blog-5",
    title: "Type-safe content models with cf-content-types-generator",
    description: "How we keep TypeScript and Contentful in lockstep with one CLI command.",
    slug: "type-safe-content-models",
    publishedDate: "2026-05-13",
    author: "seed-author-priya",
    paragraphs: [
      "Generated types make field renames safe. Run pnpm typegen, get a compile error in the offending consumer, fix it before merging. That's the loop.",
      "We use cf-content-types-generator with --v10 to match the Contentful SDK's WITHOUT_UNRESOLVABLE_LINKS modifier. Types land in apps/web/src/lib/contentful/types and get linted on commit.",
      "If you're building anything bigger than a marketing site, you want this in your pipeline.",
    ],
  },
  {
    id: "seed-blog-6",
    title: "Migrating from headless legacy: a 6-week playbook",
    description: "Phase-by-phase migration plan for teams moving off Sanity, Strapi, or Prismic.",
    slug: "migrating-from-headless-legacy",
    publishedDate: "2026-05-18",
    author: "seed-author-priya",
    paragraphs: [
      "Most CMS migrations fail not because the destination is bad — they fail because the timeline is unrealistic. Six weeks is a sweet spot for teams under 20 editors.",
      "Week 1: schema design. Week 2: content migration script. Weeks 3–4: parallel write to both systems. Week 5: cutover. Week 6: legacy retirement and editor training.",
      "The single biggest source of risk is reference fields. Map them carefully — Contentful's link types are stricter than most legacy systems.",
    ],
  },
];

for (const b of blogDefs) {
  await upsertEntry(b.id + "-entry", "blog", {
    title: b.title,
    description: b.description,
    slug: b.slug,
    publishedDate: b.publishedDate,
    image: link(b.id, "Asset"),
    authors: [link(b.author)],
    richText: rt(b.paragraphs),
    pageBuilder: [link("seed-cta-blog")],
    seoTitle: b.title,
    seoDescription: b.description,
  });
}

log(`\n✓ done`);
process.exit(0);

// ============================================================== helpers ====

function readEnv() {
  const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
  const ENV_ID = process.env.CONTENTFUL_ENVIRONMENT || "master";
  const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
  if (!SPACE_ID || !TOKEN) {
    console.error(
      "Missing CONTENTFUL_SPACE_ID or CONTENTFUL_MANAGEMENT_TOKEN. Populate apps/web/.env first.",
    );
    process.exit(1);
  }
  return { SPACE_ID, ENV_ID, TOKEN };
}

function localized(value) {
  return { [LOCALE]: value };
}

function link(id, linkType = "Entry") {
  return { sys: { type: "Link", linkType, id } };
}

function rt(paragraphs) {
  return {
    nodeType: "document",
    data: {},
    content: paragraphs.map((text) => ({
      nodeType: "paragraph",
      data: {},
      content: [{ nodeType: "text", value: text, marks: [], data: {} }],
    })),
  };
}

function log(msg) {
  console.log(msg);
}

async function upsertAsset(id, { title, url }) {
  const existing = await tryGet(() => env.getAsset(id));
  if (existing) {
    const hasFile = !!existing.fields.file?.[LOCALE]?.url;
    if (!hasFile) {
      log(`  asset ${id} broken — recreating`);
      if (existing.isPublished()) await existing.unpublish();
      const fresh = await env.getAsset(id);
      await fresh.delete();
    } else {
      if (PUBLISH && !existing.isPublished()) {
        const fresh = await env.getAsset(id);
        await fresh.publish();
        log(`  asset ${id} published`);
      } else {
        log(`  asset ${id} exists`);
      }
      return;
    }
  }
  const fileName = `${id}.jpg`;
  const created = await env.createAssetWithId(id, {
    fields: {
      title: localized(title),
      description: localized(title),
      file: localized({ contentType: "image/jpeg", fileName, upload: url }),
    },
  });
  try {
    await created.processForAllLocales({
      processingCheckWait: 2000,
      processingCheckRetries: 30,
    });
  } catch {
    // fall through — we poll below regardless
  }
  for (let i = 0; i < 30; i++) {
    const a = await env.getAsset(id);
    if (a.fields.file?.[LOCALE]?.url) {
      if (PUBLISH) await a.publish();
      log(`  asset ${id} created${PUBLISH ? " + published" : ""}`);
      return;
    }
    await sleep(2000);
  }
  throw new Error(`Asset ${id} processing timeout`);
}

async function upsertEntry(id, contentType, fields) {
  const localizedFields = Object.fromEntries(
    Object.entries(fields).map(([k, v]) => [k, localized(v)]),
  );
  const existing = await tryGet(() => env.getEntry(id));
  if (existing) {
    const drift = fieldsDrift(existing.fields, localizedFields);
    if (drift) {
      Object.assign(existing.fields, localizedFields);
      const updated = await existing.update();
      if (PUBLISH) await updated.publish();
      log(`  entry ${id} (${contentType}) updated${PUBLISH ? " + published" : ""}`);
      return;
    }
    if (PUBLISH && !existing.isPublished()) {
      const fresh = await env.getEntry(id);
      await fresh.publish();
      log(`  entry ${id} (${contentType}) published`);
    } else {
      log(`  entry ${id} (${contentType}) exists`);
    }
    return;
  }
  const entry = await env.createEntryWithId(contentType, id, { fields: localizedFields });
  if (PUBLISH) await entry.publish();
  log(`  entry ${id} (${contentType}) created${PUBLISH ? " + published" : ""}`);
}

function fieldsDrift(current, desired) {
  for (const [k, v] of Object.entries(desired)) {
    if (JSON.stringify(current?.[k]) !== JSON.stringify(v)) return true;
  }
  return false;
}

async function tryGet(fn) {
  try {
    return await fn();
  } catch (err) {
    if (err?.name === "NotFound" || err?.status === 404 || /NotFound/.test(String(err))) {
      return null;
    }
    throw err;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
