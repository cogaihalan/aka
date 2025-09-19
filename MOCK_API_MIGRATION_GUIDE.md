# Mock API Migration Guide

This guide explains how to migrate from your existing mock API to the new comprehensive API structure while maintaining compatibility with your current fake data.

## 🎯 **Current Status**

Your application currently uses:

- **Mock Data**: `src/constants/mock-api.ts` with `fakeProducts`
- **Simple Types**: Basic `Product` type in `src/constants/data.ts`
- **Direct Integration**: Components directly call `fakeProducts.getProducts()`

## 🔄 **Migration Options**

### Option 1: Gradual Migration (Recommended)

Keep using your existing mock data while gradually adopting the new API structure.

### Option 2: Full Migration

Immediately switch to the new API structure with enhanced mock data.

### Option 3: Hybrid Approach

Use both systems side by side during development.

## 📋 **Step-by-Step Migration**

### Step 1: Environment Setup

Add to your `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_MODE=mock
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

### Step 2: Update Existing Components

#### Option A: Use Compatibility Layer (Minimal Changes)

Replace your existing product listing component:

```typescript
// Before (src/features/products/components/product-listing.tsx)
import { fakeProducts } from "@/constants/mock-api";

const data = await fakeProducts.getProducts(filters);

// After (src/features/products/components/product-listing-compatible.tsx)
import { getProductsCompatible } from "@/lib/api/compatibility";

const data = await getProductsCompatible(filters);
```

#### Option B: Use New API Services (Full Migration)

```typescript
// New approach using API services
import { adminProductService } from "@/lib/api";

const { products, pagination } = await adminProductService.getProducts({
  page: 1,
  limit: 10,
  search: "laptop",
  filters: { category: "Electronics" },
});
```

### Step 3: Update Type Imports

```typescript
// Before
import { Product } from "@/constants/data";

// After
import { Product } from "@/lib/api";
// or keep using the old type for compatibility
import { Product as LegacyProduct } from "@/constants/data";
```

## 🔧 **Configuration Options**

### Mock Mode (Current Setup)

```env
NEXT_PUBLIC_API_MODE=mock
```

- Uses your existing `fakeProducts` data
- Enhanced with additional fields and structure
- Works through Next.js API routes
- No external API required

### Real API Mode (Future)

```env
NEXT_PUBLIC_API_MODE=real
NEXT_PUBLIC_API_BASE_URL=http://your-java-api.com/api
```

- Connects to your Java API
- Full CRUD operations
- Real-time data
- Production-ready

## 📊 **Data Transformation**

The new API structure enhances your existing mock data:

### Before (Your Current Data)

```typescript
{
  id: 1,
  name: "Laptop",
  description: "High-performance laptop",
  price: 999.99,
  photo_url: "https://api.slingacademy.com/public/sample-products/1.png",
  category: "Electronics",
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z"
}
```

### After (Enhanced API Data)

```typescript
{
  id: 1,
  name: "Laptop",
  description: "High-performance laptop",
  price: 999.99,
  compareAtPrice: 1199.99,
  sku: "SKU-000001",
  barcode: "1234567891",
  weight: 2.5,
  dimensions: { length: 35, width: 25, height: 2 },
  category: {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    // ... full category object
  },
  brand: {
    id: 1,
    name: "Generic Brand",
    // ... full brand object
  },
  tags: ["electronics", "featured"],
  images: [
    {
      id: 1,
      url: "https://api.slingacademy.com/public/sample-products/1.png",
      alt: "Laptop",
      order: 1,
      isPrimary: true
    }
  ],
  variants: [],
  inventory: {
    quantity: 50,
    reserved: 0,
    available: 50,
    trackQuantity: true,
    allowBackorder: false,
    lowStockThreshold: 10
  },
  seo: {
    title: "Laptop",
    description: "High-performance laptop",
    keywords: ["Electronics", "Laptop"]
  },
  status: "active",
  featured: true,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  publishedAt: "2024-01-01T00:00:00Z"
}
```

## 🚀 **Available Services**

### Admin Services (Mock Mode)

```typescript
import { adminProductService } from "@/lib/api";

// Get products with filtering
const products = await adminProductService.getProducts({
  page: 1,
  limit: 20,
  search: "laptop",
  filters: { category: "Electronics" },
});

// Create product
const newProduct = await adminProductService.createProduct({
  name: "New Product",
  price: 99.99,
  categoryId: 1,
  // ... other fields
});

// Update product
await adminProductService.updateProduct(1, {
  name: "Updated Product Name",
});

// Delete product
await adminProductService.deleteProduct(1);
```

### Storefront Services (Mock Mode)

```typescript
import { storefrontCatalogService, storefrontCartService } from "@/lib/api";

// Browse products
const products = await storefrontCatalogService.getProducts({
  page: 1,
  limit: 20,
  search: "laptop",
});

// Add to cart
await storefrontCartService.addItem({
  productId: 1,
  quantity: 2,
});

// Get cart
const cart = await storefrontCartService.getCart();
```

## 🔄 **Migration Examples**

### Example 1: Update Product Listing Page

**Before:**

```typescript
// src/app/dashboard/product/page.tsx
import { fakeProducts } from '@/constants/mock-api';

export default async function ProductPage() {
  const data = await fakeProducts.getProducts({ page: 1, limit: 10 });
  return <ProductTable data={data.products} />;
}
```

**After (Compatibility Layer):**

```typescript
// src/app/dashboard/product/page.tsx
import { getProductsCompatible } from '@/lib/api/compatibility';

export default async function ProductPage() {
  const data = await getProductsCompatible({ page: 1, limit: 10 });
  return <ProductTable data={data.products} />;
}
```

**After (Full Migration):**

```typescript
// src/app/dashboard/product/page.tsx
import { adminProductService } from '@/lib/api';

export default async function ProductPage() {
  const { products, pagination } = await adminProductService.getProducts({
    page: 1,
    limit: 10
  });
  return <ProductTable data={products} pagination={pagination} />;
}
```

### Example 2: Update Product Detail Page

**Before:**

```typescript
const product = await fakeProducts.getProductById(id);
```

**After:**

```typescript
const product = await adminProductService.getProduct(id);
```

### Example 3: Add Product Creation

**Before:**

```typescript
// Not available in current mock API
```

**After:**

```typescript
const newProduct = await adminProductService.createProduct({
  name: "New Product",
  price: 99.99,
  categoryId: 1,
  inventory: {
    quantity: 50,
    trackQuantity: true,
    allowBackorder: false,
  },
});
```

## 🎨 **UI Component Updates**

### Enhanced Product Cards

```typescript
import { Product } from '@/lib/api';

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <img src={product.images[0]?.url} alt={product.images[0]?.alt} />
      <h3>{product.name}</h3>
      <p className="price">
        ${product.price}
        {product.compareAtPrice && (
          <span className="compare-price">${product.compareAtPrice}</span>
        )}
      </p>
      <p className="sku">SKU: {product.sku}</p>
      <p className="stock">
        {product.inventory.available} in stock
      </p>
      <div className="tags">
        {product.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </div>
  );
}
```

### Advanced Filtering

```typescript
function ProductFilters() {
  const [filters, setFilters] = useState({});

  const { data: products, loading } = useProducts(filters);

  return (
    <div className="filters">
      <input
        placeholder="Search products..."
        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
      />
      <select
        onChange={(e) => setFilters(prev => ({
          ...prev,
          filters: { ...prev.filters, category: e.target.value }
        }))}
      >
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Clothing">Clothing</option>
      </select>
    </div>
  );
}
```

## 🧪 **Testing the Migration**

### 1. Test Mock Mode

```bash
# Set environment
echo "NEXT_PUBLIC_API_MODE=mock" >> .env.local

# Start development server
npm run dev

# Test API endpoints
curl http://localhost:3000/api/mock/admin/products
curl http://localhost:3000/api/mock/storefront/products
```

### 2. Test Compatibility Layer

```typescript
// Test in your components
import { getProductsCompatible } from "@/lib/api/compatibility";

const testProducts = await getProductsCompatible({
  page: 1,
  limit: 5,
  search: "laptop",
});

console.log("Products:", testProducts.products);
console.log("Pagination:", testProducts.pagination);
```

### 3. Test New API Services

```typescript
// Test admin services
import { adminProductService } from "@/lib/api";

const products = await adminProductService.getProducts({
  page: 1,
  limit: 10,
  search: "laptop",
});

// Test storefront services
import { storefrontCatalogService } from "@/lib/api";

const featured = await storefrontCatalogService.getFeaturedProducts(5);
```

## 🔧 **Troubleshooting**

### Common Issues

1. **Type Mismatches**

   ```typescript
   // If you get type errors, use type assertions
   const products = data.products as Product[];
   ```

2. **Missing Fields**

   ```typescript
   // The new API has more fields, use optional chaining
   const imageUrl = product.images?.[0]?.url || product.photo_url;
   ```

3. **API Route Not Found**
   ```bash
   # Make sure you have the mock API routes
   ls src/app/api/mock/
   ```

### Debug Mode

```typescript
// Enable debug logging
console.log("API Mode:", process.env.NEXT_PUBLIC_API_MODE);
console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
```

## 🎯 **Next Steps**

1. **Start with Compatibility Layer**: Use `getProductsCompatible()` to maintain existing functionality
2. **Gradually Migrate Components**: Update one component at a time
3. **Add New Features**: Use the full API services for new functionality
4. **Test Thoroughly**: Ensure all existing features work with the new structure
5. **Prepare for Real API**: When ready, switch to `NEXT_PUBLIC_API_MODE=real`

## 📚 **Additional Resources**

- [API Integration Guide](./API_INTEGRATION_GUIDE.md) - Complete API documentation
- [Type Definitions](./src/lib/api/types.ts) - All available types
- [Mock Adapters](./src/lib/api/adapters/mock-adapter.ts) - Mock data implementation
- [API Services](./src/lib/api/services/) - Admin and storefront services

This migration guide ensures a smooth transition from your current mock API to the new comprehensive API structure while maintaining all existing functionality! 🚀
