// Main API exports
export { apiClient, createApiClient } from "./client-mock";
export { ApiClient, ApiError } from "./client";
export { browserApiClient, createBrowserApiClient } from "./client-browser";
export * from "./types";

// Admin services
export * from "./services/admin";

// Storefront services
export * from "./services/storefront";
export { storefrontCatalogBrowserService } from "./services/storefront/catalog-browser";

// Configuration
export { API_CONFIG, isMockMode, getApiBaseUrl } from "./config";
