import { apiClient } from "@/lib/api/client-mock";
import type { QueryParams, ProductQuery } from "@/lib/api/types";

export interface BaseServiceConfig {
  basePath: string;
  useAdminHeaders?: boolean;
}

export abstract class BaseService {
  protected basePath: string;
  protected useAdminHeaders: boolean;

  constructor(config: BaseServiceConfig) {
    this.basePath = config.basePath;
    this.useAdminHeaders = config.useAdminHeaders || false;
  }

  /**
   * Build query parameters from QueryParams object
   */
  protected buildQueryParams(params: QueryParams = {}): URLSearchParams {
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

    return searchParams;
  }

  /**
   * Build query parameters from ProductQuery object
   */
  protected buildProductQueryParams(params: ProductQuery = {}): URLSearchParams {
    const searchParams = new URLSearchParams();

    // Basic pagination and search
    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params.sortOrder) searchParams.append("sortOrder", params.sortOrder);

    // Product-specific filters
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
    if (params.createdFrom) searchParams.append("createdFrom", params.createdFrom);
    if (params.createdTo) searchParams.append("createdTo", params.createdTo);
    if (params.attributes) {
      Object.entries(params.attributes).forEach(([key, value]) => {
        searchParams.append(`attributes[${key}]`, value.toString());
      });
    }

    return searchParams;
  }

  /**
   * Build endpoint URL with query parameters
   */
  protected buildEndpoint(path: string, queryParams?: URLSearchParams): string {
    const endpoint = `${this.basePath}${path}`;
    return queryParams && queryParams.toString()
      ? `${endpoint}?${queryParams.toString()}`
      : endpoint;
  }

  /**
   * Get headers based on admin flag
   */
  protected getHeaders(isAdmin?: boolean): Record<string, string> {
    const useAdmin = isAdmin !== undefined ? isAdmin : this.useAdminHeaders;
    return useAdmin ? { "x-admin-request": "true" } : {};
  }

  /**
   * Make GET request with common error handling
   */
  protected async get<T>(
    endpoint: string,
    isAdmin?: boolean
  ): Promise<T> {
    const headers = this.getHeaders(isAdmin);
    const response = await apiClient.get<T>(endpoint, { headers });
    return response.data!;
  }

  /**
   * Make POST request with common error handling
   */
  protected async post<T>(
    endpoint: string,
    data: any,
    isAdmin?: boolean
  ): Promise<T> {
    const headers = this.getHeaders(isAdmin);
    const response = await apiClient.post<T>(endpoint, data, { headers });
    return response.data!;
  }

  /**
   * Make PUT request with common error handling
   */
  protected async put<T>(
    endpoint: string,
    data: any,
    isAdmin?: boolean
  ): Promise<T> {
    const headers = this.getHeaders(isAdmin);
    const response = await apiClient.put<T>(endpoint, data, { headers });
    return response.data!;
  }

  /**
   * Make PATCH request with common error handling
   */
  protected async patch<T>(
    endpoint: string,
    data: any,
    isAdmin?: boolean
  ): Promise<T> {
    const headers = this.getHeaders(isAdmin);
    const response = await apiClient.patch<T>(endpoint, data, { headers });
    return response.data!;
  }

  /**
   * Make DELETE request with common error handling
   */
  protected async delete(
    endpoint: string,
    isAdmin?: boolean
  ): Promise<void> {
    const headers = this.getHeaders(isAdmin);
    await apiClient.delete(endpoint, { headers });
  }
}
