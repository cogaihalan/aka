import { Product, ProductVariant } from "@/lib/api/types";

// Cart item represents a product variant in the cart
export interface CartItem {
  id: string; // Unique cart item ID (not product ID)
  productId: number;
  variantId?: number;
  name: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  image?: string;
  attributes: Record<string, string>; // size, color, etc.
  sku: string;
  weight?: number;
  maxQuantity?: number; // Stock limit
}

// Cart state interface
export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number;
}

// Cart actions interface
export interface CartActions {
  // Item management
  addItem: (
    product: Product,
    variant?: ProductVariant,
    quantity?: number
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Cart state management
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Utility functions
  getItemQuantity: (productId: number, variantId?: number) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  getTax: () => number;
  getTotal: () => number;
  isItemInCart: (productId: number, variantId?: number) => boolean;

  // Persistence
  loadCart: () => void;
  saveCart: () => void;
}

// Combined cart store type
export type CartStore = CartState & CartActions;

// Cart calculation options
export interface CartCalculationOptions {
  shippingThreshold?: number;
  shippingCost?: number;
  taxRate?: number;
  freeShippingThreshold?: number;
}

// Cart item creation parameters
export interface AddToCartParams {
  product: Product;
  variant?: ProductVariant;
  quantity?: number;
  attributes?: Record<string, string>;
}

// Cart validation result
export interface CartValidationResult {
  isValid: boolean;
  errors: {
    itemId: string;
    message: string;
  }[];
  warnings: {
    itemId: string;
    message: string;
  }[];
}
