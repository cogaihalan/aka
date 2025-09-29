# Global App Context Provider Guide

## Overview

This guide explains the new global app context provider system that centralizes shared data like categories, settings, and site configuration across the storefront application.

## Why This Was Needed

As an experienced developer, you correctly identified that the storefront was missing a crucial piece - a global app context provider. The previous architecture had several issues:

### Problems with Previous Architecture:

- **No centralized data management** for shared data like categories
- **Hardcoded data** in constants files (navigation.ts)
- **Repeated API calls** - each component fetched its own data
- **No caching** for frequently accessed data
- **Inconsistent data** across components
- **Poor performance** due to redundant API calls

### Benefits of New Architecture:

- ✅ **Single source of truth** for app-wide data
- ✅ **Centralized caching** with Zustand persistence
- ✅ **Better performance** - fetch once, use everywhere
- ✅ **Consistent data** across all components
- ✅ **Easier maintenance** - update data in one place
- ✅ **Better developer experience** with typed hooks

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    App Provider Layer                       │
├─────────────────────────────────────────────────────────────┤
│  AppProvider (React Context)                               │
│  ├── useApp() - Main hook for all app data                 │
│  ├── useCategories() - Category-specific data              │
│  ├── useSettings() - Site settings                        │
│  └── useAppLoading() - Loading states                      │
├─────────────────────────────────────────────────────────────┤
│                    Store Layer                              │
├─────────────────────────────────────────────────────────────┤
│  useAppStore (Zustand Store)                               │
│  ├── Categories management                                 │
│  ├── Settings management                                   │
│  ├── Caching & persistence                                 │
│  └── Loading & error states                                │
├─────────────────────────────────────────────────────────────┤
│                    API Layer                               │
├─────────────────────────────────────────────────────────────┤
│  categoriesService                                          │
│  ├── HTTP caching                                          │
│  ├── Fallback to mock data                                 │
│  └── Error handling                                        │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
src/
├── stores/
│   └── app-store.ts                    # Zustand store for app data
├── components/
│   └── providers/
│       └── app-provider.tsx             # React context provider
├── hooks/
│   └── use-dynamic-navigation.ts       # Dynamic navigation hook
├── lib/
│   └── api/
│       └── services/
│           └── storefront/
│               └── categories.ts         # Categories API service
└── features/
    └── storefront/
        └── components/
            └── dynamic-category-listing.tsx  # Dynamic category component
```

## Key Components

### 1. App Store (`src/stores/app-store.ts`)

**Purpose**: Centralized state management for app-wide data using Zustand.

**Features**:

- Categories management with tree structure
- Site settings management
- Persistent caching with localStorage
- Loading and error states
- Optimistic updates

**Key Methods**:

```typescript
// Categories
setCategories(categories: Category[])
getCategoryBySlug(slug: string): Category | undefined
getCategoryById(id: string): Category | undefined
getChildCategories(parentId: string): Category[]
getRootCategories(): Category[]

// Settings
setSettings(settings: SiteSettings)

// Actions
initializeApp(): Promise<void>
refreshCategories(): Promise<void>
refreshSettings(): Promise<void>
```

### 2. App Provider (`src/components/providers/app-provider.tsx`)

**Purpose**: React context wrapper that provides app data to components.

**Features**:

- Automatic initialization on mount
- Convenience hooks for specific data
- Error boundary integration
- TypeScript support

**Hooks Available**:

```typescript
// Main hook
const { categories, settings, isLoading, error } = useApp();

// Specific hooks
const { categories, getCategoryBySlug } = useCategories();
const { settings } = useSettings();
const { isLoading, error } = useAppLoading();
```

### 3. Categories API Service (`src/lib/api/services/storefront/categories.ts`)

**Purpose**: HTTP client for categories with caching and fallback.

**Features**:

- HTTP caching with configurable timeout
- Fallback to mock data on API failure
- TypeScript interfaces
- Error handling

**Methods**:

```typescript
getCategories(filters?: CategoryFilters): Promise<CategoriesResponse>
getCategoryById(id: string): Promise<Category | null>
getCategoryBySlug(slug: string): Promise<Category | null>
getCategoriesTree(): Promise<Category[]>
clearCache(): void
```

### 4. Dynamic Navigation Hook (`src/hooks/use-dynamic-navigation.ts`)

**Purpose**: Provides dynamic navigation data from app context.

**Features**:

- Dynamic filter groups from categories
- Loading states
- Fallback data while loading
- TypeScript support

**Returns**:

```typescript
{
  sortOptions: SortOption[],
  filterGroups: FilterGroup[],
  defaultFilters: NavigationFilters,
  categories: Category[],
  isLoading: boolean
}
```

## Usage Examples

### 1. Using Categories in Components

```typescript
import { useCategories } from "@/components/providers/app-provider";

function CategoryList() {
  const { categories, isLoading, getCategoryBySlug } = useCategories();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <p>{category.productCount} products</p>
        </div>
      ))}
    </div>
  );
}
```

### 2. Using Settings

```typescript
import { useSettings } from "@/components/providers/app-provider";

function SiteHeader() {
  const { settings } = useSettings();

  return (
    <header>
      <h1>{settings?.siteName}</h1>
      <p>{settings?.siteDescription}</p>
    </header>
  );
}
```

### 3. Using Dynamic Navigation

```typescript
import { useDynamicNavigation } from "@/hooks/use-dynamic-navigation";

function FilterSidebar() {
  const { filterGroups, isLoading } = useDynamicNavigation();

  return (
    <div>
      {filterGroups.map(group => (
        <FilterGroup key={group.id} group={group} />
      ))}
    </div>
  );
}
```

## Integration Points

### 1. Provider Integration

The `AppProvider` is integrated into the main layout at `src/components/layout/providers.tsx`:

```typescript
<ClerkProvider>
  <AppProvider>  {/* ← New global provider */}
    <AuthSyncProvider>
      <WishlistAuthProvider>
        <CartProvider>
          <QuickViewProvider>
            {children}
          </QuickViewProvider>
        </CartProvider>
      </WishlistAuthProvider>
    </AuthSyncProvider>
  </AppProvider>
</ClerkProvider>
```

### 2. Navigation Updates

The layered navigation component now uses dynamic data:

```typescript
// Before: Hardcoded data
import { FILTER_GROUPS } from "@/constants/navigation";

// After: Dynamic data
import { useDynamicNavigation } from "@/hooks/use-dynamic-navigation";
const { filterGroups } = useDynamicNavigation();
```

### 3. Category Listing

The category listing page now uses dynamic data:

```typescript
// Before: Hardcoded categories array
const categories = [/* hardcoded data */];

// After: Dynamic component
import DynamicCategoryListing from "./dynamic-category-listing";
return <DynamicCategoryListing />;
```

## Performance Benefits

### 1. Reduced API Calls

- **Before**: Each component fetched categories independently
- **After**: Single API call on app initialization, cached globally

### 2. Better Caching

- **Before**: No caching, repeated API calls
- **After**: Persistent caching with localStorage, configurable cache timeout

### 3. Optimized Re-renders

- **Before**: Components re-rendered on every data fetch
- **After**: Zustand's selective subscriptions prevent unnecessary re-renders

## Migration Guide

### 1. Replace Hardcoded Data

**Before**:

```typescript
import { FILTER_GROUPS } from "@/constants/navigation";
// Use FILTER_GROUPS directly
```

**After**:

```typescript
import { useDynamicNavigation } from "@/hooks/use-dynamic-navigation";
const { filterGroups } = useDynamicNavigation();
// Use filterGroups from context
```

### 2. Update Category Components

**Before**:

```typescript
const categories = [
  /* hardcoded array */
];
```

**After**:

```typescript
import { useCategories } from "@/components/providers/app-provider";
const { categories } = useCategories();
```

### 3. Handle Loading States

**Before**:

```typescript
// No loading states
```

**After**:

```typescript
const { isLoading, error } = useAppLoading();
if (isLoading) return <LoadingSkeleton />;
if (error) return <ErrorMessage />;
```

## Best Practices

### 1. Use Specific Hooks

```typescript
// ✅ Good - specific hook
const { categories } = useCategories();

// ❌ Avoid - main hook when specific is available
const { categories } = useApp();
```

### 2. Handle Loading States

```typescript
const { categories, isLoading } = useCategories();
if (isLoading) return <Skeleton />;
```

### 3. Error Handling

```typescript
const { error } = useAppLoading();
if (error) return <ErrorMessage error={error} />;
```

### 4. Optimize Re-renders

```typescript
// ✅ Good - memoize expensive operations
const categoryOptions = useMemo(
  () => categories.map((cat) => ({ id: cat.id, label: cat.name })),
  [categories]
);
```

## Future Enhancements

### 1. Real API Integration

- Replace mock data with actual API endpoints
- Add authentication headers
- Implement real-time updates

### 2. Advanced Caching

- Add cache invalidation strategies
- Implement background refresh
- Add cache warming

### 3. Settings Management

- Add admin interface for settings
- Implement settings validation
- Add settings versioning

### 4. Performance Monitoring

- Add performance metrics
- Implement error tracking
- Add usage analytics

## Conclusion

The new global app context provider system provides:

- **Better Performance**: Single API calls with intelligent caching
- **Improved Developer Experience**: Type-safe hooks and centralized data
- **Enhanced User Experience**: Faster page loads and consistent data
- **Easier Maintenance**: Single source of truth for app-wide data
- **Future-Proof Architecture**: Extensible design for new features

This architecture follows React and Next.js best practices while providing a solid foundation for scaling the storefront application.
