// Comprehensive Product Data Structure inspired by Magento's EAV model
// This structure supports enterprise-level e-commerce requirements

// Base entity types
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// SEO and Meta information
export interface SEO {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  robots?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
}

// Media and Image management
export interface MediaFile {
  id: number;
  url: string;
  alt: string;
  title?: string;
  caption?: string;
  order: number;
  isPrimary: boolean;
  type: "image" | "video" | "document" | "audio";
  mimeType: string;
  fileSize: number;
  dimensions?: {
    width: number;
    height: number;
  };
  variants?: MediaVariant[];
  metadata?: Record<string, any>;
}

export interface MediaVariant {
  id: number;
  url: string;
  type:
    | "thumbnail"
    | "small"
    | "medium"
    | "large"
    | "original"
    | "webp"
    | "avif";
  width: number;
  height: number;
  fileSize: number;
}

// Category structure with hierarchical support
export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  level: number;
  path: string;
  parentId?: number;
  children?: Category[];
  seo: SEO;
  includeInMenu: boolean;
  isAnchor: boolean;
  displayMode:
    | "products_only"
    | "static_block_only"
    | "products_and_static_block";
  customLayoutUpdate?: string;
  customApplyToProducts?: boolean;
  customDesign?: {
    customLayoutUpdate?: string;
    customLayoutUpdateFile?: string;
    pageLayout?: string;
    customTheme?: string;
    customThemeFrom?: string;
    customThemeTo?: string;
  };
  image?: MediaFile;
  thumbnail?: MediaFile;
  metaImage?: MediaFile;
  attributes?: Record<string, any>;
}

// Brand/Manufacturer information
export interface Brand extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  logo?: MediaFile;
  website?: string;
  country?: string;
  foundedYear?: number;
  seo: SEO;
  attributes?: Record<string, any>;
}

// Inventory management
export interface Inventory {
  quantity: number;
  reserved: number;
  available: number;
  trackQuantity: boolean;
  allowBackorder: boolean;
  allowPreorder: boolean;
  minQuantity: number;
  maxQuantity?: number;
  lowStockThreshold: number;
  stockStatus: "in_stock" | "out_of_stock" | "backorder" | "preorder";
  warehouses?: WarehouseStock[];
  lastUpdated: string;
}

export interface WarehouseStock {
  warehouseId: number;
  warehouseName: string;
  quantity: number;
  reserved: number;
  available: number;
}

// Product attributes system (EAV-like)
export interface ProductAttribute {
  id: number;
  code: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "select"
    | "multiselect"
    | "boolean"
    | "date"
    | "datetime"
    | "price"
    | "weight"
    | "media_image"
    | "gallery"
    | "fixed_product_tax";
  isRequired: boolean;
  isUserDefined: boolean;
  isGlobal: boolean;
  isVisible: boolean;
  isSearchable: boolean;
  isFilterable: boolean;
  isComparable: boolean;
  isVisibleOnFront: boolean;
  isHtmlAllowedOnFront: boolean;
  isUsedForPriceRules: boolean;
  isFilterableInSearch: boolean;
  usedInProductListing: boolean;
  usedForSortBy: boolean;
  applyTo: string[];
  position: number;
  isWysiwygEnabled: boolean;
  isUsedForPromoRules: boolean;
  options?: ProductAttributeOption[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    pattern?: string;
  };
}

export interface ProductAttributeOption {
  id: number;
  label: string;
  value: string;
  position: number;
  isDefault: boolean;
}

export interface ProductAttributeValue {
  attributeId: number;
  attributeCode: string;
  value: any;
  storeId?: number;
}

// Product variants and configurations
export interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: "cm" | "in" | "mm";
  };
  attributes: Record<string, any>;
  inventory: Inventory;
  images: MediaFile[];
  isDefault: boolean;
  position: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

// Product relationships
export interface ProductRelation {
  id: number;
  type: "related" | "cross_sell" | "up_sell" | "grouped" | "bundle";
  relatedProductId: number;
  position: number;
  isActive: boolean;
}

// Product reviews and ratings
export interface ProductReview {
  id: number;
  customerId?: number;
  customerName: string;
  customerEmail?: string;
  title: string;
  detail: string;
  rating: number;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  images?: MediaFile[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductRating {
  attributeId: number;
  attributeCode: string;
  averageRating: number;
  totalRatings: number;
  ratingBreakdown: {
    rating: number;
    count: number;
    percentage: number;
  }[];
}

// Pricing and discounts
export interface ProductPricing {
  basePrice: number;
  compareAtPrice?: number;
  cost?: number;
  specialPrice?: number;
  specialPriceFrom?: string;
  specialPriceTo?: string;
  tierPrices?: TierPrice[];
  groupPrices?: GroupPrice[];
  currency: string;
  taxClass?: string;
  taxRate?: number;
}

export interface TierPrice {
  id: number;
  customerGroupId?: number;
  customerGroupName?: string;
  qty: number;
  price: number;
  percentageValue?: number;
  websiteId?: number;
}

export interface GroupPrice {
  id: number;
  customerGroupId: number;
  customerGroupName: string;
  price: number;
  percentageValue?: number;
  websiteId?: number;
}

// Shipping and fulfillment
export interface ShippingInfo {
  weight?: number;
  weightUnit: "kg" | "lb" | "g" | "oz";
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: "cm" | "in" | "mm";
  };
  shippingClass?: string;
  freeShipping: boolean;
  shippingCost?: number;
  estimatedDeliveryDays?: {
    min: number;
    max: number;
  };
  restrictions?: {
    countries?: string[];
    states?: string[];
    zipCodes?: string[];
  };
}

// Main Product interface
export interface Product extends BaseEntity {
  // Basic Information
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  barcode?: string;

  // Categorization
  categories: Category[];
  primaryCategory: Category;
  brand?: Brand;
  tags: string[];

  // Media
  images: MediaFile[];
  videos?: MediaFile[];
  documents?: MediaFile[];
  gallery?: MediaFile[];

  // Variants and Configurations
  variants: ProductVariant[];
  hasVariants: boolean;
  variantAttributes: string[]; // e.g., ['color', 'size']

  // Pricing
  pricing: ProductPricing;

  // Inventory
  inventory: Inventory;

  // Shipping
  shipping: ShippingInfo;

  // Attributes (EAV system)
  attributes: ProductAttributeValue[];
  customAttributes: Record<string, any>;

  // Relationships
  relatedProducts: ProductRelation[];

  // Reviews and Ratings
  reviews: ProductReview[];
  ratings: ProductRating[];
  averageRating: number;
  totalReviews: number;

  // SEO and Marketing
  seo: SEO;
  featured: boolean;
  newFrom?: string;
  newTo?: string;

  // Status and Publishing
  status: "active" | "inactive" | "draft" | "archived";
  visibility: "catalog" | "search" | "catalog_search" | "not_visible";
  publishedAt?: string;

  // Product Type specific fields
  productType: "simple" | "configurable" | "grouped" | "bundle";

  // Additional metadata
  metadata?: Record<string, any>;

  // Audit fields
  createdBy?: number;
  updatedBy?: number;
  version: number;
}

// Product creation/update DTOs
export interface CreateProductRequest {
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  sku: string;
  barcode?: string;
  categoryIds: number[];
  primaryCategoryId: number;
  brandId?: number;
  tags?: string[];
  pricing: Omit<ProductPricing, "currency">;
  inventory: Omit<Inventory, "lastUpdated">;
  shipping: ShippingInfo;
  attributes?: ProductAttributeValue[];
  customAttributes?: Record<string, any>;
  seo?: Partial<SEO>;
  featured?: boolean;
  status?: Product["status"];
  visibility?: Product["visibility"];
  productType?: Product["productType"];
  newFrom?: string;
  newTo?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number;
  version: number;
}

// Product query and filter types
export interface ProductQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  categoryIds?: number[];
  brandIds?: number[];
  priceRange?: {
    min: number;
    max: number;
  };
  attributes?: Record<string, any>;
  status?: Product["status"][];
  featured?: boolean;
  inStock?: boolean;
  tags?: string[];
  createdFrom?: string;
  createdTo?: string;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  facets?: {
    categories: { id: number; name: string; count: number }[];
    brands: { id: number; name: string; count: number }[];
    priceRanges: { min: number; max: number; count: number }[];
    attributes: Record<string, { value: string; count: number }[]>;
  };
}

// Product comparison
export interface ProductComparison {
  products: Product[];
  comparableAttributes: string[];
  differences: Record<string, Record<number, any>>;
}

// Product wishlist and favorites
export interface ProductWishlistItem {
  id: number;
  productId: number;
  product: Product;
  customerId?: number;
  addedAt: string;
  notes?: string;
}

// Product recently viewed
export interface RecentlyViewedProduct {
  id: number;
  productId: number;
  product: Product;
  customerId?: number;
  viewedAt: string;
  viewCount: number;
}
