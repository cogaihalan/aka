import { getApiBaseUrl } from "@/lib/api/config";
import type { ApiConfig, ApiResponse, RequestOptions } from "@/lib/api/shared-types";

// Real API Client for production use
export class ApiClient {
  private config: ApiConfig;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = {
      baseUrl: getApiBaseUrl(),
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      ...config,
    };
  }

  // Get authentication headers
  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      if (typeof window !== "undefined") {
        // Client-side: try to get token from localStorage or cookies
        const token =
          localStorage.getItem("auth-token") ||
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth-token="))
            ?.split("=")[1];

        if (token) {
          return {
            Authorization: `Bearer ${token}`,
          };
        }
      } else {
        // Server-side: get token from headers or session
        return {
          "X-API-Key": process.env.API_KEY || "",
        };
      }
    } catch (error) {
      console.warn("Failed to get auth token:", error);
    }

    return {};
  }

  // Build full URL
  private buildUrl(endpoint: string): string {
    const baseUrl = this.config.baseUrl.endsWith("/")
      ? this.config.baseUrl.slice(0, -1)
      : this.config.baseUrl;

    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    return `${baseUrl}${cleanEndpoint}`;
  }

  // Make HTTP request
  async request<T = any>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = "GET",
      headers = {},
      body,
      timeout = this.config.timeout,
    } = options;

    const url = this.buildUrl(endpoint);
    const authHeaders = await this.getAuthHeaders();

    const requestHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeaders,
      ...headers,
    };

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== "GET") {
      requestOptions.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      return {
        success: true,
        data: data.data || data,
        message: data.message,
        timestamp: new Date().toISOString(),
        requestId: response.headers.get("x-request-id") || undefined,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Unknown error occurred");
    }
  }

  // Convenience methods
  async get<T = any>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">
  ) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method">
  ) {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  async put<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method">
  ) {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  async patch<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestOptions, "method">
  ) {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }

  async delete<T = any>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">
  ) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

// Create the API client
export const createApiClient = () => {
  return new ApiClient();
};

// Export the default client
export const apiClient = new ApiClient();
