# Admin-Storefront Integration Guide

This document explains how the admin dashboard and storefront are now integrated to share products and categories.

## Overview

The integration creates a unified API layer that both admin and storefront can use to access the same data. When you create products or categories in the admin dashboard, they are immediately available in the storefront.

## Architecture

### Unified API Endpoints

The system now uses unified API endpoints that serve both admin and storefront:

- `/api/products` - Product CRUD operations
- `/api/products/[id]` - Individual product operations
- `/api/categories` - Category CRUD operations
- `/api/categories/[id]` - Individual category operations
- `/api/categories/slug/[slug]` - Category by slug (storefront)

### Service Layer

#### Unified Services
- `UnifiedProductService` - Handles all product operations
- `UnifiedCategoryService` - Handles all category operations

#### Admin Services
- `AdminProductService` - Admin-specific product operations (uses unified service with admin flag)
- `AdminCategoryService` - Admin-specific category operations (uses unified service with admin flag)

#### Storefront Services
- `StorefrontCatalogService` - Storefront-specific operations (uses unified service with public flag)

## How It Works

### Admin Operations
When admin services are called:
1. They use the unified services with `isAdmin: true` flag
2. This adds admin headers (`x-admin-request: true`) to API calls
3. The API routes check for admin headers and allow full CRUD operations

### Storefront Operations
When storefront services are called:
1. They use the unified services with `isAdmin: false` flag
2. No admin headers are added
3. The API routes only allow read operations for public access

### Data Flow
```
Admin Dashboard → Admin Services → Unified Services → API Routes → Database
Storefront → Storefront Services → Unified Services → API Routes → Database
```

## Key Features

### 1. Shared Data
- Products created in admin are immediately visible in storefront
- Categories created in admin are immediately available in storefront
- All data is stored in the same location

### 2. Role-Based Access
- Admin users can create, read, update, and delete
- Storefront users can only read published/active content
- Admin headers control access level

### 3. Consistent API
- Same endpoints for both admin and storefront
- Consistent response formats
- Unified error handling

## Usage Examples

### Creating a Product in Admin
```typescript
import { adminProductService } from "@/lib/api/services/admin/products";

const newProduct = await adminProductService.createProduct({
  name: "New Product",
  description: "Product description",
  price: 99.99,
  // ... other fields
});
```

### Fetching Products in Storefront
```typescript
import { storefrontCatalogService } from "@/lib/api/services/storefront/catalog";

const products = await storefrontCatalogService.getProducts({
  limit: 10,
  page: 1
});
```

### Creating a Category in Admin
```typescript
import { adminCategoryService } from "@/lib/api/services/admin/categories";

const newCategory = await adminCategoryService.createCategory({
  name: "New Category",
  slug: "new-category",
  description: "Category description"
});
```

### Fetching Categories in Storefront
```typescript
import { storefrontCatalogService } from "@/lib/api/services/storefront/catalog";

const categories = await storefrontCatalogService.getCategories();
```

## Testing

You can test the integration by visiting:
- `/api/test-integration` - Tests all services and shows any errors

## Benefits

1. **Single Source of Truth**: All data comes from the same API endpoints
2. **Real-time Updates**: Changes in admin are immediately reflected in storefront
3. **Consistent Experience**: Same data structure and API patterns
4. **Easy Maintenance**: Changes to API logic affect both admin and storefront
5. **Scalable**: Easy to add new features that work across both interfaces

## Security

- Admin operations require proper authentication headers
- Storefront operations are public but limited to read-only
- API routes validate admin access before allowing modifications
- All operations go through the same validation and error handling

## Future Enhancements

- Add caching layer for better performance
- Implement real-time updates using WebSockets
- Add audit logging for admin operations
- Implement rate limiting for API endpoints
