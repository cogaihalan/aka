import { auth } from "@clerk/nextjs/server";

// API Configuration
export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// Default configuration
const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api",
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
};

// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
  requestId?: string;
}

// API Error class
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public requestId?: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Request options
export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
}

// API Client class
export class ApiClient {
  private config: ApiConfig;
  private defaultHeaders: Record<string, string>;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  // Get authentication headers
  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const { getToken } = await auth();
      const token = await getToken();

      if (token) {
        return {
          Authorization: `Bearer ${token}`,
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

  // Retry mechanism
  private async withRetry<T>(
    operation: () => Promise<T>,
    retries: number = this.config.retries!
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx) except 429 (rate limit)
        if (
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500 &&
          error.status !== 429
        ) {
          throw error;
        }

        // Don't retry on last attempt
        if (attempt === retries) {
          throw error;
        }

        // Wait before retry
        const delay = this.config.retryDelay! * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
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
      retries = this.config.retries,
      cache = "default",
      next,
    } = options;

    const url = this.buildUrl(endpoint);
    const authHeaders = await this.getAuthHeaders();

    const requestHeaders = {
      ...this.defaultHeaders,
      ...authHeaders,
      ...headers,
    };

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      cache,
      next,
    };

    if (body && method !== "GET") {
      requestOptions.body = JSON.stringify(body);
    }

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await this.withRetry(async () => {
        const res = await fetch(url, {
          ...requestOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
          let errorDetails: any;

          try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
            errorDetails = errorData;
          } catch {
            // If response is not JSON, use status text
          }

          throw new ApiError(
            res.status,
            errorMessage,
            res.headers.get("x-request-id") || undefined,
            errorDetails
          );
        }

        return res;
      }, retries);

      const data = await response.json();

      return {
        success: true,
        data: data.data || data,
        message: data.message,
        timestamp: new Date().toISOString(),
        requestId: response.headers.get("x-request-id") || undefined,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new ApiError(408, "Request timeout");
        }
        throw new ApiError(0, error.message);
      }

      throw new ApiError(0, "Unknown error occurred");
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

// Create default API client instance
export const apiClient = new ApiClient();
