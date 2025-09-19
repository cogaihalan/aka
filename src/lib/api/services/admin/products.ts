import { apiClient } from "@/lib/api/client";
import type {
  Product,
  ProductListResponse,
  CreateProductRequest,
  UpdateProductRequest,
  QueryParams,
} from "@/lib/api/types";

export class AdminProductService {
  private basePath = "/admin/products";

  // Get all products with filtering and pagination
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
