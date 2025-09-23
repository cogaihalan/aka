# Product Schema Migration Guide

## Overview

This guide documents the comprehensive product data structure rebuild inspired by Magento's EAV (Entity-Attribute-Value) model and enterprise e-commerce best practices. The new structure supports multi-images, robust category linking, and enterprise-level product management.

## Key Improvements

### 1. Comprehensive Product Structure

- **Multi-image support** with variants (thumbnail, small, medium, large, original, webp, avif)
- **Hierarchical category system** with proper linking
- **Advanced inventory management** with warehouse support
- **Flexible attribute system** (EAV-like)
- **Product variants and configurations**
- **SEO optimization** with OpenGraph and Twitter cards
- **Review and rating system**
- **Pricing tiers and group pricing**
- **Shipping and fulfillment data**

### 2. Enhanced Type Safety

- Complete TypeScript definitions for all product-related entities
- Proper type relationships and constraints
- Backward compatibility with existing code

### 3. Enterprise Features

- Product comparison functionality
- Analytics and insights
- Bulk operations (import/export)
- Media management with reordering
- Advanced search and filtering

## File Structure

```
src/
├── types/
│   └── product.ts                    # Comprehensive product types
├── constants/
│   ├── mock-products.ts              # Legacy compatibility
│   └── mock-products-enhanced.ts     # Enhanced mock data
└── lib/api/
    ├── types.ts                      # Updated API types
    └── services/
        ├── admin/
        │   └── products-enhanced.ts  # Enhanced admin service
        └── storefront/
            └── catalog.ts            # Updated storefront service
```

## New Product Structure

### Core Product Interface

```typescript
interface Product {
  // Basic Information
  id: number;
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
  variantAttributes: string[];

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

  // Product Type
  productType:
    | "simple"
    | "configurable"
    | "grouped"
    | "bundle"
    | "virtual"
    | "downloadable";

  // Additional metadata
  metadata?: Record<string, any>;

  // Audit fields
  createdBy?: number;
  updatedBy?: number;
  version: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Media Management

```typescript
interface MediaFile {
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
```

### Enhanced Category System

```typescript
interface Category {
  id: number;
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
  image?: MediaFile;
  thumbnail?: MediaFile;
  metaImage?: MediaFile;
  attributes?: Record<string, any>;
}
```

## Migration Steps

### 1. Update Imports

Replace existing product imports:

```typescript
// Old
import { Product, Category, Brand } from "@/lib/api";

// New
import { Product, Category, Brand } from "@/types/product";
// or
import { Product, Category, Brand } from "@/types";
```

### 2. Update Component Props

Update component interfaces to use the new structure:

```typescript
// Old
interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

// New
interface ProductCardProps {
  product: Product;
}
```

### 3. Update API Calls

Use the enhanced API services:

```typescript
// Old
const products = await productService.getProducts();

// New - Enhanced search
const result = await productService.searchProducts({
  categoryIds: [1, 2],
  priceRange: { min: 100, max: 500 },
  featured: true,
  inStock: true,
});

// New - Full product details
const product = await productService.getProductWithDetails(id);
```

### 4. Update Media Handling

```typescript
// Old
<img src={product.image} alt={product.name} />

// New
{product.images.map(image => (
  <img
    key={image.id}
    src={image.variants?.find(v => v.type === 'medium')?.url || image.url}
    alt={image.alt}
    title={image.title}
  />
))}
```

### 5. Update Category Navigation

```typescript
// Old
const categories = await categoryService.getCategories();

// New - Hierarchical categories
const categories = await categoryService.getCategoryTree();
```

## Enhanced Features

### 1. Advanced Search

```typescript
const searchResult = await catalogService.searchProducts({
  search: "smartphone",
  categoryIds: [2], // Smartphones category
  brandIds: [1, 2], // Apple, Samsung
  priceRange: { min: 500, max: 1500 },
  attributes: {
    color: "black",
    storage: "256GB",
  },
  featured: true,
  inStock: true,
  sortBy: "price",
  sortOrder: "asc",
});
```

### 2. Product Variants

```typescript
// Handle product variants
const selectedVariant = product.variants.find(
  (variant) =>
    variant.attributes.color === selectedColor &&
    variant.attributes.size === selectedSize
);
```

### 3. Media Management

```typescript
// Upload new media
const mediaFile = await adminService.uploadProductMedia(productId, file, {
  alt: "Product detail view",
  title: "Detail View",
  order: 2,
  isPrimary: false,
});

// Reorder media
await adminService.reorderProductMedia(productId, [3, 1, 2, 4]);
```

### 4. Inventory Management

```typescript
// Update inventory
await adminService.updateProductInventory(productId, {
  quantity: 150,
  lowStockThreshold: 10,
  allowBackorder: true,
});
```

## Backward Compatibility

The new structure maintains backward compatibility through:

1. **Legacy type aliases** in `src/lib/api/types.ts`
2. **Enhanced mock data** that includes both old and new fields
3. **Gradual migration path** - components can be updated incrementally

## Best Practices

### 1. Use Type Guards

```typescript
function isEnhancedProduct(product: any): product is Product {
  return (
    product &&
    typeof product.pricing === "object" &&
    Array.isArray(product.images) &&
    Array.isArray(product.variants)
  );
}
```

### 2. Handle Media Responsively

```typescript
function getOptimalImageUrl(
  image: MediaFile,
  size: "small" | "medium" | "large" = "medium"
): string {
  const variant = image.variants?.find((v) => v.type === size);
  return variant?.url || image.url;
}
```

### 3. Category Navigation

```typescript
function buildCategoryPath(category: Category): string {
  return category.path; // e.g., "/electronics/smartphones"
}
```

## Testing

The enhanced mock data includes comprehensive test cases:

- Products with multiple images and variants
- Hierarchical categories
- Different product types (simple, configurable, etc.)
- Various pricing scenarios
- Inventory states
- SEO configurations

## Performance Considerations

1. **Lazy loading** for product images
2. **Pagination** for large product lists
3. **Caching** for category trees
4. **Image optimization** using variants
5. **Search indexing** for attributes

## Next Steps

1. **Update existing components** to use the new structure
2. **Implement media upload** functionality
3. **Add product comparison** features
4. **Enhance search and filtering**
5. **Implement analytics** tracking
6. **Add bulk operations** UI

## Support

For questions or issues with the migration:

1. Check the TypeScript definitions in `src/types/product.ts`
2. Review the enhanced mock data in `src/constants/mock-products-enhanced.ts`
3. Use the enhanced API services in `src/lib/api/services/`
4. Refer to this guide for implementation examples

The new product structure provides a solid foundation for enterprise-level e-commerce functionality while maintaining flexibility and extensibility.
