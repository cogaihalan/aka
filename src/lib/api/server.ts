// Server-only API exports
// This file should only be imported in Server Components or API routes

export { ApiClient, ApiError } from "./client";
export type { ApiConfig, ApiResponse, RequestOptions } from "./shared-types";

// Re-export the server API client instance
export { apiClient as serverApiClient } from "./client";
