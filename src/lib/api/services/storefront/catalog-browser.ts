import { browserApiClient } from "@/lib/api/client-browser";
import type {
  Product,
  ProductListResponse,
  Category,
  Brand,
  SearchResult,
  QueryParams,
} from "@/lib/api/types";

export class StorefrontCatalogBrowserService {
  private basePath = "/storefront";

  // Product catalog
  async getProducts(
    params: QueryParams = {},
    getToken?: () => Promise<string | null>
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
      ? `${this.basePath}/products?${queryString}`
      : `${this.basePath}/products`;

    const response = await browserApiClient.get<ProductListResponse>(endpoint, {
      getToken,
    });
    return response.data!;
  }

  // Get a single product by ID
  async getProduct(
    id: number,
    getToken?: () => Promise<string | null>
  ): Promise<Product> {
    const response = await browserApiClient.get<Product>(
      `${this.basePath}/products/${id}`,
      { getToken }
    );
    return response.data!;
  }

  // Get product by slug
  async getProductBySlug(
    slug: string,
    getToken?: () => Promise<string | null>
  ): Promise<Product> {
    const response = await browserApiClient.get<Product>(
      `${this.basePath}/products/slug/${slug}`,
      { getToken }
    );
    return response.data!;
  }

  // Featured products
  async getFeaturedProducts(
    limit: number = 10,
    getToken?: () => Promise<string | null>
  ): Promise<Product[]> {
    const response = await browserApiClient.get<Product[]>(
      `${this.basePath}/products/featured?limit=${limit}`,
      { getToken }
    );
    return response.data!;
  }

  // New arrivals
  async getNewArrivals(
    limit: number = 10,
    getToken?: () => Promise<string | null>
  ): Promise<Product[]> {
    const response = await browserApiClient.get<Product[]>(
      `${this.basePath}/products/new?limit=${limit}`,
      { getToken }
    );
    return response.data!;
  }

  // Best sellers
  async getBestSellers(
    limit: number = 10,
    getToken?: () => Promise<string | null>
  ): Promise<Product[]> {
    const response = await browserApiClient.get<Product[]>(
      `${this.basePath}/products/bestsellers?limit=${limit}`,
      { getToken }
    );
    return response.data!;
  }

  // On sale products
  async getOnSaleProducts(
    limit: number = 10,
    getToken?: () => Promise<string | null>
  ): Promise<Product[]> {
    const response = await browserApiClient.get<Product[]>(
      `${this.basePath}/products/sale?limit=${limit}`,
      { getToken }
    );
    return response.data!;
  }

  // Related products
  async getRelatedProducts(
    productId: number,
    limit: number = 5,
    getToken?: () => Promise<string | null>
  ): Promise<Product[]> {
    const response = await browserApiClient.get<Product[]>(
      `${this.basePath}/products/${productId}/related?limit=${limit}`,
      { getToken }
    );
    return response.data!;
  }

  // Frequently bought together
  async getFrequentlyBoughtTogether(
    productId: number,
    limit: number = 5,
    getToken?: () => Promise<string | null>
  ): Promise<Product[]> {
    const response = await browserApiClient.get<Product[]>(
      `${this.basePath}/products/${productId}/frequently-bought?limit=${limit}`,
      { getToken }
    );
    return response.data!;
  }

  // Product search
  async searchProducts(
    query: string,
    params: QueryParams = {},
    getToken?: () => Promise<string | null>
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

    const response = await browserApiClient.get<SearchResult<Product>>(
      endpoint,
      { getToken }
    );
    return response.data!;
  }

  // Search suggestions
  async getSearchSuggestions(
    query: string,
    limit: number = 5,
    getToken?: () => Promise<string | null>
  ): Promise<string[]> {
    const response = await browserApiClient.get<string[]>(
      `${this.basePath}/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`,
      { getToken }
    );
    return response.data!;
  }

  // Categories
  async getCategories(
    getToken?: () => Promise<string | null>
  ): Promise<Category[]> {
    const response = await browserApiClient.get<Category[]>(
      `${this.basePath}/categories`,
      { getToken }
    );
    return response.data!;
  }

  async getCategory(
    slug: string,
    getToken?: () => Promise<string | null>
  ): Promise<Category> {
    const response = await browserApiClient.get<Category>(
      `${this.basePath}/categories/${slug}`,
      { getToken }
    );
    return response.data!;
  }

  async getCategoryProducts(
    categorySlug: string,
    params: QueryParams = {},
    getToken?: () => Promise<string | null>
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

    const response = await browserApiClient.get<ProductListResponse>(endpoint, {
      getToken,
    });
    return response.data!;
  }

  // Brands
  async getBrands(getToken?: () => Promise<string | null>): Promise<Brand[]> {
    const response = await browserApiClient.get<Brand[]>(
      `${this.basePath}/brands`,
      { getToken }
    );
    return response.data!;
  }

  async getBrand(
    slug: string,
    getToken?: () => Promise<string | null>
  ): Promise<Brand> {
    const response = await browserApiClient.get<Brand>(
      `${this.basePath}/brands/${slug}`,
      { getToken }
    );
    return response.data!;
  }

  async getBrandProducts(
    brandSlug: string,
    params: QueryParams = {},
    getToken?: () => Promise<string | null>
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

    const response = await browserApiClient.get<ProductListResponse>(endpoint, {
      getToken,
    });
    return response.data!;
  }

  // Product filters
  async getProductFilters(
    categorySlug?: string,
    getToken?: () => Promise<string | null>
  ): Promise<{
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

    const response = await browserApiClient.get(endpoint, { getToken });
    return response.data!;
  }

  // Product reviews
  async getProductReviews(
    productId: number,
    params: QueryParams = {},
    getToken?: () => Promise<string | null>
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

    const response = await browserApiClient.get(endpoint, { getToken });
    return response.data!;
  }

  async addProductReview(
    productId: number,
    data: {
      rating: number;
      title: string;
      comment: string;
    },
    getToken?: () => Promise<string | null>
  ): Promise<void> {
    await browserApiClient.post(
      `${this.basePath}/products/${productId}/reviews`,
      data,
      { getToken }
    );
  }

  // Product questions
  async getProductQuestions(
    productId: number,
    params: QueryParams = {},
    getToken?: () => Promise<string | null>
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

    const response = await browserApiClient.get(endpoint, { getToken });
    return response.data!;
  }

  async addProductQuestion(
    productId: number,
    data: { question: string },
    getToken?: () => Promise<string | null>
  ): Promise<void> {
    await browserApiClient.post(
      `${this.basePath}/products/${productId}/questions`,
      data,
      { getToken }
    );
  }

  // Recently viewed products
  async getRecentlyViewed(
    getToken?: () => Promise<string | null>
  ): Promise<Product[]> {
    const response = await browserApiClient.get<Product[]>(
      `${this.basePath}/products/recently-viewed`,
      { getToken }
    );
    return response.data!;
  }

  async addToRecentlyViewed(
    productId: number,
    getToken?: () => Promise<string | null>
  ): Promise<void> {
    await browserApiClient.post(
      `${this.basePath}/products/${productId}/view`,
      undefined,
      { getToken }
    );
  }

  // Product comparison
  async addToComparison(
    productId: number,
    getToken?: () => Promise<string | null>
  ): Promise<void> {
    await browserApiClient.post(
      `${this.basePath}/products/${productId}/compare`,
      undefined,
      { getToken }
    );
  }

  async removeFromComparison(
    productId: number,
    getToken?: () => Promise<string | null>
  ): Promise<void> {
    await browserApiClient.delete(
      `${this.basePath}/products/${productId}/compare`,
      { getToken }
    );
  }

  async getComparisonList(
    getToken?: () => Promise<string | null>
  ): Promise<Product[]> {
    const response = await browserApiClient.get<Product[]>(
      `${this.basePath}/products/compare`,
      { getToken }
    );
    return response.data!;
  }

  // Wishlist
  async addToWishlist(
    productId: number,
    variantId?: number,
    getToken?: () => Promise<string | null>
  ): Promise<void> {
    await browserApiClient.post(
      `${this.basePath}/wishlist`,
      {
        productId,
        variantId,
      },
      { getToken }
    );
  }

  async removeFromWishlist(
    productId: number,
    getToken?: () => Promise<string | null>
  ): Promise<void> {
    await browserApiClient.delete(`${this.basePath}/wishlist/${productId}`, {
      getToken,
    });
  }

  async getWishlist(
    getToken?: () => Promise<string | null>
  ): Promise<Product[]> {
    const response = await browserApiClient.get<Product[]>(
      `${this.basePath}/wishlist`,
      { getToken }
    );
    return response.data!;
  }

  // Product availability
  async checkProductAvailability(
    productId: number,
    variantId?: number,
    quantity: number = 1,
    getToken?: () => Promise<string | null>
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

    const response = await browserApiClient.get(endpoint, { getToken });
    return response.data!;
  }

  // Product recommendations
  async getProductRecommendations(
    productId: number,
    type: "similar" | "complementary" | "trending" = "similar",
    limit: number = 5,
    getToken?: () => Promise<string | null>
  ): Promise<Product[]> {
    const response = await browserApiClient.get<Product[]>(
      `${this.basePath}/products/${productId}/recommendations?type=${type}&limit=${limit}`,
      { getToken }
    );
    return response.data!;
  }

  // Personalized recommendations
  async getPersonalizedRecommendations(
    limit: number = 10,
    getToken?: () => Promise<string | null>
  ): Promise<Product[]> {
    const response = await browserApiClient.get<Product[]>(
      `${this.basePath}/products/recommendations?limit=${limit}`,
      { getToken }
    );
    return response.data!;
  }
}

// Export singleton instance
export const storefrontCatalogBrowserService =
  new StorefrontCatalogBrowserService();
