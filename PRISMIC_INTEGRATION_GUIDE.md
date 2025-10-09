# Prismic CMS Integration Guide

This guide covers the complete Prismic CMS integration for the AKA e-commerce platform, including setup, configuration, content management, and performance optimization.

## Table of Contents

1. [Overview](#overview)
2. [Setup & Configuration](#setup--configuration)
3. [Content Types](#content-types)
4. [API Integration](#api-integration)
5. [Performance Optimization](#performance-optimization)
6. [Dashboard Components](#dashboard-components)
7. [Dynamic Page Rendering](#dynamic-page-rendering)
8. [Environment Variables](#environment-variables)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

## Overview

The Prismic integration provides a headless CMS solution for managing static pages, blog posts, categories, and other content. It includes:

- **Performance-optimized client** with caching and monitoring
- **Dynamic page rendering** with SEO optimization
- **Admin dashboard** for content management
- **Type-safe API** with comprehensive TypeScript support
- **ISR (Incremental Static Regeneration)** for optimal performance

## Setup & Configuration

### 1. Install Dependencies

```bash
npm install @prismicio/client @prismicio/next
```

### 2. Environment Variables

Add these variables to your `.env.local`:

```env
# Prismic Configuration
PRISMIC_REPOSITORY_NAME=your-repo-name
NEXT_PUBLIC_PRISMIC_URL=https://your-repo.prismic.io
PRISMIC_ACCESS_TOKEN=your-access-token
```

### 3. Client Configuration

The main Prismic client is configured in `src/lib/prismic.ts`:

```typescript
import { createClient } from "@prismicio/client";
import { enableAutoPreviews } from "@prismicio/next";

export const repositoryName =
  process.env.PRISMIC_REPOSITORY_NAME || "your-repo-name";

export const routes = [
  { type: "homepage", path: "/" },
  { type: "page", path: "/:uid" },
  { type: "blog_post", path: "/blog/:uid" },
  { type: "static_page", path: "/:uid" },
];

export function createPrismicClient(config = {}) {
  const client = createClient(repositoryName, {
    routes,
    fetchOptions: {
      next:
        process.env.NODE_ENV === "production"
          ? {
              tags: ["prismic"],
              revalidate: 3600, // 1 hour cache
            }
          : {
              revalidate: 5, // 5 seconds in development
            },
    },
    ...config,
  });

  if (process.env.NODE_ENV === "development") {
    enableAutoPreviews({ client });
  }

  return client;
}
```

## Content Types

The integration supports several content types defined in `src/types/prismic.ts`:

### 1. Page Content Type

```typescript
export interface PrismicPage extends PrismicDocument {
  type: "page";
  data: {
    title: string;
    content: any; // Rich text content
    slug: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string[];
    featured_image?: {
      url: string;
      alt: string;
    };
    status: "draft" | "published";
    published_date?: string;
    last_modified?: string;
  };
}
```

### 2. Homepage Content Type

```typescript
export interface PrismicHomepage extends PrismicDocument {
  type: "homepage";
  data: {
    title: string;
    hero_title: string;
    hero_description: string;
    hero_image: {
      url: string;
      alt: string;
    };
    featured_products: any[];
    meta_title?: string;
    meta_description?: string;
  };
}
```

### 3. Blog Post Content Type

```typescript
export interface PrismicBlogPost extends PrismicDocument {
  type: "blog_post";
  data: {
    title: string;
    slug: string;
    content: any; // Rich text content
    excerpt: string;
    featured_image?: {
      url: string;
      alt: string;
    };
    author: string;
    published_date: string;
    tags: string[];
    meta_title?: string;
    meta_description?: string;
  };
}
```

### 4. Category Content Type

```typescript
export interface PrismicCategory extends PrismicDocument {
  type: "category";
  data: {
    name: string;
    slug: string;
    description: string;
    image?: {
      url: string;
      alt: string;
    };
    parent_category?: {
      id: string;
      type: string;
    };
    meta_title?: string;
    meta_description?: string;
  };
}
```

### 5. Static Page Content Type

```typescript
export interface PrismicStaticPage extends PrismicDocument {
  type: "static_page";
  data: {
    title: string;
    slug: string;
    content: any; // Rich text content
    page_type: "about" | "contact" | "privacy" | "terms" | "help" | "custom";
    meta_title?: string;
    meta_description?: string;
    status: "draft" | "published";
  };
}
```

## API Integration

### PrismicApiService

The main API service is located in `src/lib/api/prismic-service.ts` and provides:

```typescript
export class PrismicApiService {
  // Get all pages with pagination
  async getPages(
    page = 1,
    pageSize = 10
  ): Promise<PrismicApiResponse<PrismicPage>>;

  // Get page by UID
  async getPageByUID(uid: string): Promise<PrismicPage | null>;

  // Get homepage
  async getHomepage(): Promise<PrismicHomepage | null>;

  // Get all categories
  async getCategories(): Promise<PrismicCategory[]>;

  // Get blog posts
  async getBlogPosts(
    page = 1,
    pageSize = 10
  ): Promise<PrismicApiResponse<PrismicBlogPost>>;

  // Get static pages
  async getStaticPages(): Promise<PrismicStaticPage[]>;

  // Search content
  async searchContent(query: string, type?: string): Promise<PrismicContent[]>;

  // Get all content types (for admin dashboard)
  async getAllContent(): Promise<{
    pages: PrismicPage[];
    categories: PrismicCategory[];
    blogPosts: PrismicBlogPost[];
    staticPages: PrismicStaticPage[];
  }>;
}
```

### Usage Examples

```typescript
import { prismicApiService } from "@/lib/api/prismic-service";

// Get homepage content
const homepage = await prismicApiService.getHomepage();

// Get all pages
const pages = await prismicApiService.getPages(1, 10);

// Get specific page
const page = await prismicApiService.getPageByUID("about-us");

// Search content
const results = await prismicApiService.searchContent("product", "page");
```

## Performance Optimization

### 1. Caching Strategy

The integration includes a performance monitoring system with caching:

```typescript
export class PrismicPerformanceMonitor {
  private static cache = new Map<string, { data: any; timestamp: number }>();

  static getCached(key: string) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < 300000) {
      // 5 minutes
      return cached.data;
    }
    return null;
  }

  static setCached(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}
```

### 2. Optimized Client

```typescript
export class OptimizedPrismicClient {
  async getByUID<T = any>(type: string, uid: string, options = {}) {
    const cacheKey = `${type}-${uid}`;
    const cached = PrismicPerformanceMonitor.getCached(cacheKey);

    if (cached) {
      return cached;
    }

    return PrismicPerformanceMonitor.measureFetch(
      `getByUID(${type}, ${uid})`,
      async () => {
        const result = await this.client.getByUID(type, uid, options);
        PrismicPerformanceMonitor.setCached(cacheKey, result);
        return result;
      }
    );
  }
}
```

### 3. ISR Configuration

Dynamic pages use ISR for optimal performance:

```typescript
// In [...slug]/page.tsx
export const revalidate = 3600; // Revalidate every hour
```

## Dashboard Components

### 1. PrismicDashboard

Located in `src/features/prismic/components/prismic-dashboard.tsx`, provides:

- **Quick Stats**: Total pages, published/draft counts, last updated
- **Recent Pages**: Latest content updates
- **Quick Actions**: Create new page, open Prismic

### 2. PrismicPagesList

Located in `src/features/prismic/components/prismic-pages-list.tsx`, provides:

- **Page Management**: View all pages in a table format
- **Filtering**: Search by title/slug, filter by status/type
- **Actions**: View page, edit in Prismic

### Usage in Dashboard

```typescript
// In src/app/dashboard/pages/page.tsx
import { PrismicDashboard } from "@/features/prismic/components/prismic-dashboard"
import { PrismicPagesList } from "@/features/prismic/components/prismic-pages-list"

export default function PrismicPagesPage() {
  return (
    <PageContainer>
      <Suspense fallback={<PrismicDashboardSkeleton />}>
        <PrismicDashboard />
      </Suspense>

      <Suspense fallback={<div>Loading pages...</div>}>
        <PrismicPagesList />
      </Suspense>
    </PageContainer>
  )
}
```

## Dynamic Page Rendering

### 1. Dynamic Route Handler

The `[...slug]/page.tsx` handles all dynamic Prismic content:

```typescript
export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = await params
  const slugPath = slug.join('/')

  // Handle blog posts
  if (slug[0] === 'blog' && slug.length === 2) {
    const post = await prismicApiService.getBlogPostByUID(slug[1])
    if (post) {
      return (
        <Suspense fallback={<PrismicPageSkeleton />}>
          <PrismicPageRenderer content={post} type="blog_post" />
        </Suspense>
      )
    }
  }

  // Handle regular pages
  const page = await prismicApiService.getPageByUID(slugPath)
  if (page) {
    return (
      <Suspense fallback={<PrismicPageSkeleton />}>
        <PrismicPageRenderer content={page} type="page" />
      </Suspense>
    )
  }

  notFound()
}
```

### 2. SEO Optimization

Automatic metadata generation for all content:

```typescript
export async function generateMetadata({
  params,
}: DynamicPageProps): Promise<Metadata> {
  const { slug } = await params;

  const page = await prismicApiService.getPageByUID(slug.join("/"));
  if (page) {
    return {
      title: page.data?.meta_title || page.data?.title || "Page",
      description: page.data?.meta_description || "",
      keywords: page.data?.meta_keywords?.join(", ") || "",
      openGraph: {
        title: page.data?.title || "",
        description: page.data?.meta_description || "",
        images: page.data?.featured_image?.url
          ? [page.data.featured_image.url]
          : [],
      },
    };
  }
}
```

### 3. Static Generation

Pre-generate static pages for better performance:

```typescript
export async function generateStaticParams() {
  const [pages, staticPages, blogPosts] = await Promise.all([
    prismicApiService.getPages(1, 100),
    prismicApiService.getStaticPages(),
    prismicApiService.getBlogPosts(1, 100),
  ]);

  const params = [];

  // Add page routes
  for (const page of pages.results) {
    params.push({ slug: [page.uid] });
  }

  // Add blog post routes
  for (const post of blogPosts.results) {
    params.push({ slug: ["blog", post.uid] });
  }

  return params;
}
```

## Environment Variables

Required environment variables:

```env
# Prismic Configuration
PRISMIC_REPOSITORY_NAME=your-repo-name
NEXT_PUBLIC_PRISMIC_URL=https://your-repo.prismic.io
PRISMIC_ACCESS_TOKEN=your-access-token

# Optional: For preview mode
PRISMIC_PREVIEW_SECRET=your-preview-secret
```

## Best Practices

### 1. Content Management

- **Use consistent naming**: Follow a clear naming convention for UIDs
- **SEO optimization**: Always fill meta_title and meta_description
- **Image optimization**: Use appropriate image sizes and alt text
- **Status management**: Use draft/published status appropriately

### 2. Performance

- **Cache strategy**: Leverage the built-in caching system
- **ISR**: Use Incremental Static Regeneration for dynamic content
- **Image optimization**: Use Next.js Image component for Prismic images
- **Bundle optimization**: Import only needed Prismic components

### 3. Development

- **Type safety**: Use the provided TypeScript interfaces
- **Error handling**: Implement proper error boundaries
- **Preview mode**: Use Prismic preview for content editing
- **Testing**: Test content rendering with different data structures

### 4. Content Structure

```typescript
// Recommended content structure
{
  "title": "Page Title",
  "content": "Rich text content...",
  "slug": "page-slug",
  "meta_title": "SEO Title",
  "meta_description": "SEO Description",
  "meta_keywords": ["keyword1", "keyword2"],
  "featured_image": {
    "url": "https://images.prismic.io/...",
    "alt": "Image description"
  },
  "status": "published"
}
```

## Troubleshooting

### Common Issues

1. **Content not loading**

   - Check environment variables
   - Verify repository name
   - Check network connectivity

2. **Preview mode not working**

   - Ensure preview secret is set
   - Check Prismic preview configuration
   - Verify route handling

3. **Performance issues**

   - Check cache configuration
   - Monitor API calls
   - Optimize image sizes

4. **Type errors**
   - Update TypeScript interfaces
   - Check content structure
   - Verify API responses

### Debug Tools

```typescript
// Enable debug logging
const client = createPrismicClient({
  debug: process.env.NODE_ENV === "development",
});

// Monitor performance
PrismicPerformanceMonitor.getMetrics();
```

### Support Resources

- [Prismic Documentation](https://prismic.io/docs)
- [Next.js Integration Guide](https://prismic.io/docs/nextjs)
- [TypeScript Support](https://prismic.io/docs/typescript)

## File Structure

```
src/
├── lib/
│   ├── prismic.ts                 # Main Prismic client
│   └── api/
│       └── prismic-service.ts     # API service layer
├── types/
│   └── prismic.ts                # TypeScript interfaces
├── features/
│   └── prismic/
│       └── components/
│           ├── prismic-dashboard.tsx
│           └── prismic-pages-list.tsx
├── components/
│   └── prismic/
│       ├── prismic-page-renderer.tsx
│       └── prismic-page-skeleton.tsx
└── app/
    ├── [...slug]/
    │   └── page.tsx              # Dynamic page handler
    └── dashboard/
        └── pages/
            └── page.tsx          # Admin dashboard
```

This integration provides a complete, production-ready Prismic CMS solution with performance optimization, type safety, and comprehensive content management capabilities.
