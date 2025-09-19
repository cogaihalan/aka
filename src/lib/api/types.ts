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

// Product types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  barcode?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  category: Category;
  brand?: Brand;
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  inventory: Inventory;
  seo: SEO;
  status: "active" | "inactive" | "draft" | "archived";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ProductImage {
  id: number;
  url: string;
  alt: string;
  order: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  weight?: number;
  attributes: Record<string, string>;
  inventory: Inventory;
  images: ProductImage[];
}

export interface Inventory {
  quantity: number;
  reserved: number;
  available: number;
  trackQuantity: boolean;
  allowBackorder: boolean;
  lowStockThreshold?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  level: number;
  path: string;
  image?: string;
  seo: SEO;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  seo: SEO;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SEO {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

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
  shipping: ShippingInfo;
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

export interface ShippingInfo {
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

// Request types
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  categoryId: number;
  brandId?: number;
  tags?: string[];
  images?: Omit<ProductImage, "id">[];
  variants?: Omit<ProductVariant, "id">[];
  inventory: Omit<Inventory, "reserved" | "available">;
  seo?: Partial<SEO>;
  status?: Product["status"];
  featured?: boolean;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number;
}

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
