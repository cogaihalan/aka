// Admin API Services
export { adminProductService } from "./products";
export { adminCategoryService } from "./categories";
export { adminOrderService } from "./orders";
export { adminCustomerService } from "./customers";
export { adminAnalyticsService } from "./analytics";

// Re-export types for convenience
export type {
  Product,
  ProductListResponse,
  CreateProductRequest,
  UpdateProductRequest,
  Category,
  CategoryListResponse,
  CategoryTree,
  CategoryWithProducts,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryProductAssignment,
  Order,
  OrderListResponse,
  CreateOrderRequest,
  UpdateOrderRequest,
  Customer,
  CustomerListResponse,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  AnalyticsResponse,
  AnalyticsOverview,
  SalesData,
  TopProduct,
  CustomerAnalytics,
  QueryParams,
} from "@/lib/api/types";
