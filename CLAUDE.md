# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **TurboRepo** monorepo, **pnpm@11.1.3**, Node >=20
- **Next.js 16** (App Router, Turbopack dev, React 19, React Compiler beta enabled)
- **Contentful** REST SDK (`contentful` package)
- **Shared UI** in `packages/ui` (Shadcn UI + Radix + Tailwind CSS v4 CSS-first), transpiled by the app via `next.config.ts`
- TypeScript 5.7.3, ESLint (flat config), Prettier

## Common Commands

Run from repo root unless noted. Turbo fans out across the workspace.

```bash
pnpm dev               # turbo dev — starts Next on :3000 with Turbopack
pnpm build             # turbo build
pnpm lint              # turbo lint (eslint per package)
pnpm check-types       # turbo check-types (tsc --noEmit per package)
pnpm format            # prettier --write across the repo
```

App-scoped:
```bash
pnpm --filter web dev
pnpm --filter web lint:fix
pnpm --filter web typegen    # regenerate Contentful content-type TS in apps/web/src/lib/contentful/types
```

`typegen` requires `CONTENTFUL_SPACE_ID` and `CONTENTFUL_MANAGEMENT_TOKEN` in `apps/web/.env`. It uses `cf-content-types-generator` and runs eslint + prettier on the output.

No test runner is configured.

## Architecture

### Workspace layout

- `apps/web/` — the only Next.js app
- `packages/ui/` — Shadcn components, hooks, globals.css (`@workspace/ui`)
- `packages/eslint-config/` — flat configs: `base`, `next-js`, `react-internal`
- `packages/typescript-config/` — `base.json`, `nextjs.json`, `react-library.json`

Path aliases (apps/web/tsconfig.json): `@/*` → `apps/web/src/*`, `@workspace/ui/*` → `packages/ui/src/*`.

### Content fetching + draft mode

`apps/web/src/lib/contentful/client.ts:5` — `getClient(preview)` switches host between `cdn.contentful.com` and `preview.contentful.com` and picks the right token. Every page passes `(await draftMode()).isEnabled` into `getClient` to flip preview on/off per request.

Query helpers in `apps/web/src/lib/contentful/query.ts` always go through `parseContentfulError` for user-friendly error strings and wrap `getGlobalSettings` in React `cache()` for request-level memoization. `getEntries` calls use `include: 10` to resolve linked references in one round-trip.

Callers wrap query promises in `safeAsync` (`apps/web/src/safe-async.ts:5`) which returns a discriminated `Result<T>` — that's the convention; don't introduce ad-hoc try/catch in pages.

### PageBuilder block registry

`apps/web/src/components/pagebuilder.tsx` — `page` content type holds a `pageBuilder` array of references. The component:
1. Detects unresolved links (renders `UnresolvedBlock`)
2. Looks up `block.sys.contentType.sys.id` in `BLOCK_COMPONENTS` (currently: `callToAction`, `faqAccordion`, `hero`, `featureCards`)
3. Renders the matched section component, or `ErrorBlock` if unknown

**To add a new page builder block:** create the Contentful content type, run `typegen`, add the section component under `apps/web/src/components/sections/`, then register it in both `BLOCK_COMPONENTS` and the switch in `PageBuilder`. Also extend the `PageBuilderSkeleton` union. **Also add a serializer** for the block in `apps/web/src/lib/contentful/page-builder-to-markdown.ts` (see "Markdown content negotiation" below) — otherwise the block is silently dropped from Markdown output.

### Contentful Live Preview (CRITICAL — read before adding sections)

Every section block under `apps/web/src/components/sections/` MUST:
- Start with `"use client";`
- Apply `useContentfulLiveUpdates(props)` and read fields off the returned `updatedProps.fields ?? {}`
- Build `inspectorProps = useContentfulInspectorMode({ entryId: updatedProps.sys.id })`
- Spread `{...inspectorProps({ fieldId: "<exact-contentful-field-name>" })}` onto every editable element

`apps/web/src/components/sections/hero.tsx` is the reference implementation. Detailed template + checklist in `.cursor/rules/contentful-component-template.mdc`.

The root layout (`apps/web/src/app/layout.tsx:44`) reads `draftMode()` and toggles `enableInspectorMode` / `enableLiveUpdates` on `ContentfulPreviewProvider` so the hooks above are no-ops in production but live in preview.

### Server/client split

- Pages are async server components — fetch with `safeAsync` + `getClient(isEnabled)`, then hand data to section components.
- `NavbarServer` / `FooterServer` (in `apps/web/src/components/{navbar,footer}.tsx`) are server components that call `getGlobalSettings()` and pass into client components (`NavbarClient`). The layout wraps each in `<Suspense>` with a `*Skeleton` fallback.

### Preview / draft API surface

`apps/web/src/app/api/`:
- `draft/route.ts` — local/dev entry: validates `?token=` against `CONTENTFUL_DRAFT_TOKEN`, enables draft mode, redirects to `?path=`.
- `preview/route.ts` — Vercel-deployed entry from Contentful's preview button. Two auth paths:
  - **Dev** (`NODE_ENV=development`): just enables draft + sets `__prerender_bypass` cookie.
  - **Prod**: parses `_vercel_jwt` cookie (or query params `x-vercel-protection-bypass` / `x-contentful-preview-secret`), validates `bypassToken` against `VERCEL_AUTOMATION_BYPASS_SECRET` or `CONTENTFUL_PREVIEW_SECRET`, checks JWT `aud` matches request host, then enables draft and redirects with bypass query carried through.
- `disable-draft/route.ts` — disables draft, 1s sleep for state sync, redirects.
- `revalidate/route.ts` — POST webhook from Contentful. Auth via `x-vercel-revalidation-key` header against `CONTENTFUL_REVALIDATION_SECRET`. Body accepts `{ path }` → `revalidatePath` and/or `{ tag }` → `revalidateTag`.
- `og/route.tsx` — dynamic OG image generation referenced by `getSEOMetadata`.

### Markdown content negotiation (LLM/agent output)

Any page is available as clean Markdown via two surfaces: append **`.md`** to the URL (`/about.md`, `/blog/post.md`, `/index.md`) **or** send **`Accept: text/markdown`** (q-value aware — `;q=0` returns HTML). Plain requests are untouched.

Markdown is built by **serializing the structured Contentful data, never by stripping rendered React** — so page-builder blocks degrade to semantic Markdown (`## question` + answer) and a component can never leak as a tag. Flow:
- `apps/web/src/proxy.ts` (Next 16 proxy) detects `.md`/`Accept` and rewrites to `api/markdown/route.ts`, forwarding the content path via the `x-markdown-path` header.
- `api/markdown/route.ts` maps the path → home / page / blog post / blog index, returns `text/markdown` (`200`) with `Vary: Accept`, `Content-Location`, `X-Robots-Tag: noindex, nofollow`; missing doc → `404`, upstream fetch failure → `503`. Always serves published content.
- `lib/markdown.ts` assembles the document (header + cover + rich text + blocks); `lib/contentful/rich-text-to-markdown.ts` walks the rich-text `Document`; `lib/contentful/page-builder-to-markdown.ts` is the block registry keyed by `contentType.sys.id` — **unknown types serialize to `""`** (fail-safe). The route is an optional catch-all `api/markdown/[[...path]]/route.ts`, so the content path also works as a clean direct URL (`/api/markdown/blog/post`).
- **Discoverability:** `getSEOMetadata` (`lib/seo.ts`) emits a per-page `<link rel="alternate" type="text/markdown">` pointing at the `.md` twin; `app/llms.txt/route.ts` carries a "For AI agents" negotiation guide + a page/blog index; `app/llms-full.txt/route.ts` serializes the **entire site** into one Markdown document (RAG dump). Both `llms.txt` and `llms-full.txt` are excluded from the proxy matcher.

### SEO

`apps/web/src/lib/seo.ts` — `getSEOMetadata({ title, description, slug, contentId, contentType, seoNoIndex })` builds Next `Metadata`. Site defaults (title/description/twitter/keywords) are hardcoded in the `siteConfig` constant — edit there to rebrand. `getBaseUrl()` in `apps/web/src/config.ts` resolves prod / preview / local URLs from Vercel env.

JSON-LD via `schema-dts` in `apps/web/src/components/json-ld.tsx`.

### Security headers

`apps/web/next.config.ts:28` sets `X-Frame-Options: SAMEORIGIN` and `Content-Security-Policy: frame-ancestors 'self' https://app.contentful.com` globally — required for Contentful's preview iframe. Don't drop these.

## Environment Variables

Required (declared in `turbo.json:globalEnv` and read in `apps/web/src/lib/env.ts`):

```env
CONTENTFUL_SPACE_ID
CONTENTFUL_ACCESS_TOKEN              # delivery API
CONTENTFUL_PREVIEW_ACCESS_TOKEN      # preview API (falls back to access token)
CONTENTFUL_ENVIRONMENT               # e.g. "master"
CONTENTFUL_DRAFT_TOKEN               # /api/draft secret
CONTENTFUL_PREVIEW_SECRET            # /api/preview Contentful path
CONTENTFUL_REVALIDATION_SECRET       # /api/revalidate webhook
VERCEL_AUTOMATION_BYPASS_SECRET      # /api/preview Vercel JWT path
CONTENTFUL_MANAGEMENT_TOKEN          # typegen only
```

`.env` lives in `apps/web/`. See `apps/web/.env.example` for the canonical list.

## Component Conventions

From `.cursor/rules/`:
- **New Contentful sections**: follow the Live Preview pattern above and the template in `.cursor/rules/contentful-component-template.mdc`. Section files live in `apps/web/src/components/sections/`, kebab-case (`feature-cards-with-icon.tsx`), `PascalCase` exports, props type `[Component]Props = TypeXxx<"WITHOUT_UNRESOLVABLE_LINKS">`. Wrap in `<section id="…" className="my-6 md:my-16">` with a `container` inner div — the shared `container` utility (`packages/ui/src/styles/globals.css`) already centres and applies the `px-4 md:px-6` gutters, so don't add `mx-auto`/padding.
- **Layout primitives** (`frontend-rules.mdc`): prefer `grid` over `flex` except for simple parent-child rows; use semantic HTML; route all button rendering through `ContentfulButtons` (`apps/web/src/components/contentful-button.tsx`); images through `ContentfulImage`.
- **Shared UI**: import from `@workspace/ui/components/<name>` — don't duplicate Shadcn components into the app.

## Quirks / Gotchas

- **`include: 10` everywhere**: queries deep-link-resolve up to 10 levels. Be aware of payload size when adding new linked types.
- **Type-gen is REST-based**: content types in `apps/web/src/lib/contentful/types/` come from `cf-content-types-generator` via `pnpm --filter web typegen` — not GraphQL.
- **Draft mode is the only auth** on draft-enabled routes — never expose `CONTENTFUL_DRAFT_TOKEN`, `CONTENTFUL_REVALIDATION_SECRET`, `CONTENTFUL_PREVIEW_SECRET`, or `VERCEL_AUTOMATION_BYPASS_SECRET` client-side.
- **`/api/preview` requires both query bypass token AND `_vercel_jwt` cookie** in production — the cookie's `aud` is what enforces host binding (leaked query tokens alone can't be replayed from another host).
- **Tailwind is CSS-first (v4)**: there is no `tailwind.config.ts`. Theme tokens, plugins, and source globs live in `packages/ui/src/styles/globals.css` via `@theme`, `@plugin`, `@source`, `@custom-variant dark`.
