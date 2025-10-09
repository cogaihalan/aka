import { optimizedPrismicClient } from '@/lib/prismic'
import { 
  PrismicContent, 
  PrismicPage, 
  PrismicHomepage, 
  PrismicCategory, 
  PrismicBlogPost, 
  PrismicStaticPage,
  CreatePageData,
  UpdatePageData,
  PrismicApiResponse
} from '@/types/prismic'

export class PrismicApiService {
  private client = optimizedPrismicClient

  // Get all pages with pagination
  async getPages(page = 1, pageSize = 10): Promise<PrismicApiResponse<PrismicPage>> {
    try {
      const response = await this.client.getAllByType('page', {
        page,
        pageSize,
        orderings: [{ field: 'document.last_publication_date', direction: 'desc' }]
      })

      return {
        results: response as PrismicPage[],
        total_results_size: response.length,
        total_pages: Math.ceil(response.length / pageSize),
        page,
        results_per_page: pageSize
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
      throw new Error('Failed to fetch pages')
    }
  }

  // Get page by UID
  async getPageByUID(uid: string): Promise<PrismicPage | null> {
    try {
      const page = await this.client.getByUID<PrismicPage>('page', uid)
      return page
    } catch (error) {
      console.error(`Error fetching page ${uid}:`, error)
      return null
    }
  }

  // Get homepage
  async getHomepage(): Promise<PrismicHomepage | null> {
    try {
      const homepage = await this.client.getSingle<PrismicHomepage>('homepage')
      return homepage
    } catch (error) {
      console.error('Error fetching homepage:', error)
      return null
    }
  }

  // Get all categories
  async getCategories(): Promise<PrismicCategory[]> {
    try {
      const categories = await this.client.getAllByType<PrismicCategory>('category', {
        orderings: [{ field: 'document.first_publication_date', direction: 'asc' }]
      })
      return categories
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }

  // Get category by UID
  async getCategoryByUID(uid: string): Promise<PrismicCategory | null> {
    try {
      const category = await this.client.getByUID<PrismicCategory>('category', uid)
      return category
    } catch (error) {
      console.error(`Error fetching category ${uid}:`, error)
      return null
    }
  }

  // Get blog posts
  async getBlogPosts(page = 1, pageSize = 10): Promise<PrismicApiResponse<PrismicBlogPost>> {
    try {
      const response = await this.client.getAllByType<PrismicBlogPost>('blog_post', {
        page,
        pageSize,
        orderings: [{ field: 'document.last_publication_date', direction: 'desc' }]
      })

      return {
        results: response,
        total_results_size: response.length,
        total_pages: Math.ceil(response.length / pageSize),
        page,
        results_per_page: pageSize
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      throw new Error('Failed to fetch blog posts')
    }
  }

  // Get blog post by UID
  async getBlogPostByUID(uid: string): Promise<PrismicBlogPost | null> {
    try {
      const post = await this.client.getByUID<PrismicBlogPost>('blog_post', uid)
      return post
    } catch (error) {
      console.error(`Error fetching blog post ${uid}:`, error)
      return null
    }
  }

  // Get static pages
  async getStaticPages(): Promise<PrismicStaticPage[]> {
    try {
      const pages = await this.client.getAllByType<PrismicStaticPage>('static_page', {
        orderings: [{ field: 'document.first_publication_date', direction: 'asc' }]
      })
      return pages
    } catch (error) {
      console.error('Error fetching static pages:', error)
      return []
    }
  }

  // Get static page by UID
  async getStaticPageByUID(uid: string): Promise<PrismicStaticPage | null> {
    try {
      const page = await this.client.getByUID<PrismicStaticPage>('static_page', uid)
      return page
    } catch (error) {
      console.error(`Error fetching static page ${uid}:`, error)
      return null
    }
  }

  // Search content
  async searchContent(query: string, type?: string): Promise<PrismicContent[]> {
    try {
      const searchOptions: any = {
        q: `[at(document.type, "${type || 'page'}")]`,
        orderings: [{ field: 'document.last_publication_date', direction: 'desc' }]
      }

      if (query) {
        searchOptions.q += `[fulltext(document, "${query}")]`
      }

      const results = await this.client.getAllByType(type || 'page', searchOptions)
      return results as PrismicContent[]
    } catch (error) {
      console.error('Error searching content:', error)
      return []
    }
  }

  // Get content by ID
  async getContentByID(id: string): Promise<PrismicContent | null> {
    try {
      const content = await this.client.getByID<PrismicContent>(id)
      return content
    } catch (error) {
      console.error(`Error fetching content ${id}:`, error)
      return null
    }
  }

  // Get all content types (for admin dashboard)
  async getAllContent(): Promise<{
    pages: PrismicPage[]
    categories: PrismicCategory[]
    blogPosts: PrismicBlogPost[]
    staticPages: PrismicStaticPage[]
  }> {
    try {
      const [pages, categories, blogPosts, staticPages] = await Promise.all([
        this.client.getAllByType<PrismicPage>('page'),
        this.client.getAllByType<PrismicCategory>('category'),
        this.client.getAllByType<PrismicBlogPost>('blog_post'),
        this.client.getAllByType<PrismicStaticPage>('static_page')
      ])

      return {
        pages,
        categories,
        blogPosts,
        staticPages
      }
    } catch (error) {
      console.error('Error fetching all content:', error)
      return {
        pages: [],
        categories: [],
        blogPosts: [],
        staticPages: []
      }
    }
  }

  // Clear cache
  clearCache() {
    this.client.clearCache()
  }
}

// Export singleton instance
export const prismicApiService = new PrismicApiService()

// Export individual methods for convenience
export const {
  getPages,
  getPageByUID,
  getHomepage,
  getCategories,
  getCategoryByUID,
  getBlogPosts,
  getBlogPostByUID,
  getStaticPages,
  getStaticPageByUID,
  searchContent,
  getContentByID,
  getAllContent,
  clearCache
} = prismicApiService
