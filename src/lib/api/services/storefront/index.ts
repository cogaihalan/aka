// Storefront API Services
export { storefrontCatalogService } from "./catalog";
export { storefrontCartService } from "./cart";
export { storefrontCheckoutService } from "./checkout";

// Re-export types for convenience
export type {
  Product,
  ProductListResponse,
  Category,
  Brand,
  SearchResult,
  Cart,
  CartItem,
  CartPricing,
  Order,
  Address,
  PaymentInfo,
  ShippingInfo,
  QueryParams,
} from "@/lib/api/types";
