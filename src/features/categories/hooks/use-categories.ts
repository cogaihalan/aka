import {
  usePaginatedApi,
  useMutation,
  useSearch,
} from "@/lib/api/hooks/use-api";
import { adminCategoryService } from "@/lib/api";
import type {
  QueryParams,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  Category,
  CategoryTree,
  CategoryWithProducts,
} from "@/lib/api";

// Hook for managing categories list
export function useCategories(params: QueryParams = {}) {
  return usePaginatedApi(
    async (page: number, limit: number) => {
      const response = await adminCategoryService.getCategories({
        ...params,
        page,
        limit,
      });
      return {
        data: response.categories,
        pagination: response.pagination,
      };
    },
    {
      initialPage: params.page || 1,
      initialLimit: params.limit || 20,
    }
  );
}

// Hook for category tree
export function useCategoryTree() {
  return useMutation<CategoryTree[]>({
    mutationFn: async () => {
      const response = await adminCategoryService.getCategoryTree();
      return response.categories;
    },
  });
}

// Hook for single category
export function useCategory(id: number) {
  return useMutation<Category>({
    mutationFn: async () => {
      return await adminCategoryService.getCategory(id);
    },
  });
}

// Hook for category with products
export function useCategoryWithProducts(id: number, params: QueryParams = {}) {
  return usePaginatedApi(
    async (page: number, limit: number) => {
      const response = await adminCategoryService.getCategoryWithProducts(id, {
        ...params,
        page,
        limit,
      });
      return {
        data: response.products,
        pagination: {
          page,
          limit,
          total: response.totalProducts,
          totalPages: Math.ceil(response.totalProducts / limit),
          hasNext: page < Math.ceil(response.totalProducts / limit),
          hasPrev: page > 1,
        },
        category: response,
      };
    },
    {
      initialPage: params.page || 1,
      initialLimit: params.limit || 20,
    }
  );
}

// Hook for category search
export function useCategorySearch() {
  return useSearch({
    searchFn: async (query: string) => {
      return await adminCategoryService.searchCategories(query);
    },
  });
}

// Hook for creating category
export function useCreateCategory() {
  return useMutation<Category, CreateCategoryRequest>({
    mutationFn: async (data: CreateCategoryRequest) => {
      return await adminCategoryService.createCategory(data);
    },
  });
}

// Hook for updating category
export function useUpdateCategory() {
  return useMutation<Category, UpdateCategoryRequest>({
    mutationFn: async (data: UpdateCategoryRequest) => {
      return await adminCategoryService.updateCategory(data);
    },
  });
}

// Hook for deleting category
export function useDeleteCategory() {
  return useMutation<void, number>({
    mutationFn: async (id: number) => {
      return await adminCategoryService.deleteCategory(id);
    },
  });
}

// Hook for category statistics
export function useCategoryStats() {
  return useMutation<{
    totalCategories: number;
    activeCategories: number;
    inactiveCategories: number;
    categoriesWithProducts: number;
    totalProducts: number;
  }>({
    mutationFn: async () => {
      return await adminCategoryService.getCategoryStats();
    },
  });
}

// Hook for assigning products to category
export function useAssignProductsToCategory() {
  return useMutation<
    void,
    {
      categoryId: number;
      productIds: number[];
      positions?: Record<number, number>;
    }
  >({
    mutationFn: async ({ categoryId, productIds, positions }) => {
      return await adminCategoryService.assignProductsToCategory({
        categoryId,
        productIds,
        positions,
      });
    },
  });
}

// Hook for removing products from category
export function useRemoveProductsFromCategory() {
  return useMutation<void, { categoryId: number; productIds: number[] }>({
    mutationFn: async ({ categoryId, productIds }) => {
      return await adminCategoryService.removeProductsFromCategory(
        categoryId,
        productIds
      );
    },
  });
}

// Hook for uncategorized products
export function useUncategorizedProducts(params: QueryParams = {}) {
  return usePaginatedApi(
    async (page: number, limit: number) => {
      const response = await adminCategoryService.getUncategorizedProducts({
        ...params,
        page,
        limit,
      });
      return {
        data: response.products,
        pagination: response.pagination,
      };
    },
    {
      initialPage: params.page || 1,
      initialLimit: params.limit || 20,
    }
  );
}

// Hook for validating category slug
export function useValidateCategorySlug() {
  return useMutation<
    { isValid: boolean; message?: string },
    { slug: string; excludeId?: number }
  >({
    mutationFn: async ({ slug, excludeId }) => {
      return await adminCategoryService.validateSlug(slug, excludeId);
    },
  });
}
