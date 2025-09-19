// Admin API Services
export { adminProductService } from "./products";
export { adminOrderService } from "./orders";
export { adminCustomerService } from "./customers";
export { adminAnalyticsService } from "./analytics";

// Re-export types for convenience
export type {
  Product,
  ProductListResponse,
  CreateProductRequest,
  UpdateProductRequest,
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
