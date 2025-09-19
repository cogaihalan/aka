import { apiClient } from "@/lib/api/client";
import type {
  Product,
  ProductListResponse,
  Category,
  Brand,
  SearchResult,
  QueryParams,
} from "@/lib/api/types";

export class StorefrontCatalogService {
  private basePath = "/storefront";

  // Product catalog
  async getProducts(params: QueryParams = {}): Promise<ProductListResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(`filters[${key}]`, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}/products?${queryString}`
      : `${this.basePath}/products`;

    const response = await apiClient.get<ProductListResponse>(endpoint);
    return response.data!;
  }

  // Get a single product by ID
  async getProduct(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(
      `${this.basePath}/products/${id}`
    );
    return response.data!;
  }

  // Get product by slug
  async getProductBySlug(slug: string): Promise<Product> {
    const response = await apiClient.get<Product>(
      `${this.basePath}/products/slug/${slug}`
    );
    return response.data!;
  }

  // Featured products
  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
      `${this.basePath}/products/featured?limit=${limit}`
    );
    return response.data!;
  }

  // New arrivals
  async getNewArrivals(limit: number = 10): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
      `${this.basePath}/products/new?limit=${limit}`
    );
    return response.data!;
  }

  // Best sellers
  async getBestSellers(limit: number = 10): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
      `${this.basePath}/products/bestsellers?limit=${limit}`
    );
    return response.data!;
  }

  // On sale products
  async getOnSaleProducts(limit: number = 10): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
      `${this.basePath}/products/sale?limit=${limit}`
    );
    return response.data!;
  }

  // Related products
  async getRelatedProducts(
    productId: number,
    limit: number = 5
  ): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
      `${this.basePath}/products/${productId}/related?limit=${limit}`
    );
    return response.data!;
  }

  // Frequently bought together
  async getFrequentlyBoughtTogether(
    productId: number,
    limit: number = 5
  ): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
      `${this.basePath}/products/${productId}/frequently-bought?limit=${limit}`
    );
    return response.data!;
  }

  // Product search
  async searchProducts(
    query: string,
    params: QueryParams = {}
  ): Promise<SearchResult<Product>> {
    const searchParams = new URLSearchParams();
    searchParams.append("q", query);

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(`filters[${key}]`, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `${this.basePath}/search?${queryString}`;

    const response = await apiClient.get<SearchResult<Product>>(endpoint);
    return response.data!;
  }

  // Search suggestions
  async getSearchSuggestions(
    query: string,
    limit: number = 5
  ): Promise<string[]> {
    const response = await apiClient.get<string[]>(
      `${this.basePath}/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    return response.data!;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(
      `${this.basePath}/categories`
    );
    return response.data!;
  }

  async getCategory(slug: string): Promise<Category> {
    const response = await apiClient.get<Category>(
      `${this.basePath}/categories/${slug}`
    );
    return response.data!;
  }

  async getCategoryProducts(
    categorySlug: string,
    params: QueryParams = {}
  ): Promise<ProductListResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(`filters[${key}]`, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}/categories/${categorySlug}/products?${queryString}`
      : `${this.basePath}/categories/${categorySlug}/products`;

    const response = await apiClient.get<ProductListResponse>(endpoint);
    return response.data!;
  }

  // Brands
  async getBrands(): Promise<Brand[]> {
    const response = await apiClient.get<Brand[]>(`${this.basePath}/brands`);
    return response.data!;
  }

  async getBrand(slug: string): Promise<Brand> {
    const response = await apiClient.get<Brand>(
      `${this.basePath}/brands/${slug}`
    );
    return response.data!;
  }

  async getBrandProducts(
    brandSlug: string,
    params: QueryParams = {}
  ): Promise<ProductListResponse> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(`filters[${key}]`, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}/brands/${brandSlug}/products?${queryString}`
      : `${this.basePath}/brands/${brandSlug}/products`;

    const response = await apiClient.get<ProductListResponse>(endpoint);
    return response.data!;
  }

  // Product filters
  async getProductFilters(categorySlug?: string): Promise<{
    priceRange: { min: number; max: number };
    categories: Array<{ id: number; name: string; count: number }>;
    brands: Array<{ id: number; name: string; count: number }>;
    attributes: Array<{
      name: string;
      values: Array<{ value: string; count: number }>;
    }>;
    availability: Array<{ status: string; count: number }>;
  }> {
    const endpoint = categorySlug
      ? `${this.basePath}/products/filters?category=${categorySlug}`
      : `${this.basePath}/products/filters`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  // Product reviews
  async getProductReviews(
    productId: number,
    params: QueryParams = {}
  ): Promise<{
    reviews: Array<{
      id: number;
      rating: number;
      title: string;
      comment: string;
      customer: { name: string; avatar?: string };
      createdAt: string;
      helpful: number;
    }>;
    pagination: any;
    summary: {
      averageRating: number;
      totalReviews: number;
      ratingDistribution: Array<{ rating: number; count: number }>;
    };
  }> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}/products/${productId}/reviews?${queryString}`
      : `${this.basePath}/products/${productId}/reviews`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  async addProductReview(
    productId: number,
    data: {
      rating: number;
      title: string;
      comment: string;
    }
  ): Promise<void> {
    await apiClient.post(
      `${this.basePath}/products/${productId}/reviews`,
      data
    );
  }

  // Product questions
  async getProductQuestions(
    productId: number,
    params: QueryParams = {}
  ): Promise<{
    questions: Array<{
      id: number;
      question: string;
      answer?: string;
      customer: { name: string };
      createdAt: string;
      helpful: number;
    }>;
    pagination: any;
  }> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}/products/${productId}/questions?${queryString}`
      : `${this.basePath}/products/${productId}/questions`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  async addProductQuestion(
    productId: number,
    data: { question: string }
  ): Promise<void> {
    await apiClient.post(
      `${this.basePath}/products/${productId}/questions`,
      data
    );
  }

  // Recently viewed products
  async getRecentlyViewed(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
      `${this.basePath}/products/recently-viewed`
    );
    return response.data!;
  }

  async addToRecentlyViewed(productId: number): Promise<void> {
    await apiClient.post(`${this.basePath}/products/${productId}/view`);
  }

  // Product comparison
  async addToComparison(productId: number): Promise<void> {
    await apiClient.post(`${this.basePath}/products/${productId}/compare`);
  }

  async removeFromComparison(productId: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/products/${productId}/compare`);
  }

  async getComparisonList(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
      `${this.basePath}/products/compare`
    );
    return response.data!;
  }

  // Wishlist
  async addToWishlist(productId: number, variantId?: number): Promise<void> {
    await apiClient.post(`${this.basePath}/wishlist`, {
      productId,
      variantId,
    });
  }

  async removeFromWishlist(productId: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/wishlist/${productId}`);
  }

  async getWishlist(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
      `${this.basePath}/wishlist`
    );
    return response.data!;
  }

  // Product availability
  async checkProductAvailability(
    productId: number,
    variantId?: number,
    quantity: number = 1
  ): Promise<{
    available: boolean;
    quantity: number;
    message?: string;
  }> {
    const searchParams = new URLSearchParams();
    searchParams.append("quantity", quantity.toString());
    if (variantId) searchParams.append("variantId", variantId.toString());

    const queryString = searchParams.toString();
    const endpoint = `${this.basePath}/products/${productId}/availability?${queryString}`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  // Product recommendations
  async getProductRecommendations(
    productId: number,
    type: "similar" | "complementary" | "trending" = "similar",
    limit: number = 5
  ): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
      `${this.basePath}/products/${productId}/recommendations?type=${type}&limit=${limit}`
    );
    return response.data!;
  }

  // Personalized recommendations
  async getPersonalizedRecommendations(limit: number = 10): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
      `${this.basePath}/products/recommendations?limit=${limit}`
    );
    return response.data!;
  }
}

// Export singleton instance
export const storefrontCatalogService = new StorefrontCatalogService();
