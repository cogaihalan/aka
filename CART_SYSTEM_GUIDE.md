# Cart Management System with Zustand

A comprehensive, production-ready cart management system built with Zustand, TypeScript, and React following best practices for e-commerce applications.

## 🚀 Features

### Core Functionality

- ✅ **Global State Management** - Zustand store for cart state
- ✅ **Persistence** - localStorage integration with automatic save/load
- ✅ **TypeScript Support** - Full type safety throughout
- ✅ **Product Variants** - Support for different product variants (size, color, etc.)
- ✅ **Inventory Management** - Stock validation and low stock warnings
- ✅ **Price Calculations** - Subtotal, shipping, tax, and total calculations
- ✅ **Promo Codes** - Discount and free shipping code support
- ✅ **Error Handling** - Comprehensive error states and validation
- ✅ **Loading States** - UI feedback during operations

### UI Components

- ✅ **CartItem** - Multiple variants (default, compact, minimal)
- ✅ **CartSummary** - Order summary with calculations
- ✅ **CartSidebar** - Slide-out cart drawer
- ✅ **CartButton** - Cart icon with item count badge
- ✅ **CartDemo** - Interactive demo component

### Hooks & Utilities

- ✅ **useCart** - Main cart operations hook
- ✅ **useAddToCart** - Add to cart with loading states
- ✅ **useAddVariantToCart** - Variant-specific add to cart
- ✅ **useBulkAddToCart** - Bulk operations
- ✅ **Validation** - Cart validation utilities

## 📁 File Structure

```
src/
├── types/
│   └── cart.ts                    # Cart type definitions
├── stores/
│   └── cart-store.ts             # Zustand store implementation
├── components/
│   ├── cart/
│   │   ├── cart-item.tsx         # Individual cart item component
│   │   ├── cart-summary.tsx      # Order summary component
│   │   ├── cart-sidebar.tsx      # Slide-out cart drawer
│   │   ├── cart-button.tsx       # Cart button with badge
│   │   ├── cart-demo.tsx         # Demo component
│   │   └── index.ts              # Component exports
│   └── providers/
│       └── cart-provider.tsx     # Cart context provider
├── hooks/
│   ├── use-cart.ts               # Main cart hook
│   └── use-add-to-cart.ts        # Add to cart hooks
└── features/storefront/components/
    └── cart-page.tsx             # Updated cart page
```

## 🛠 Usage

### Basic Cart Operations

```tsx
import { useCart } from "@/hooks/use-cart";

function ProductCard({ product }) {
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const handleAddToCart = () => {
    addToCart({ product, quantity: 1 });
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={handleAddToCart}>
        {isInCart(product.id) ? "In Cart" : "Add to Cart"}
      </button>
      {isInCart(product.id) && (
        <span>Quantity: {getItemQuantity(product.id)}</span>
      )}
    </div>
  );
}
```

### Using Cart Components

```tsx
import {
  CartItem,
  CartSummary,
  CartButton,
  CartSidebar,
} from "@/components/cart";

function CartPage() {
  const { items } = useCart();

  return (
    <div>
      <h1>Shopping Cart</h1>
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
      <CartSummary />
    </div>
  );
}

function Header() {
  return (
    <header>
      <CartButton />
      <CartSidebar />
    </header>
  );
}
```

### Advanced Usage with Variants

```tsx
import { useAddVariantToCart } from "@/hooks/use-add-to-cart";

function ProductWithVariants({ product }) {
  const { addVariantToCart, isAdding } = useAddVariantToCart({
    onSuccess: (product, quantity) => {
      toast.success(`Added ${quantity} x ${product.name} to cart`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  return (
    <div>
      {product.variants.map((variant) => (
        <button
          key={variant.id}
          onClick={() => addVariantToCart(product, variant, 1)}
          disabled={isAdding}
        >
          {variant.name} - ${variant.price}
        </button>
      ))}
    </div>
  );
}
```

## 🔧 Configuration

### Cart Calculation Options

The cart system uses configurable calculation options:

```typescript
const DEFAULT_CALCULATION_OPTIONS = {
  shippingThreshold: 50, // Free shipping threshold
  shippingCost: 9.99, // Standard shipping cost
  taxRate: 0.08, // Tax rate (8%)
  freeShippingThreshold: 50, // Free shipping threshold
};
```

### Persistence Configuration

Cart data is automatically persisted to localStorage:

```typescript
// In cart-store.ts
persist(
  (set, get) => ({
    // store implementation
  }),
  {
    name: "cart-storage",
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({
      items: state.items,
      lastUpdated: state.lastUpdated,
    }),
  }
);
```

## 🎨 Component Variants

### CartItem Variants

```tsx
// Default variant - full featured
<CartItem item={item} variant="default" />

// Compact variant - smaller footprint
<CartItem item={item} variant="compact" />

// Minimal variant - just essential info
<CartItem item={item} variant="minimal" />
```

### CartButton Variants

```tsx
// Icon only with badge
<CartButton size="icon" showBadge={true} />

// With text and badge
<CartButton showText={true} showBadge={true} />

// Custom styling
<CartButton
  variant="outline"
  className="custom-cart-button"
  onClick={handleCustomClick}
/>
```

## 🔍 State Management

### Store Structure

```typescript
interface CartState {
  items: CartItem[]; // Cart items
  isOpen: boolean; // Cart sidebar open state
  isLoading: boolean; // Loading state
  error: string | null; // Error message
  lastUpdated: number; // Last update timestamp
}
```

### Available Actions

```typescript
interface CartActions {
  // Item management
  addItem: (product, variant?, quantity?) => void;
  removeItem: (itemId) => void;
  updateQuantity: (itemId, quantity) => void;
  clearCart: () => void;

  // State management
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Utilities
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isItemInCart: (productId, variantId?) => boolean;
}
```

## 🧪 Testing

### Testing Cart Operations

```tsx
import { renderHook, act } from "@testing-library/react";
import { useCart } from "@/hooks/use-cart";

test("should add item to cart", () => {
  const { result } = renderHook(() => useCart());

  act(() => {
    result.current.addToCart({ product: mockProduct, quantity: 1 });
  });

  expect(result.current.items).toHaveLength(1);
  expect(result.current.getTotalItems()).toBe(1);
});
```

### Testing Components

```tsx
import { render, screen } from "@testing-library/react";
import { CartItem } from "@/components/cart";

test("should render cart item", () => {
  render(<CartItem item={mockCartItem} />);

  expect(screen.getByText(mockCartItem.name)).toBeInTheDocument();
  expect(screen.getByText(`$${mockCartItem.price}`)).toBeInTheDocument();
});
```

## 🚀 Performance Optimizations

### Selector Hooks

Use specific selector hooks to prevent unnecessary re-renders:

```tsx
// ✅ Good - only re-renders when items change
const items = useCartItems();

// ✅ Good - only re-renders when total changes
const total = useCartTotal();

// ❌ Avoid - re-renders on any store change
const { items, total } = useCart();
```

### Memoization

```tsx
import { useMemo } from "react";

function CartSummary() {
  const { getSubtotal, getShipping, getTax } = useCart();

  const calculations = useMemo(
    () => ({
      subtotal: getSubtotal(),
      shipping: getShipping(),
      tax: getTax(),
      total: getSubtotal() + getShipping() + getTax(),
    }),
    [getSubtotal, getShipping, getTax]
  );

  return <div>{/* render calculations */}</div>;
}
```

## 🔒 Error Handling

### Validation

The cart system includes comprehensive validation:

```typescript
const validation = validateCart();
if (!validation.isValid) {
  console.error("Cart validation errors:", validation.errors);
}
```

### Error States

```tsx
function CartPage() {
  const { error, clearError } = useCart();

  return (
    <div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
```

## 📱 Responsive Design

All components are fully responsive and work across all device sizes:

- **Mobile**: Compact cart items, full-width buttons
- **Tablet**: Balanced layout with proper spacing
- **Desktop**: Full-featured layout with sidebar

## 🎯 Best Practices

### 1. Always Use Hooks

```tsx
// ✅ Good
const { addToCart } = useCart();

// ❌ Avoid direct store access
const addToCart = useCartStore.getState().addToCart;
```

### 2. Handle Loading States

```tsx
function AddToCartButton({ product }) {
  const { addToCart, isAdding } = useAddToCart();

  return (
    <Button onClick={() => addToCart(product)} disabled={isAdding}>
      {isAdding ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
```

### 3. Validate Before Operations

```tsx
function handleAddToCart(product, quantity) {
  if (quantity <= 0) {
    setError("Quantity must be greater than 0");
    return;
  }

  if (product.inventory.quantity < quantity) {
    setError("Not enough stock available");
    return;
  }

  addToCart({ product, quantity });
}
```

## 🔄 Migration from Local State

If migrating from local state to Zustand:

1. Replace `useState` with `useCart` hook
2. Update component props to use cart state
3. Remove local cart logic
4. Add cart provider to app root
5. Test persistence and state management

## 🎉 Conclusion

This cart management system provides a robust, scalable solution for e-commerce applications. It follows React and Zustand best practices, includes comprehensive TypeScript support, and offers excellent developer experience with extensive customization options.

The system is production-ready and can handle complex scenarios like product variants, inventory management, and promotional codes while maintaining excellent performance and user experience.
