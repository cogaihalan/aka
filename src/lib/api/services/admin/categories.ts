import { apiClient } from "@/lib/api/client";
import type {
  Category,
  CategoryListResponse,
  CategoryTreeResponse,
  CategoryWithProducts,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  QueryParams,
  CategoryProductAssignment,
  Product,
} from "@/lib/api/types";

export class AdminCategoryService {
  private basePath = "/admin/categories";

  // Get all categories with filtering and pagination
  async getCategories(params: QueryParams = {}): Promise<CategoryListResponse> {
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

    const response = await apiClient.get<CategoryListResponse>(endpoint);
    return response.data!;
  }

  // Get category tree (hierarchical structure)
  async getCategoryTree(): Promise<CategoryTreeResponse> {
    const response = await apiClient.get<CategoryTreeResponse>(
      `${this.basePath}/tree`
    );
    return response.data!;
  }

  // Get a single category by ID
  async getCategory(id: number): Promise<Category> {
    const response = await apiClient.get<Category>(`${this.basePath}/${id}`);
    return response.data!;
  }

  // Get category with products
  async getCategoryWithProducts(
    id: number,
    params: QueryParams = {}
  ): Promise<CategoryWithProducts> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}/${id}/products?${queryString}`
      : `${this.basePath}/${id}/products`;

    const response = await apiClient.get<CategoryWithProducts>(endpoint);
    return response.data!;
  }

  // Create a new category
  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const response = await apiClient.post<Category>(this.basePath, data);
    return response.data!;
  }

  // Update an existing category
  async updateCategory(data: UpdateCategoryRequest): Promise<Category> {
    const { id, ...updateData } = data;
    const response = await apiClient.put<Category>(
      `${this.basePath}/${id}`,
      updateData
    );
    return response.data!;
  }

  // Delete a category
  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }

  // Bulk delete categories
  async bulkDeleteCategories(ids: number[]): Promise<void> {
    await apiClient.request(`${this.basePath}/bulk`, {
      method: "DELETE",
      body: { ids },
    });
  }

  // Update category status (active/inactive)
  async updateCategoryStatus(id: number, isActive: boolean): Promise<Category> {
    const response = await apiClient.patch<Category>(
      `${this.basePath}/${id}/status`,
      {
        isActive,
      }
    );
    return response.data!;
  }

  // Reorder categories
  async reorderCategories(
    categoryOrders: { id: number; sortOrder: number }[]
  ): Promise<void> {
    await apiClient.patch(`${this.basePath}/reorder`, { categoryOrders });
  }

  // Category-Product relationship management
  async assignProductsToCategory(
    assignment: CategoryProductAssignment
  ): Promise<void> {
    await apiClient.post(`${this.basePath}/${assignment.categoryId}/products`, {
      productIds: assignment.productIds,
      positions: assignment.positions,
    });
  }

  async removeProductsFromCategory(
    categoryId: number,
    productIds: number[]
  ): Promise<void> {
    await apiClient.request(`${this.basePath}/${categoryId}/products`, {
      method: "DELETE",
      body: { productIds },
    });
  }

  // Get products not in any category
  async getUncategorizedProducts(params: QueryParams = {}): Promise<{
    products: Product[];
    pagination: any;
  }> {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);

    const queryString = searchParams.toString();
    const endpoint = queryString
      ? `${this.basePath}/uncategorized-products?${queryString}`
      : `${this.basePath}/uncategorized-products`;

    const response = await apiClient.get<{
      products: Product[];
      pagination: any;
    }>(endpoint);
    return response.data!;
  }

  // Get category statistics
  async getCategoryStats(): Promise<{
    totalCategories: number;
    activeCategories: number;
    inactiveCategories: number;
    categoriesWithProducts: number;
    totalProducts: number;
  }> {
    const response = await apiClient.get<{
      totalCategories: number;
      activeCategories: number;
      inactiveCategories: number;
      categoriesWithProducts: number;
      totalProducts: number;
    }>(`${this.basePath}/stats`);
    return response.data!;
  }

  // Search categories
  async searchCategories(
    query: string,
    limit: number = 10
  ): Promise<Category[]> {
    const response = await apiClient.get<Category[]>(
      `${this.basePath}/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    return response.data!;
  }

  // Validate category slug uniqueness
  async validateSlug(
    slug: string,
    excludeId?: number
  ): Promise<{ isValid: boolean; message?: string }> {
    const response = await apiClient.get<{
      isValid: boolean;
      message?: string;
    }>(
      `${this.basePath}/validate-slug?slug=${encodeURIComponent(slug)}${excludeId ? `&excludeId=${excludeId}` : ""}`
    );
    return response.data!;
  }
}

// Export singleton instance
export const adminCategoryService = new AdminCategoryService();
