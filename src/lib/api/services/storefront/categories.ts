import { Category } from "@/types/app";

export interface CategoriesResponse {
  categories: Category[];
  total: number;
}

export interface CategoryFilters {
  isActive?: boolean;
  parentId?: string;
  search?: string;
}

class CategoriesService {
  private baseUrl = "/api/categories";
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}_${JSON.stringify(params || {})}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTimeout;
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * Get all categories with optional filtering
   */
  async getCategories(filters?: CategoryFilters): Promise<CategoriesResponse> {
    const cacheKey = this.getCacheKey("categories", filters);
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const params = new URLSearchParams();
      if (filters?.isActive !== undefined) {
        params.append("isActive", filters.isActive.toString());
      }
      if (filters?.parentId) {
        params.append("parentId", filters.parentId);
      }
      if (filters?.search) {
        params.append("search", filters.search);
      }

      const response = await fetch(`${this.baseUrl}?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }

      const data = await response.json();
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error("Error fetching categories:", error);

      // Return mock data as fallback
      return this.getMockCategories(filters);
    }
  }

  /**
   * Get a single category by ID
   */
  async getCategoryById(id: string): Promise<Category | null> {
    const cacheKey = this.getCacheKey("category", { id });
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`${this.baseUrl}/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch category: ${response.statusText}`);
      }

      const data = await response.json();
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error("Error fetching category:", error);

      // Return mock data as fallback
      const mockCategories = this.getMockCategories();
      return mockCategories.categories.find((cat) => cat.id === id) || null;
    }
  }

  /**
   * Get a single category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const cacheKey = this.getCacheKey("category", { slug });
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`${this.baseUrl}/slug/${slug}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch category: ${response.statusText}`);
      }

      const data = await response.json();
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error("Error fetching category:", error);

      // Return mock data as fallback
      const mockCategories = this.getMockCategories();
      return mockCategories.categories.find((cat) => cat.slug === slug) || null;
    }
  }

  /**
   * Get categories tree (hierarchical structure)
   */
  async getCategoriesTree(): Promise<Category[]> {
    const cacheKey = this.getCacheKey("categories-tree");
    const cached = this.getCachedData(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`${this.baseUrl}/tree`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch categories tree: ${response.statusText}`
        );
      }

      const data = await response.json();
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error("Error fetching categories tree:", error);

      // Return mock data as fallback
      return this.getMockCategories().categories;
    }
  }

  /**
   * Clear cache for categories
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Clear cache for specific category
   */
  clearCategoryCache(id: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(
      (key) => key.includes(id) || key.includes("categories")
    );
    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  /**
   * Mock data fallback
   */
  getMockCategories(filters?: CategoryFilters): CategoriesResponse {
    const mockCategories: Category[] = [
      {
        id: "electronics",
        name: "Electronics",
        slug: "electronics",
        description: "Latest electronic devices and gadgets",
        productCount: 45,
        isActive: true,
        sortOrder: 1,
      },
      {
        id: "clothing",
        name: "Clothing",
        slug: "clothing",
        description: "Fashion and apparel",
        productCount: 32,
        isActive: true,
        sortOrder: 2,
      },
      {
        id: "home",
        name: "Home & Garden",
        slug: "home",
        description: "Home improvement and garden supplies",
        productCount: 28,
        isActive: true,
        sortOrder: 3,
      },
      {
        id: "sports",
        name: "Sports & Outdoors",
        slug: "sports",
        description: "Sports equipment and outdoor gear",
        productCount: 19,
        isActive: true,
        sortOrder: 4,
      },
      {
        id: "books",
        name: "Books",
        slug: "books",
        description: "Books and educational materials",
        productCount: 15,
        isActive: true,
        sortOrder: 5,
      },
      {
        id: "beauty",
        name: "Beauty & Health",
        slug: "beauty",
        description: "Beauty and health products",
        productCount: 12,
        isActive: true,
        sortOrder: 6,
      },
    ];

    let filteredCategories = mockCategories;

    if (filters) {
      if (filters.isActive !== undefined) {
        filteredCategories = filteredCategories.filter(
          (cat) => cat.isActive === filters.isActive
        );
      }
      if (filters.parentId) {
        filteredCategories = filteredCategories.filter(
          (cat) => cat.parentId === filters.parentId
        );
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredCategories = filteredCategories.filter(
          (cat) =>
            cat.name.toLowerCase().includes(searchLower) ||
            cat.description?.toLowerCase().includes(searchLower)
        );
      }
    }

    return {
      categories: filteredCategories,
      total: filteredCategories.length,
    };
  }
}

export const categoriesService = new CategoriesService();
