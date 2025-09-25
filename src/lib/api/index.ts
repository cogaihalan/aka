// Main API exports - CLIENT SAFE (no server-only imports)
export { apiClient, createApiClient } from "./client-mock";
export * from "./types";

// Unified services (recommended for most use cases)
export { 
  unifiedProductService, 
  unifiedCategoryService,
  unifiedAnalyticsService,
  unifiedOrderService,
  unifiedUserService
} from "./services/unified";

// Admin services (aliases to unified services for backward compatibility)
export { 
  unifiedProductService as adminProductService,
  unifiedCategoryService as adminCategoryService,
  unifiedOrderService as adminOrderService,
  unifiedAnalyticsService as adminAnalyticsService,
  unifiedUserService as adminUserService
} from "./services/unified";

// Storefront services
export * from "./services/storefront";

// Configuration
export { API_CONFIG, getApiBaseUrl } from "./config";
