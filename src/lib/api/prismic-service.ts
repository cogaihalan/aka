import { optimizedPrismicClient } from "@/lib/prismic";
import {
  PrismicContent,
  PrismicPage,
  PrismicHomepage,
  PrismicCategory,
  PrismicBlogPost,
  PrismicStaticPage,
  PrismicApiResponse,
} from "@/types/prismic";

export class PrismicApiService {
  private client = optimizedPrismicClient;

  // Get all pages with pagination
  async getPages(
    page = 1,
    pageSize = 10
  ): Promise<PrismicApiResponse<PrismicPage>> {
    try {
      const response = await this.client.getAllByType("page", {
        page,
        pageSize,
        orderings: [
          { field: "document.last_publication_date", direction: "desc" },
        ],
      });

      return {
        results: response as unknown as PrismicPage[],
        total_results_size: response.length,
        total_pages: Math.ceil(response.length / pageSize),
        page,
        results_per_page: pageSize,
      };
    } catch (error) {
      console.error("Error fetching pages:", error);
      return {
        results: [],
        total_results_size: 0,
        total_pages: 0,
        page,
        results_per_page: pageSize,
      };
    }
  }

  // Get page by UID
  async getPageByUID(uid: string): Promise<PrismicPage | null> {
    try {
      const page = await this.client.getByUID("page", uid);
      return page as unknown as PrismicPage;
    } catch (error) {
      console.error(`Error fetching page ${uid}:`, error);
      return null;
    }
  }

  // Get homepage
  async getHomepage(): Promise<PrismicHomepage | null> {
    try {
      const homepage = await this.client.getSingle("homepage");
      return homepage as unknown as PrismicHomepage;
    } catch (error) {
      console.error("Error fetching homepage:", error);
      return null;
    }
  }

  // Get all categories
  async getCategories(): Promise<PrismicCategory[]> {
    try {
      const categories = await this.client.getAllByType("category", {
        orderings: [
          { field: "document.first_publication_date", direction: "asc" },
        ],
      });
      return categories as unknown as PrismicCategory[];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  // Get category by UID
  async getCategoryByUID(uid: string): Promise<PrismicCategory | null> {
    try {
      const category = await this.client.getByUID("category", uid);
      return category as unknown as PrismicCategory;
    } catch (error) {
      console.error(`Error fetching category ${uid}:`, error);
      return null;
    }
  }

  // Get blog posts
  async getBlogPosts(
    page = 1,
    pageSize = 10
  ): Promise<PrismicApiResponse<PrismicBlogPost>> {
    try {
      const response = await this.client.getAllByType("blog_post", {
        page,
        pageSize,
        orderings: [
          { field: "document.last_publication_date", direction: "desc" },
        ],
      });

      return {
        results: response as unknown as PrismicBlogPost[],
        total_results_size: response.length,
        total_pages: Math.ceil(response.length / pageSize),
        page,
        results_per_page: pageSize,
      };
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      return {
        results: [],
        total_results_size: 0,
        total_pages: 0,
        page,
        results_per_page: pageSize,
      };
    }
  }

  // Get blog post by UID
  async getBlogPostByUID(uid: string): Promise<PrismicBlogPost | null> {
    try {
      const post = await this.client.getByUID("blog_post", uid);
      return post as unknown as PrismicBlogPost;
    } catch (error) {
      console.error(`Error fetching blog post ${uid}:`, error);
      return null;
    }
  }

  // Get static pages
  async getStaticPages(): Promise<PrismicStaticPage[]> {
    try {
      const pages = await this.client.getAllByType("static_page", {
        orderings: [
          { field: "document.first_publication_date", direction: "asc" },
        ],
      });
      return pages as unknown as PrismicStaticPage[];
    } catch (error) {
      console.error("Error fetching static pages:", error);
      return [];
    }
  }

  // Get static page by UID
  async getStaticPageByUID(uid: string): Promise<PrismicStaticPage | null> {
    try {
      const page = await this.client.getByUID("static_page", uid);
      return page as unknown as PrismicStaticPage;
    } catch (error) {
      console.error(`Error fetching static page ${uid}:`, error);
      return null;
    }
  }

  // Search content
  async searchContent(query: string, type?: string): Promise<PrismicContent[]> {
    try {
      const searchOptions: any = {
        q: `[at(document.type, "${type || "page"}")]`,
        orderings: [
          { field: "document.last_publication_date", direction: "desc" },
        ],
      };

      if (query) {
        searchOptions.q += `[fulltext(document, "${query}")]`;
      }

      const results = await this.client.getAllByType(
        type || "page",
        searchOptions
      );
      return results as unknown as PrismicContent[];
    } catch (error) {
      console.error("Error searching content:", error);
      return [];
    }
  }

  // Get content by ID
  async getContentByID(id: string): Promise<PrismicContent | null> {
    try {
      const content = await this.client.getByID(id);
      return content as unknown as PrismicContent;
    } catch (error) {
      console.error(`Error fetching content ${id}:`, error);
      return null;
    }
  }

  // Get all content types (for admin dashboard)
  async getAllContent(): Promise<{
    pages: PrismicPage[];
    categories: PrismicCategory[];
    blogPosts: PrismicBlogPost[];
    staticPages: PrismicStaticPage[];
  }> {
    try {
      const [pages, categories, blogPosts, staticPages] =
        await Promise.allSettled([
          this.client.getAllByType("page").catch(() => []),
          this.client.getAllByType("category").catch(() => []),
          this.client.getAllByType("blog_post").catch(() => []),
          this.client.getAllByType("static_page").catch(() => []),
        ]);

      return {
        pages: (pages.status === "fulfilled"
          ? pages.value
          : []) as unknown as PrismicPage[],
        categories: (categories.status === "fulfilled"
          ? categories.value
          : []) as unknown as PrismicCategory[],
        blogPosts: (blogPosts.status === "fulfilled"
          ? blogPosts.value
          : []) as unknown as PrismicBlogPost[],
        staticPages: (staticPages.status === "fulfilled"
          ? staticPages.value
          : []) as unknown as PrismicStaticPage[],
      };
    } catch (error) {
      console.error("Error fetching all content:", error);
      return {
        pages: [],
        categories: [],
        blogPosts: [],
        staticPages: [],
      };
    }
  }

  // Clear cache
  clearCache() {
    this.client.clearCache();
  }
}

// Export singleton instance
export const prismicApiService = new PrismicApiService();

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
  clearCache,
} = prismicApiService;
