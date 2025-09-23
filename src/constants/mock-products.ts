// Import the enhanced product types and data
import {
  Product,
  Category,
  Brand,
  MOCK_PRODUCTS_ENHANCED,
  MOCK_CATEGORIES,
  MOCK_BRANDS,
} from "./mock-products-enhanced";

// Legacy compatibility - export the enhanced data
export {
  MOCK_PRODUCTS_ENHANCED as MOCK_PRODUCTS,
  MOCK_CATEGORIES,
  MOCK_BRANDS,
};

// Extended Product interface for backward compatibility
interface MockProduct extends Product {
  // Additional fields for mock data (legacy support)
  rating?: number;
  inStock?: boolean;
  color?: string;
  sizes?: string[];
}

// All mock data is now imported from mock-products-enhanced.ts

// Legacy helper functions removed - use enhanced product creation from mock-products-enhanced.ts

// All product data is now imported from mock-products-enhanced.ts

// Legacy arrays are now exported from mock-products-enhanced.ts
