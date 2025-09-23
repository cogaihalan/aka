// Import comprehensive product types
import type {
  Product,
  Category,
  Brand,
  ProductVariant,
  Inventory,
  SEO,
  MediaFile,
  ProductQuery,
  ProductSearchResult,
  CreateProductRequest,
  UpdateProductRequest,
  ProductAttribute,
  ProductAttributeValue,
  ProductPricing,
  ShippingInfo as ProductShippingInfo,
  ProductReview,
  ProductRating,
  ProductRelation,
  ProductWishlistItem,
  RecentlyViewedProduct,
} from "@/types/product";

// Base API types
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FilterParams {
  search?: string;
  filters?: Record<string, any>;
}

export interface QueryParams
  extends PaginationParams,
    SortParams,
    FilterParams {
  [key: string]: any;
}

// Re-export product types for backward compatibility
export type {
  Product,
  Category,
  Brand,
  ProductVariant,
  Inventory,
  SEO,
  MediaFile,
  ProductQuery,
  ProductSearchResult,
  CreateProductRequest,
  UpdateProductRequest,
  ProductAttribute,
  ProductAttributeValue,
  ProductPricing,
  ProductReview,
  ProductRating,
  ProductRelation,
  ProductWishlistItem,
  RecentlyViewedProduct,
};

// Legacy type aliases for backward compatibility
export type ProductImage = MediaFile;

// Extended category types for admin management
export interface CategoryTree extends Category {
  children: CategoryTree[];
  productCount: number;
  isExpanded?: boolean;
}

export interface CategoryWithProducts extends Category {
  products: Product[];
  totalProducts: number;
}

// Category request types
export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  image?: string;
  seo?: Partial<SEO>;
  isActive?: boolean;
  sortOrder?: number;
  includeInMenu?: boolean;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: number;
}

// Category-Product relationship types
export interface CategoryProduct {
  categoryId: number;
  productId: number;
  position?: number;
  createdAt: string;
}

export interface CategoryProductAssignment {
  categoryId: number;
  productIds: number[];
  positions?: Record<number, number>;
}

// Brand interface is now imported from @/types/product

// SEO interface is now imported from @/types/product

// Order types
export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  customer: Customer;
  shippingAddress: Address;
  billingAddress: Address;
  items: OrderItem[];
  pricing: OrderPricing;
  shipping: OrderShippingInfo;
  payment: PaymentInfo;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  cancelledAt?: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  total: number;
  discount?: number;
  tax?: number;
}

export interface OrderPricing {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
}

export interface OrderShippingInfo {
  method: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  cost: number;
}

export interface PaymentInfo {
  method: string;
  gateway: string;
  transactionId?: string;
  status: PaymentStatus;
  processedAt?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type FulfillmentStatus =
  | "unfulfilled"
  | "partial"
  | "fulfilled"
  | "cancelled";

// Customer types
export interface Customer {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  addresses: Address[];
  defaultAddressId?: number;
  preferences: CustomerPreferences;
  tags: string[];
  status: "active" | "inactive" | "banned";
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Address {
  id: number;
  type: "shipping" | "billing";
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface CustomerPreferences {
  newsletter: boolean;
  sms: boolean;
  language: string;
  currency: string;
  timezone: string;
}

// Cart types
export interface Cart {
  id: string;
  customerId?: number;
  items: CartItem[];
  pricing: CartPricing;
  shippingAddress?: Address;
  billingAddress?: Address;
  appliedCoupons: AppliedCoupon[];
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  addedAt: string;
}

export interface CartPricing {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
}

export interface AppliedCoupon {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  appliedAt: string;
}

// Wishlist types
export interface Wishlist {
  id: number;
  customerId: number;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: number;
  product: Product;
  variant?: ProductVariant;
  addedAt: string;
}

// Analytics types
export interface AnalyticsOverview {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
  period: {
    start: string;
    end: string;
  };
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface TopProduct {
  product: Product;
  revenue: number;
  quantity: number;
  orders: number;
}

export interface CustomerAnalytics {
  newCustomers: number;
  returningCustomers: number;
  customerLifetimeValue: number;
  churnRate: number;
}

// Search types
export interface SearchResult<T = any> {
  items: T[];
  pagination: PaginationResponse;
  filters: SearchFilter[];
  suggestions: string[];
  total: number;
}

export interface SearchFilter {
  key: string;
  label: string;
  type: "range" | "select" | "multiselect" | "boolean";
  options: FilterOption[];
  selected?: any;
}

export interface FilterOption {
  value: any;
  label: string;
  count: number;
}

// API Response types
export interface ProductListResponse {
  products: Product[];
  pagination: PaginationResponse;
  filters: SearchFilter[];
}

export interface OrderListResponse {
  orders: Order[];
  pagination: PaginationResponse;
}

export interface CustomerListResponse {
  customers: Customer[];
  pagination: PaginationResponse;
}

export interface CategoryListResponse {
  categories: Category[];
  pagination: PaginationResponse;
}

export interface CategoryTreeResponse {
  categories: CategoryTree[];
  totalCategories: number;
}

export interface AnalyticsResponse {
  overview: AnalyticsOverview;
  salesData: SalesData[];
  topProducts: TopProduct[];
  customerAnalytics: CustomerAnalytics;
}

// Error types
export interface ApiErrorResponse {
  error: string;
  message: string;
  details?: any;
  requestId?: string;
  timestamp: string;
}

// Product request types are now imported from @/types/product

export interface CreateOrderRequest {
  customerId?: number;
  items: {
    productId: number;
    variantId?: number;
    quantity: number;
  }[];
  shippingAddress: Omit<Address, "id">;
  billingAddress?: Omit<Address, "id">;
  shippingMethod: string;
  paymentMethod: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateOrderRequest {
  id: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  fulfillmentStatus?: FulfillmentStatus;
  notes?: string;
  tags?: string[];
}

export interface CreateCustomerRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Customer["gender"];
  addresses?: Omit<Address, "id">[];
  preferences?: Partial<CustomerPreferences>;
  tags?: string[];
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  id: number;
}
