import { Document } from '@prismicio/client'

// Base Prismic document interface
export interface PrismicDocument extends Document {
  id: string
  uid: string
  type: string
  href: string
  tags: string[]
  slugs: string[]
  lang: string
  alternate_languages: any[]
  first_publication_date: string
  last_publication_date: string
  linked_documents: any[]
}

// Page content type
export interface PrismicPage extends PrismicDocument {
  type: 'page'
  data: {
    title: string
    content: any // Rich text content
    slug: string
    meta_title?: string
    meta_description?: string
    meta_keywords?: string[]
    featured_image?: {
      url: string
      alt: string
    }
    status: 'draft' | 'published'
    published_date?: string
    last_modified?: string
  }
}

// Homepage content type
export interface PrismicHomepage extends PrismicDocument {
  type: 'homepage'
  data: {
    title: string
    hero_title: string
    hero_description: string
    hero_image: {
      url: string
      alt: string
    }
    featured_products: any[]
    meta_title?: string
    meta_description?: string
  }
}

// Category content type
export interface PrismicCategory extends PrismicDocument {
  type: 'category'
  data: {
    name: string
    slug: string
    description: string
    image?: {
      url: string
      alt: string
    }
    parent_category?: {
      id: string
      type: string
    }
    meta_title?: string
    meta_description?: string
  }
}

// Blog post content type
export interface PrismicBlogPost extends PrismicDocument {
  type: 'blog_post'
  data: {
    title: string
    slug: string
    content: any // Rich text content
    excerpt: string
    featured_image?: {
      url: string
      alt: string
    }
    author: string
    published_date: string
    tags: string[]
    meta_title?: string
    meta_description?: string
  }
}

// Static page content type
export interface PrismicStaticPage extends PrismicDocument {
  type: 'static_page'
  data: {
    title: string
    slug: string
    content: any // Rich text content
    page_type: 'about' | 'contact' | 'privacy' | 'terms' | 'help' | 'custom'
    meta_title?: string
    meta_description?: string
    status: 'draft' | 'published'
  }
}

// Union type for all Prismic content types
export type PrismicContent = 
  | PrismicPage 
  | PrismicHomepage 
  | PrismicCategory 
  | PrismicBlogPost 
  | PrismicStaticPage

// API response types
export interface PrismicApiResponse<T = PrismicContent> {
  results: T[]
  total_results_size: number
  total_pages: number
  page: number
  results_per_page: number
  next_page?: string
  prev_page?: string
}

// Content management types
export interface CreatePageData {
  title: string
  content: any
  slug: string
  meta_title?: string
  meta_description?: string
  status?: 'draft' | 'published'
}

export interface UpdatePageData {
  title?: string
  content?: any
  slug?: string
  meta_title?: string
  meta_description?: string
  status?: 'draft' | 'published'
}

// Performance monitoring types
export interface PrismicPerformanceMetrics {
  operation: string
  duration: number
  timestamp: number
  success: boolean
  cache_hit?: boolean
}

// Cache configuration
export interface PrismicCacheConfig {
  ttl: number // Time to live in milliseconds
  max_size: number // Maximum cache entries
  enabled: boolean
}

// Client configuration
export interface PrismicClientConfig {
  repository_name: string
  access_token?: string
  routes: Array<{
    type: string
    path: string
  }>
  fetch_options: {
    next: {
      tags?: string[]
      revalidate?: number
    }
  }
}
