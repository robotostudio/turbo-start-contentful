# Next.js Monorepo with Contentful CMS

A modern, full-stack monorepo template built with Next.js App Router, Contentful CMS, Shadcn UI, and TurboRepo for building scalable web applications with content management.

![Modern Next.js Monorepo](https://raw.githubusercontent.com/robotostudio/turbo-start-contentful/main/turbo-start-contentful-og.png)

## What's Inside

This monorepo demonstrates modern web development practices with a focus on developer experience, performance, and maintainability.

### 🏗️ Monorepo Structure

```
turbo-next-contentful/
├── apps/
│   └── web/                 # Next.js frontend application
├── packages/
│   ├── ui/                  # Shared UI components (Shadcn UI)
│   ├── eslint-config/       # Shared ESLint configuration
│   └── typescript-config/   # Shared TypeScript configuration
└── turbo.json              # TurboRepo configuration
```

### 🚀 Frontend Application (`apps/web`)

- **Next.js 14 App Router** - Modern React framework with file-based routing
- **TypeScript** - Type-safe development experience
- **Shadcn UI + Tailwind CSS** - Beautiful, accessible UI components
- **Server Components** - Optimized rendering and performance
- **Dynamic Page Builder** - Flexible content layouts from Contentful
- **Blog System** - Full-featured blog with rich text support
- **SEO Optimized** - Built-in metadata, sitemaps, and structured data

### 📝 Content Management

- **Contentful CMS** - Headless content management system
- **GraphQL Integration** - Type-safe content fetching with codegen
- **Rich Text Rendering** - Custom rich text components
- **Preview Mode** - Live preview of draft content
- **Image Optimization** - Automatic image optimization and delivery

### 🔧 Development Tools

- **TurboRepo** - Monorepo build system with intelligent caching
- **Shared Packages** - Reusable components, configs, and utilities
- **ESLint & Prettier** - Code quality and formatting
- **TypeScript** - End-to-end type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended package manager)
- Contentful account and space

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd turbo-next-contentful
pnpm install
```

### 2. Environment Setup

Create a `.env.local` file in `apps/web/`:

```bash
# Contentful Configuration
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token
CONTENTFUL_ENVIRONMENT=master

# Preview Mode
CONTENTFUL_PREVIEW_SECRET=your_preview_secret
```

### 3. Start Development

```bash
pnpm run dev
```

This starts the Next.js application at [http://localhost:3000](http://localhost:3000).

## Content Structure

The application supports various content types through Contentful:

- **Pages** - Dynamic pages with flexible page builder
- **Blog Posts** - Articles with rich text content
- **Global Settings** - Site-wide configuration
- **Navigation** - Header and footer content
- **Reusable Sections** - Hero, CTA, FAQ, Feature cards

## Key Features

### 🎨 Page Builder
Flexible content sections that can be mixed and matched:
- Hero sections with call-to-actions
- Feature cards with icons
- FAQ accordions
- Call-to-action blocks

### 📱 Responsive Design
Mobile-first approach with Tailwind CSS utilities and responsive components.

### ⚡ Performance
- Server-side rendering with Next.js App Router
- Optimized images with Contentful's delivery API
- Static generation where possible
- Intelligent caching with TurboRepo

### 🔍 SEO Ready
- Automatic sitemap generation
- Structured data (JSON-LD)
- Meta tags and Open Graph support
- Dynamic robots.txt

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set the root directory to `apps/web`
3. Configure environment variables
4. Deploy automatically on git push

### Other Platforms

The Next.js app can be deployed to any platform that supports Node.js applications.

## Extending the Project

### Adding New Components

Shared components go in `packages/ui/src/components/`. App-specific components go in `apps/web/src/components/`.

### Adding Content Types

1. Create content types in Contentful
2. Run `pnpm run codegen` to generate TypeScript types
3. Add components to render the new content types

### Customizing Styles

The project uses Tailwind CSS with a shared configuration. Customize `tailwind.config.ts` in the respective packages.

## Scripts

- `pnpm run dev` - Start development servers
- `pnpm run build` - Build all applications
- `pnpm run codegen` - Generate TypeScript types from Contentful schema
- `pnpm run lint` - Run ESLint across all packages
- `pnpm run type-check` - Run TypeScript checks

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Contentful Documentation](https://www.contentful.com/developers/docs/)
- [TurboRepo Documentation](https://turbo.build/repo/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/)

## Contributing

Contributions are welcome! Please read our contributing guidelines and code of conduct before submitting pull requests.
