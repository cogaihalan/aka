import { apiClient } from "@/lib/api/client-mock";
import type {
  Product,
  ProductListResponse,
  CreateProductRequest,
  UpdateProductRequest,
  QueryParams,
  ProductQuery,
  ProductSearchResult,
} from "@/lib/api/types";

export class AdminProductService {
  private basePath = "/admin/products";

  // Get all products with filtering and pagination (legacy)
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
      ? `${this.basePath}?${queryString}`
      : this.basePath;

    const response = await apiClient.get<ProductListResponse>(endpoint);
    return response.data!;
  }

  // Enhanced product search with comprehensive filtering
  async searchProducts(
    params: ProductQuery = {}
  ): Promise<ProductSearchResult> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);
    if (params.categoryIds?.length) {
      params.categoryIds.forEach((id) =>
        searchParams.append("categoryIds[]", id.toString())
      );
    }
    if (params.brandIds?.length) {
      params.brandIds.forEach((id) =>
        searchParams.append("brandIds[]", id.toString())
      );
    }
    if (params.priceRange) {
      searchParams.append("priceMin", params.priceRange.min.toString());
      searchParams.append("priceMax", params.priceRange.max.toString());
    }
    if (params.status?.length) {
      params.status.forEach((status) =>
        searchParams.append("status[]", status)
      );
    }
    if (params.featured !== undefined) {
      searchParams.append("featured", params.featured.toString());
    }
    if (params.inStock !== undefined) {
      searchParams.append("inStock", params.inStock.toString());
    }
    if (params.tags?.length) {
      params.tags.forEach((tag) => searchParams.append("tags[]", tag));
    }
    if (params.createdFrom)
      searchParams.append("createdFrom", params.createdFrom);
    if (params.createdTo) searchParams.append("createdTo", params.createdTo);
    if (params.attributes) {
      Object.entries(params.attributes).forEach(([key, value]) => {
        searchParams.append(`attributes[${key}]`, value.toString());
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}/search?${queryString}`
      : `${this.basePath}/search`;

    const response = await apiClient.get<ProductSearchResult>(endpoint);
    return response.data!;
  }

  // Get a single product by ID
  async getProduct(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(`${this.basePath}/${id}`);
    return response.data!;
  }

  // Create a new product
  async createProduct(data: CreateProductRequest): Promise<Product> {
    const response = await apiClient.post<Product>(this.basePath, data);
    return response.data!;
  }

  // Update an existing product
  async updateProduct(
    id: number,
    data: UpdateProductRequest
  ): Promise<Product> {
    const response = await apiClient.put<Product>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data!;
  }

  // Partially update a product
  async patchProduct(
    id: number,
    data: Partial<UpdateProductRequest>
  ): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.basePath}/${id}`,
      data
    );
    return response.data!;
  }

  // Delete a product
  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  // Enhanced product management methods

  // Get product with full details including variants, reviews, etc.
  async getProductWithDetails(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(
      `${this.basePath}/${id}/details`
    );
    return response.data!;
  }

  // Update product inventory
  async updateProductInventory(
    id: number,
    inventory: Partial<import("@/types/product").Inventory>
  ): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.basePath}/${id}/inventory`,
      inventory
    );
    return response.data!;
  }

  // Update product pricing
  async updateProductPricing(
    id: number,
    pricing: Partial<import("@/types/product").ProductPricing>
  ): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.basePath}/${id}/pricing`,
      pricing
    );
    return response.data!;
  }

  // Update product SEO
  async updateProductSEO(
    id: number,
    seo: Partial<import("@/types/product").SEO>
  ): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.basePath}/${id}/seo`,
      seo
    );
    return response.data!;
  }

  // Manage product variants
  async createProductVariant(
    productId: number,
    variant: Omit<import("@/types/product").ProductVariant, "id">
  ): Promise<import("@/types/product").ProductVariant> {
    const response = await apiClient.post<
      import("@/types/product").ProductVariant
    >(`${this.basePath}/${productId}/variants`, variant);
    return response.data!;
  }

  async updateProductVariant(
    productId: number,
    variantId: number,
    variant: Partial<import("@/types/product").ProductVariant>
  ): Promise<import("@/types/product").ProductVariant> {
    const response = await apiClient.patch<
      import("@/types/product").ProductVariant
    >(`${this.basePath}/${productId}/variants/${variantId}`, variant);
    return response.data!;
  }

  async deleteProductVariant(
    productId: number,
    variantId: number
  ): Promise<void> {
    await apiClient.delete(
      `${this.basePath}/${productId}/variants/${variantId}`
    );
  }

  // Manage product media
  async uploadProductMedia(
    productId: number,
    file: File,
    metadata?: {
      alt?: string;
      title?: string;
      order?: number;
      isPrimary?: boolean;
    }
  ): Promise<import("@/types/product").MediaFile> {
    const formData = new FormData();
    formData.append("file", file);
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.post<import("@/types/product").MediaFile>(
      `${this.basePath}/${productId}/media`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data!;
  }

  async updateProductMedia(
    productId: number,
    mediaId: number,
    metadata: Partial<import("@/types/product").MediaFile>
  ): Promise<import("@/types/product").MediaFile> {
    const response = await apiClient.patch<import("@/types/product").MediaFile>(
      `${this.basePath}/${productId}/media/${mediaId}`,
      metadata
    );
    return response.data!;
  }

  async deleteProductMedia(productId: number, mediaId: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${productId}/media/${mediaId}`);
  }

  // Manage product categories
  async assignProductToCategories(
    productId: number,
    categoryIds: number[],
    primaryCategoryId?: number
  ): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.basePath}/${productId}/categories`,
      {
        categoryIds,
        primaryCategoryId,
      }
    );
    return response.data!;
  }

  // Manage product attributes
  async updateProductAttributes(
    productId: number,
    attributes: import("@/types/product").ProductAttributeValue[]
  ): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.basePath}/${productId}/attributes`,
      { attributes }
    );
    return response.data!;
  }

  // Product analytics and insights
  async getProductAnalytics(id: number): Promise<{
    views: number;
    sales: number;
    revenue: number;
    conversionRate: number;
    averageRating: number;
    totalReviews: number;
    lastUpdated: string;
  }> {
    const response = await apiClient.get(`${this.basePath}/${id}/analytics`);
    return response.data!;
  }

  // Product comparison
  async compareProducts(
    productIds: number[]
  ): Promise<import("@/types/product").ProductComparison> {
    const response = await apiClient.post<
      import("@/types/product").ProductComparison
    >(`${this.basePath}/compare`, { productIds });
    return response.data!;
  }

  // Bulk operations
  async bulkUpdateProducts(
    updates: Array<{ id: number; data: Partial<UpdateProductRequest> }>
  ): Promise<Product[]> {
    const response = await apiClient.patch<Product[]>(`${this.basePath}/bulk`, {
      updates,
    });
    return response.data!;
  }

  async bulkDeleteProducts(ids: number[]): Promise<void> {
    await apiClient.request(`${this.basePath}/bulk`, {
      method: "DELETE",
      body: { ids },
    });
  }

  // Product variants
  async getProductVariants(productId: number): Promise<Product["variants"]> {
    const response = await apiClient.get<Product["variants"]>(
      `${this.basePath}/${productId}/variants`
    );
    return response.data!;
  }

  async createProductVariant(
    productId: number,
    data: Omit<Product["variants"][0], "id">
  ): Promise<Product["variants"][0]> {
    const response = await apiClient.post<Product["variants"][0]>(
      `${this.basePath}/${productId}/variants`,
      data
    );
    return response.data!;
  }

  async updateProductVariant(
    productId: number,
    variantId: number,
    data: Partial<Product["variants"][0]>
  ): Promise<Product["variants"][0]> {
    const response = await apiClient.put<Product["variants"][0]>(
      `${this.basePath}/${productId}/variants/${variantId}`,
      data
    );
    return response.data!;
  }

  async deleteProductVariant(
    productId: number,
    variantId: number
  ): Promise<void> {
    await apiClient.delete(
      `${this.basePath}/${productId}/variants/${variantId}`
    );
  }

  // Product images
  async getProductImages(productId: number): Promise<Product["images"]> {
    const response = await apiClient.get<Product["images"]>(
      `${this.basePath}/${productId}/images`
    );
    return response.data!;
  }

  async uploadProductImage(
    productId: number,
    file: File,
    alt?: string
  ): Promise<Product["images"][0]> {
    const formData = new FormData();
    formData.append("file", file);
    if (alt) formData.append("alt", alt);

    const response = await apiClient.post<Product["images"][0]>(
      `${this.basePath}/${productId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data!;
  }

  async updateProductImage(
    productId: number,
    imageId: number,
    data: Partial<Product["images"][0]>
  ): Promise<Product["images"][0]> {
    const response = await apiClient.put<Product["images"][0]>(
      `${this.basePath}/${productId}/images/${imageId}`,
      data
    );
    return response.data!;
  }

  async deleteProductImage(productId: number, imageId: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${productId}/images/${imageId}`);
  }

  async reorderProductImages(
    productId: number,
    imageIds: number[]
  ): Promise<void> {
    await apiClient.patch(`${this.basePath}/${productId}/images/reorder`, {
      imageIds,
    });
  }

  // Inventory management
  async updateInventory(
    productId: number,
    inventory: Partial<Product["inventory"]>
  ): Promise<Product["inventory"]> {
    const response = await apiClient.patch<Product["inventory"]>(
      `${this.basePath}/${productId}/inventory`,
      inventory
    );
    return response.data!;
  }

  async adjustInventory(
    productId: number,
    adjustment: { quantity: number; reason: string }
  ): Promise<Product["inventory"]> {
    const response = await apiClient.post<Product["inventory"]>(
      `${this.basePath}/${productId}/inventory/adjust`,
      adjustment
    );
    return response.data!;
  }

  // Product status management
  async publishProduct(id: number): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.basePath}/${id}/publish`
    );
    return response.data!;
  }

  async unpublishProduct(id: number): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.basePath}/${id}/unpublish`
    );
    return response.data!;
  }

  async archiveProduct(id: number): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.basePath}/${id}/archive`
    );
    return response.data!;
  }

  async restoreProduct(id: number): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.basePath}/${id}/restore`
    );
    return response.data!;
  }

  // Product analytics
  async getProductAnalytics(productId: number, period?: string): Promise<any> {
    const endpoint = period
      ? `${this.basePath}/${productId}/analytics?period=${period}`
      : `${this.basePath}/${productId}/analytics`;

    const response = await apiClient.get(endpoint);
    return response.data!;
  }

  // Export/Import
  async exportProducts(
    format: "csv" | "xlsx" = "csv",
    filters?: QueryParams
  ): Promise<Blob> {
    const searchParams = new URLSearchParams();
    searchParams.append("format", format);

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}/export?${queryString}`
      : `${this.basePath}/export`;

    const response = await fetch(apiClient["buildUrl"](endpoint), {
      headers: await apiClient["getAuthHeaders"](),
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  }

  async importProducts(
    file: File
  ): Promise<{ success: number; errors: any[] }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<{ success: number; errors: any[] }>(
      `${this.basePath}/import`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data!;
  }
}

// Export singleton instance
export const adminProductService = new AdminProductService();
