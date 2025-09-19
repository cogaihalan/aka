# Layered Navigation System

This document describes the comprehensive layered navigation system implemented for the products and category pages.

## Overview

The layered navigation system provides advanced filtering, searching, and sorting capabilities with URL state management, making it easy for users to find products and share filtered views.

## Features

### 🔍 Search & Filter
- **Text Search**: Search products by name, description, or category
- **Price Range**: Slider-based price filtering
- **Category Filter**: Multi-select category filtering
- **Brand Filter**: Multi-select brand filtering
- **Color Filter**: Visual color selection with swatches
- **Size Filter**: Multi-select size filtering
- **Rating Filter**: Customer rating-based filtering
- **Availability Filter**: In-stock, on-sale, new arrivals

### 📊 Sort Options
- Featured (default)
- Price: Low to High
- Price: High to Low
- Highest Rated
- Newest First
- Name: A to Z
- Name: Z to A

### 📱 Responsive Design
- **Desktop**: Sidebar navigation with 3-column product grid
- **Mobile**: Sheet-based navigation with collapsible filters
- **Tablet**: Adaptive layout with touch-friendly controls

### 🔗 URL State Management
- All filter selections are reflected in the URL
- Shareable filtered views
- Browser back/forward navigation support
- Deep linking to specific filter combinations

## Architecture

### Core Components

#### 1. Navigation Hooks
- **`useNavigation`**: Manages URL state and filter updates
- **`useProductFilters`**: Handles client-side filtering logic

#### 2. Navigation Components
- **`LayeredNavigation`**: Main filter sidebar component
- **`NavigationSidebar`**: Desktop sidebar wrapper
- **`MobileNavigation`**: Mobile sheet wrapper
- **`SortControls`**: Sort and view mode controls

#### 3. Type Definitions
- **`NavigationFilters`**: Filter state interface
- **`FilterGroup`**: Filter group configuration
- **`SortOption`**: Sort option configuration

### File Structure

```
src/
├── types/
│   └── navigation.ts              # TypeScript interfaces
├── constants/
│   ├── navigation.ts              # Filter groups and sort options
│   └── mock-products.ts           # Mock data for development
├── hooks/
│   ├── use-navigation.ts          # URL state management
│   └── use-product-filters.ts     # Client-side filtering
└── components/
    └── navigation/
        ├── index.ts               # Component exports
        ├── layered-navigation.tsx # Main filter component
        ├── navigation-sidebar.tsx # Desktop sidebar
        ├── mobile-navigation.tsx  # Mobile sheet
        └── sort-controls.tsx      # Sort and view controls
```

## Usage

### Basic Implementation

```tsx
import { useNavigation } from '@/hooks/use-navigation';
import { useProductFilters } from '@/hooks/use-product-filters';
import { NavigationSidebar, SortControls } from '@/components/navigation';

function ProductPage() {
  const {
    state,
    updateFilters,
    updateViewMode,
    resetFilters,
    getActiveFiltersCount
  } = useNavigation();

  const { filteredProducts, filterCounts } = useProductFilters({
    products,
    filters: state.filters
  });

  return (
    <div className="flex gap-6">
      <NavigationSidebar
        filters={state.filters}
        onFiltersChange={updateFilters}
        onResetFilters={resetFilters}
        filterCounts={filterCounts}
        activeFiltersCount={getActiveFiltersCount()}
      />
      
      <div className="flex-1">
        <SortControls
          sortBy={state.filters.sort}
          viewMode={state.viewMode}
          onSortChange={(sort) => updateFilters({ sort })}
          onViewModeChange={updateViewMode}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### URL Structure

The navigation system automatically manages URL parameters:

```
/products?search=iphone&sort=price-low&minPrice=500&maxPrice=1000&categories=electronics&brands=apple&colors=black
```

**Parameters:**
- `search`: Text search query
- `sort`: Sort option (featured, price-low, price-high, rating, newest, name-asc, name-desc)
- `minPrice`/`maxPrice`: Price range
- `categories`: Array of selected categories
- `brands`: Array of selected brands
- `colors`: Array of selected colors
- `sizes`: Array of selected sizes
- `ratings`: Array of selected ratings
- `availability`: Array of availability options
- `view`: View mode (grid, list)
- `page`: Current page number
- `limit`: Items per page

## Configuration

### Adding New Filter Groups

1. **Update Types** (`src/types/navigation.ts`):
```tsx
export interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'color';
  options: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
}
```

2. **Add Filter Group** (`src/constants/navigation.ts`):
```tsx
export const FILTER_GROUPS: FilterGroup[] = [
  // ... existing groups
  {
    id: 'material',
    label: 'Material',
    type: 'checkbox',
    options: [
      { id: 'cotton', label: 'Cotton', value: 'cotton', count: 25 },
      { id: 'polyester', label: 'Polyester', value: 'polyester', count: 18 },
      // ... more options
    ]
  }
];
```

3. **Update Filter Logic** (`src/hooks/use-product-filters.ts`):
```tsx
// Add material filter
if (filters.materials && filters.materials.length > 0) {
  filtered = filtered.filter(product =>
    (product as any).materials && 
    (product as any).materials.some((material: string) => 
      filters.materials!.includes(material.toLowerCase())
    )
  );
}
```

### Adding New Sort Options

1. **Update Sort Options** (`src/constants/navigation.ts`):
```tsx
export const SORT_OPTIONS: SortOption[] = [
  // ... existing options
  {
    id: 'popularity',
    label: 'Most Popular',
    value: 'popularity',
    field: 'popularity',
    order: 'desc'
  }
];
```

2. **Update Sort Logic** (`src/hooks/use-product-filters.ts`):
```tsx
case 'popularity':
  return sorted.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
```

## Mock Data

The system includes comprehensive mock data for development and testing:

- **24 Products** across 6 categories
- **16 Brands** with realistic product distribution
- **Multiple Colors, Sizes, and Ratings**
- **Price Ranges** from $12.99 to $2,499.99
- **Realistic Product Data** with descriptions, ratings, and availability

## Performance Considerations

### Client-Side Filtering
- Uses `useMemo` for efficient filtering and sorting
- Debounced search input (500ms delay)
- Optimized filter count calculations

### URL Management
- Minimal URL updates to prevent excessive history entries
- Efficient parameter parsing and serialization
- Scroll position preservation during navigation

### Mobile Optimization
- Touch-friendly filter controls
- Collapsible filter groups
- Optimized sheet animations
- Reduced bundle size with code splitting

## Browser Support

- **Modern Browsers**: Full feature support
- **IE11+**: Basic functionality with polyfills
- **Mobile Safari**: Optimized touch interactions
- **Chrome/Firefox**: Full performance optimization

## Accessibility

- **Keyboard Navigation**: Full keyboard support for all controls
- **Screen Readers**: Proper ARIA labels and descriptions
- **Focus Management**: Logical tab order and focus indicators
- **Color Contrast**: WCAG AA compliant color schemes
- **Touch Targets**: Minimum 44px touch targets on mobile

## Testing

### Unit Tests
- Filter logic validation
- URL parameter parsing
- Sort algorithm verification
- Component prop handling

### Integration Tests
- End-to-end filter workflows
- URL state synchronization
- Mobile/desktop responsive behavior
- Performance benchmarks

## Future Enhancements

### Planned Features
- **Saved Filters**: User-specific filter presets
- **Filter Analytics**: Track popular filter combinations
- **Advanced Search**: Boolean operators and field-specific search
- **Visual Filters**: Image-based category selection
- **Price Alerts**: Notify users of price changes
- **Comparison Mode**: Side-by-side product comparison

### Performance Improvements
- **Virtual Scrolling**: For large product catalogs
- **Infinite Scroll**: Replace pagination with infinite loading
- **Filter Caching**: Cache filter results for better performance
- **Progressive Loading**: Load filters as needed

## Troubleshooting

### Common Issues

1. **Filters Not Updating URL**
   - Check if `updateFilters` is properly connected
   - Verify URL parameter parsing logic

2. **Mobile Navigation Not Working**
   - Ensure Sheet component is properly imported
   - Check for CSS conflicts with z-index

3. **Performance Issues**
   - Verify `useMemo` dependencies
   - Check for unnecessary re-renders
   - Profile filter count calculations

4. **TypeScript Errors**
   - Update type definitions for new filter fields
   - Ensure proper type casting for product properties

### Debug Mode

Enable debug logging by setting:
```tsx
const { state, updateFilters } = useNavigation({ debug: true });
```

This will log all filter changes and URL updates to the console.

## Contributing

When contributing to the layered navigation system:

1. **Follow TypeScript**: Maintain strict type safety
2. **Test Responsively**: Verify mobile and desktop behavior
3. **Update Documentation**: Keep this guide current
4. **Performance First**: Optimize for large product catalogs
5. **Accessibility**: Ensure WCAG compliance

## License

This layered navigation system is part of the AKA Store project and follows the same licensing terms.
