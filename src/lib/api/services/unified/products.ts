import { apiClient } from "@/lib/api/client-mock";
import type {
  Product,
  ProductListResponse,
  CreateProductRequest,
  UpdateProductRequest,
  QueryParams,
  ProductQuery,
  ProductSearchResult,
  ProductVariant,
  MediaFile,
  Inventory,
  ProductPricing,
  SEO,
  ProductAttributeValue,
} from "@/lib/api/types";
import type { ProductComparison } from "@/types/product";

class UnifiedProductService {
  private basePath = "/api/products";

  // Legacy methods for backward compatibility
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

    // const response = await apiClient.get<ProductListResponse>(endpoint);
    // return response.data!;
    return {
      products: [],
      pagination: {
        total: 0,
        page: 0,
        limit: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
      filters: [],
    };
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

  // Basic CRUD operations
  async getProduct(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(`${this.basePath}/${id}`);
    return response.data!;
  }

  async createProduct(data: CreateProductRequest): Promise<Product> {
    const response = await apiClient.post<Product>(this.basePath, data);
    return response.data!;
  }

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
    inventory: Partial<Inventory>
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
    pricing: Partial<ProductPricing>
  ): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.basePath}/${id}/pricing`,
      pricing
    );
    return response.data!;
  }

  // Update product SEO
  async updateProductSEO(id: number, seo: Partial<SEO>): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.basePath}/${id}/seo`,
      seo
    );
    return response.data!;
  }

  // Manage product variants
  async getProductVariants(productId: number): Promise<ProductVariant[]> {
    const response = await apiClient.get<ProductVariant[]>(
      `${this.basePath}/${productId}/variants`
    );
    return response.data!;
  }

  async createProductVariant(
    productId: number,
    variant: Omit<ProductVariant, "id">
  ): Promise<ProductVariant> {
    const response = await apiClient.post<ProductVariant>(
      `${this.basePath}/${productId}/variants`,
      variant
    );
    return response.data!;
  }

  async updateProductVariant(
    productId: number,
    variantId: number,
    variant: Partial<ProductVariant>
  ): Promise<ProductVariant> {
    const response = await apiClient.patch<ProductVariant>(
      `${this.basePath}/${productId}/variants/${variantId}`,
      variant
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

  // Manage product media
  async getProductMedia(productId: number): Promise<MediaFile[]> {
    const response = await apiClient.get<MediaFile[]>(
      `${this.basePath}/${productId}/media`
    );
    return response.data!;
  }

  async uploadProductMedia(
    productId: number,
    file: File,
    metadata?: {
      alt?: string;
      title?: string;
      order?: number;
      isPrimary?: boolean;
    }
  ): Promise<MediaFile> {
    const formData = new FormData();
    formData.append("file", file);
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.post<MediaFile>(
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
    metadata: Partial<MediaFile>
  ): Promise<MediaFile> {
    const response = await apiClient.patch<MediaFile>(
      `${this.basePath}/${productId}/media/${mediaId}`,
      metadata
    );
    return response.data!;
  }

  async deleteProductMedia(productId: number, mediaId: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${productId}/media/${mediaId}`);
  }

  async reorderProductMedia(
    productId: number,
    mediaIds: number[]
  ): Promise<MediaFile[]> {
    const response = await apiClient.patch<MediaFile[]>(
      `${this.basePath}/${productId}/media/reorder`,
      { mediaIds }
    );
    return response.data!;
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
    attributes: ProductAttributeValue[]
  ): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.basePath}/${productId}/attributes`,
      { attributes }
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
  async compareProducts(productIds: number[]): Promise<ProductComparison> {
    const response = await apiClient.post<ProductComparison>(
      `${this.basePath}/compare`,
      { productIds }
    );
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

  // Import/Export
  async exportProducts(
    filters?: {
      categoryIds?: number[];
      brandIds?: number[];
      status?: string[];
      dateFrom?: string;
      dateTo?: string;
    },
    format: "csv" | "xlsx" | "json" = "csv"
  ): Promise<Blob> {
    const searchParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((v) => searchParams.append(`${key}[]`, v.toString()));
          } else {
            searchParams.append(key, value.toString());
          }
        }
      });
    }
    searchParams.append("format", format);

    const response = await apiClient.get(
      `${this.basePath}/export?${searchParams.toString()}`
    );
    return response.data!;
  }

  async importProducts(
    file: File,
    options?: {
      updateExisting?: boolean;
      skipErrors?: boolean;
      validateOnly?: boolean;
    }
  ): Promise<{
    success: boolean;
    imported: number;
    updated: number;
    errors: string[];
    warnings: string[];
  }> {
    const formData = new FormData();
    formData.append("file", file);
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.post(`${this.basePath}/import`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data!;
  }
}

export const unifiedProductService = new UnifiedProductService();
