# AKA Ecommerce API Integration Guide

This guide provides comprehensive documentation for integrating with the AKA Ecommerce API services, designed for both admin and storefront applications.

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [API Client](#api-client)
5. [Admin Services](#admin-services)
6. [Storefront Services](#storefront-services)
7. [Error Handling](#error-handling)
8. [Caching Strategy](#caching-strategy)
9. [Best Practices](#best-practices)
10. [Examples](#examples)

## Overview

The AKA Ecommerce API is built with TypeScript and provides a comprehensive set of services for managing ecommerce operations. It's designed to work with external Java APIs while providing a clean, type-safe interface for Next.js applications.

### Key Features

- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Authentication**: Integrated with Clerk for secure API access
- **Error Handling**: Robust error handling with retry mechanisms
- **Caching**: Built-in caching strategies for optimal performance
- **Modular Design**: Separate services for admin and storefront operations
- **Real-time Updates**: Support for real-time data synchronization

## Getting Started

### Installation

The API services are already included in the project. No additional installation is required.

### Environment Setup

Add the following environment variables to your `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
API_TIMEOUT=10000
API_RETRIES=3

# Clerk Authentication (already configured)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

### Basic Usage

```typescript
import {
  adminProductService,
  storefrontCatalogService,
  apiClient,
} from "@/lib/api";

// Admin operations
const products = await adminProductService.getProducts({
  page: 1,
  limit: 10,
  search: "laptop",
});

// Storefront operations
const featuredProducts = await storefrontCatalogService.getFeaturedProducts(5);
```

## Authentication

The API client automatically handles authentication using Clerk tokens. No manual token management is required.

### How it works

1. The API client automatically retrieves the current user's token from Clerk
2. Tokens are included in all API requests via the `Authorization` header
3. Expired tokens are automatically refreshed by Clerk
4. Unauthenticated requests are handled gracefully

### Example

```typescript
// This will automatically include the user's auth token
const products = await adminProductService.getProducts();
```

## API Client

The `ApiClient` class provides the foundation for all API operations.

### Configuration

```typescript
import { ApiClient } from "@/lib/api";

const customClient = new ApiClient({
  baseUrl: "https://api.example.com",
  timeout: 15000,
  retries: 5,
  retryDelay: 2000,
});
```

### Request Methods

```typescript
// GET request
const data = await apiClient.get("/products");

// POST request
const newProduct = await apiClient.post("/products", productData);

// PUT request
const updatedProduct = await apiClient.put("/products/123", updateData);

// PATCH request
const patchedProduct = await apiClient.patch("/products/123", partialData);

// DELETE request
await apiClient.delete("/products/123");
```

## Admin Services

Admin services provide full CRUD operations and advanced management features.

### Product Management

```typescript
import { adminProductService } from "@/lib/api";

// Get products with filtering
const products = await adminProductService.getProducts({
  page: 1,
  limit: 20,
  search: "laptop",
  filters: {
    category: "Electronics",
    status: "active",
    priceRange: { min: 100, max: 1000 },
  },
  sortBy: "created_at",
  sortOrder: "desc",
});

// Create new product
const newProduct = await adminProductService.createProduct({
  name: "New Laptop",
  description: "High-performance laptop",
  price: 999.99,
  sku: "LAPTOP-001",
  categoryId: 1,
  inventory: {
    quantity: 50,
    trackQuantity: true,
    allowBackorder: false,
  },
});

// Update product
const updatedProduct = await adminProductService.updateProduct(1, {
  name: "Updated Laptop Name",
  price: 899.99,
});

// Bulk operations
const bulkUpdated = await adminProductService.bulkUpdateProducts([
  { id: 1, data: { status: "active" } },
  { id: 2, data: { status: "active" } },
]);

// Export products
const csvData = await adminProductService.exportProducts("csv", {
  status: "active",
  category: "Electronics",
});
```

### Order Management

```typescript
import { adminOrderService } from "@/lib/api";

// Get orders with filtering
const orders = await adminOrderService.getOrders({
  page: 1,
  limit: 20,
  filters: {
    status: "pending",
    dateRange: {
      from: "2024-01-01",
      to: "2024-01-31",
    },
  },
});

// Update order status
const updatedOrder = await adminOrderService.updateOrderStatus(
  123,
  "processing"
);

// Fulfill order
const fulfilledOrder = await adminOrderService.fulfillOrder(123, {
  trackingNumber: "TRK123456",
  carrier: "UPS",
});

// Add order note
await adminOrderService.addOrderNote(
  123,
  "Customer requested express shipping",
  true
);

// Print order
const pdfBlob = await adminOrderService.printOrder(123, "pdf");
```

### Customer Management

```typescript
import { adminCustomerService } from "@/lib/api";

// Get customers
const customers = await adminCustomerService.getCustomers({
  page: 1,
  limit: 20,
  search: "john@example.com",
});

// Create customer
const newCustomer = await adminCustomerService.createCustomer({
  email: "customer@example.com",
  firstName: "John",
  lastName: "Doe",
  phone: "+1234567890",
  addresses: [
    {
      type: "shipping",
      firstName: "John",
      lastName: "Doe",
      address1: "123 Main St",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "US",
    },
  ],
});

// Add customer tag
await adminCustomerService.addCustomerTag(1, "vip");

// Send email to customer
await adminCustomerService.sendEmailToCustomer(
  1,
  "Welcome!",
  "Thank you for joining us!"
);
```

### Analytics

```typescript
import { adminAnalyticsService } from "@/lib/api";

// Get overview metrics
const overview = await adminAnalyticsService.getOverview("30d");

// Get sales data
const salesData = await adminAnalyticsService.getSalesData("30d", "day");

// Get top products
const topProducts = await adminAnalyticsService.getTopProducts("30d", 10);

// Get customer analytics
const customerAnalytics =
  await adminAnalyticsService.getCustomerAnalytics("30d");

// Create custom report
const report = await adminAnalyticsService.createCustomReport({
  name: "Monthly Sales Report",
  metrics: ["revenue", "orders", "customers"],
  dimensions: ["date", "category"],
  period: "30d",
});
```

## Storefront Services

Storefront services provide customer-facing operations optimized for performance.

### Product Catalog

```typescript
import { storefrontCatalogService } from "@/lib/api";

// Get products with search and filters
const products = await storefrontCatalogService.getProducts({
  page: 1,
  limit: 20,
  search: "laptop",
  filters: {
    category: "Electronics",
    priceRange: { min: 100, max: 1000 },
    brand: "Apple",
  },
  sortBy: "price",
  sortOrder: "asc",
});

// Get product details
const product = await storefrontCatalogService.getProduct(123);

// Get featured products
const featured = await storefrontCatalogService.getFeaturedProducts(10);

// Search products
const searchResults = await storefrontCatalogService.searchProducts("laptop", {
  page: 1,
  limit: 20,
  filters: { category: "Electronics" },
});

// Get product reviews
const reviews = await storefrontCatalogService.getProductReviews(123, {
  page: 1,
  limit: 10,
  sortBy: "created_at",
  sortOrder: "desc",
});

// Add product review
await storefrontCatalogService.addProductReview(123, {
  rating: 5,
  title: "Great product!",
  comment: "Highly recommended",
});
```

### Shopping Cart

```typescript
import { storefrontCartService } from "@/lib/api";

// Get current cart
const cart = await storefrontCartService.getCart();

// Add item to cart
const updatedCart = await storefrontCartService.addItem({
  productId: 123,
  variantId: 456,
  quantity: 2,
});

// Update item quantity
const updatedCart = await storefrontCartService.updateItemQuantity(
  "item-123",
  3
);

// Remove item
const updatedCart = await storefrontCartService.removeItem("item-123");

// Apply coupon
const result = await storefrontCartService.applyCoupon("SAVE10");

// Update shipping address
const updatedCart = await storefrontCartService.updateShippingAddress({
  firstName: "John",
  lastName: "Doe",
  address1: "123 Main St",
  city: "New York",
  state: "NY",
  postalCode: "10001",
  country: "US",
});

// Get shipping options
const shippingOptions = await storefrontCartService.getShippingOptions();
```

### Checkout Process

```typescript
import { storefrontCheckoutService } from "@/lib/api";

// Initialize checkout
const checkout = await storefrontCheckoutService.initializeCheckout();

// Update checkout info
const updatedCheckout = await storefrontCheckoutService.updateCheckoutInfo({
  email: "customer@example.com",
  shippingAddress: {
    firstName: "John",
    lastName: "Doe",
    address1: "123 Main St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "US",
  },
  shippingMethodId: "standard",
  paymentMethodId: "card",
});

// Process payment
const paymentResult = await storefrontCheckoutService.processPayment({
  paymentMethodId: "card",
  paymentToken: "tok_123456789",
  savePaymentMethod: true,
});

// Complete checkout
const order = await storefrontCheckoutService.completeCheckout();
```

## Error Handling

The API provides comprehensive error handling with automatic retry mechanisms.

### Basic Error Handling

```typescript
import { handleApiError, ErrorHandler } from "@/lib/api";

try {
  const products = await adminProductService.getProducts();
} catch (error) {
  const appError = handleApiError(error, "getProducts");

  // Get user-friendly message
  const message = ErrorHandler.getUserMessage(appError);

  // Get error action
  const { action, buttonText, redirectTo } =
    ErrorHandler.getErrorAction(appError);

  // Handle different error types
  switch (appError.type) {
    case "validation":
      // Show validation errors
      break;
    case "auth":
      // Redirect to login
      if (redirectTo) {
        window.location.href = redirectTo;
      }
      break;
    case "network":
      // Show retry option
      break;
  }
}
```

### Retry Mechanism

```typescript
import { retryOperation } from "@/lib/api";

const products = await retryOperation(
  () => adminProductService.getProducts(),
  3, // max retries
  1000 // initial delay
);
```

### Error Notifications

```typescript
import { notifyError } from "@/lib/api";

try {
  const products = await adminProductService.getProducts();
} catch (error) {
  const appError = handleApiError(error);
  notifyError(appError);
}
```

## Caching Strategy

The API includes built-in caching for optimal performance.

### Cache Configuration

```typescript
import { CACHE_STRATEGIES, apiCacheManager } from "@/lib/api";

// Use predefined strategies
const shortCache = apiCacheManager.getCache(
  "/products",
  CACHE_STRATEGIES.SHORT
);
const longCache = apiCacheManager.getCache(
  "/categories",
  CACHE_STRATEGIES.LONG
);
```

### Cache Decorator

```typescript
import { cached } from "@/lib/api";

class ProductService {
  @cached(5 * 60 * 1000, "lru") // 5 minutes, LRU strategy
  async getProducts(params: QueryParams) {
    // This method will be automatically cached
    return this.fetchProducts(params);
  }
}
```

### Manual Cache Management

```typescript
import { apiCacheManager } from "@/lib/api";

// Cache a response
await apiCacheManager.cacheResponse("/products", "key-123", products, 300000);

// Get cached response
const cached = apiCacheManager.getCachedResponse("/products", "key-123");

// Invalidate cache
apiCacheManager.invalidateCache("/products", "laptop");
```

## Best Practices

### 1. Use TypeScript Types

Always use the provided TypeScript types for better development experience and error prevention.

```typescript
import type { Product, QueryParams } from "@/lib/api";

const getProducts = async (params: QueryParams): Promise<Product[]> => {
  const response = await adminProductService.getProducts(params);
  return response.products;
};
```

### 2. Handle Errors Gracefully

Always wrap API calls in try-catch blocks and provide meaningful error messages to users.

```typescript
const loadProducts = async () => {
  try {
    setLoading(true);
    const products = await adminProductService.getProducts();
    setProducts(products.products);
  } catch (error) {
    const appError = handleApiError(error, "loadProducts");
    setError(ErrorHandler.getUserMessage(appError));
  } finally {
    setLoading(false);
  }
};
```

### 3. Use Pagination

Always implement pagination for large datasets to improve performance and user experience.

```typescript
const loadProducts = async (page: number) => {
  const response = await adminProductService.getProducts({
    page,
    limit: 20,
  });

  return {
    products: response.products,
    pagination: response.pagination,
  };
};
```

### 4. Implement Search and Filtering

Use the built-in search and filtering capabilities for better user experience.

```typescript
const searchProducts = async (query: string, filters: any) => {
  return await storefrontCatalogService.searchProducts(query, {
    page: 1,
    limit: 20,
    filters,
  });
};
```

### 5. Cache Frequently Accessed Data

Use caching for data that doesn't change frequently.

```typescript
// Categories are cached for 30 minutes
const categories = await storefrontCatalogService.getCategories();
```

## Examples

### Complete Product Management Component

```typescript
'use client';

import { useState, useEffect } from 'react';
import { adminProductService, handleApiError } from '@/lib/api';
import type { Product, QueryParams } from '@/lib/api';

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });

  const loadProducts = async (params: QueryParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminProductService.getProducts({
        page: pagination.page,
        limit: pagination.limit,
        ...params
      });

      setProducts(response.products);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total
      }));
    } catch (err) {
      const appError = handleApiError(err, 'loadProducts');
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (search: string) => {
    loadProducts({ search });
  };

  const handleFilter = (filters: any) => {
    loadProducts({ filters });
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
    loadProducts({ page });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Product list UI */}
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Shopping Cart Hook

```typescript
import { useState, useEffect } from "react";
import { storefrontCartService, handleApiError } from "@/lib/api";
import type { Cart, CartItem } from "@/lib/api";

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCart = async () => {
    try {
      setLoading(true);
      const cartData = await storefrontCartService.getCart();
      setCart(cartData);
    } catch (err) {
      const appError = handleApiError(err, "loadCart");
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (
    productId: number,
    variantId?: number,
    quantity: number = 1
  ) => {
    try {
      setLoading(true);
      const updatedCart = await storefrontCartService.addItem({
        productId,
        variantId,
        quantity,
      });
      setCart(updatedCart);
    } catch (err) {
      const appError = handleApiError(err, "addItem");
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      const updatedCart = await storefrontCartService.updateItemQuantity(
        itemId,
        quantity
      );
      setCart(updatedCart);
    } catch (err) {
      const appError = handleApiError(err, "updateQuantity");
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      setLoading(true);
      const updatedCart = await storefrontCartService.removeItem(itemId);
      setCart(updatedCart);
    } catch (err) {
      const appError = handleApiError(err, "removeItem");
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return {
    cart,
    loading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    refresh: loadCart,
  };
}
```

This comprehensive API integration guide provides everything needed to effectively use the AKA Ecommerce API services in your Next.js application. The modular design, type safety, and robust error handling make it easy to build both admin and storefront features with confidence.
