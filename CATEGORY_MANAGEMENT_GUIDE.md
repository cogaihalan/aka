# Category Management System

A comprehensive category management system for the admin dashboard, built following Magento's schema and data structure patterns.

## Features

### 🏗️ Core Functionality

- **Hierarchical Categories**: Support for unlimited category levels with parent-child relationships
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Product Association**: Manage which products belong to which categories
- **Category Tree View**: Visual hierarchical representation of categories
- **Search & Filtering**: Advanced search and filtering capabilities
- **Bulk Operations**: Bulk delete and reorder categories
- **SEO Management**: Built-in SEO fields for each category

### 📊 Admin Features

- **Category Statistics**: Dashboard with key metrics
- **Product Count Tracking**: See how many products are in each category
- **Status Management**: Active/Inactive and Menu visibility controls
- **Sort Order**: Customizable category ordering
- **Image Support**: Category images with URL validation

### 🔗 Product Integration

- **Category-Product Relationships**: Many-to-many relationship between categories and products
- **Product Management**: Add/remove products from categories
- **Uncategorized Products**: Manage products not assigned to any category
- **Category Selector**: Reusable component for selecting categories

## Architecture

### Database Schema (Magento-inspired)

```typescript
interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  level: number;
  path: string;
  image?: string;
  seo: SEO;
  isActive: boolean;
  sortOrder?: number;
  includeInMenu: boolean;
  children?: Category[];
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}
```

### Key Relationships

- **Parent-Child**: Categories can have parent categories (hierarchical)
- **Category-Product**: Many-to-many relationship via junction table
- **Path System**: Magento-style path tracking (e.g., "1/4/8" for nested categories)

## File Structure

```
src/
├── app/dashboard/categories/
│   ├── page.tsx                    # Main categories listing
│   ├── tree/page.tsx              # Category tree view
│   ├── new/page.tsx               # Create new category
│   └── [id]/
│       ├── page.tsx               # Category details
│       ├── edit/page.tsx          # Edit category
│       └── products/page.tsx      # Manage category products
├── features/categories/
│   ├── components/
│   │   ├── category-listing.tsx   # Category table component
│   │   ├── category-form.tsx      # Category form component
│   │   ├── category-tree.tsx      # Tree view component
│   │   ├── category-products.tsx  # Product management
│   │   ├── category-stats.tsx     # Statistics dashboard
│   │   └── category-tables/
│   │       ├── index.tsx          # Data table wrapper
│   │       └── columns.tsx        # Table column definitions
│   ├── hooks/
│   │   └── use-categories.ts      # Category management hooks
│   └── lib/
│       └── validation.ts          # Validation schemas
├── lib/api/
│   ├── services/admin/categories.ts    # Category API service
│   ├── adapters/mock-category-adapter.ts # Mock data adapter
│   └── types.ts                        # TypeScript types
└── components/
    └── category-selector.tsx      # Reusable category selector
```

## API Endpoints

### Categories

- `GET /api/mock/categories` - List categories with filtering
- `POST /api/mock/categories` - Create new category
- `GET /api/mock/categories/tree` - Get category tree
- `GET /api/mock/categories/[id]` - Get single category
- `PUT /api/mock/categories/[id]` - Update category
- `DELETE /api/mock/categories/[id]` - Delete category

### Category Products

- `GET /api/mock/categories/[id]/products` - Get category products
- `POST /api/mock/categories/[id]/products` - Assign products to category
- `DELETE /api/mock/categories/[id]/products` - Remove products from category

### Statistics

- `GET /api/mock/categories/stats` - Get category statistics
- `GET /api/mock/categories/uncategorized-products` - Get uncategorized products

## Usage Examples

### Creating a Category

```typescript
import { adminCategoryService } from "@/lib/api";

const newCategory = await adminCategoryService.createCategory({
  name: "Electronics",
  slug: "electronics",
  description: "Electronic devices and accessories",
  parentId: undefined, // Root category
  isActive: true,
  includeInMenu: true,
  sortOrder: 1,
  seo: {
    title: "Electronics - Best Electronic Devices",
    description: "Shop the latest electronic devices",
    keywords: ["electronics", "devices", "gadgets"],
  },
});
```

### Managing Category Products

```typescript
// Assign products to category
await adminCategoryService.assignProductsToCategory({
  categoryId: 1,
  productIds: [1, 2, 3],
  positions: { 1: 1, 2: 2, 3: 3 },
});

// Remove products from category
await adminCategoryService.removeProductsFromCategory(1, [1, 2]);
```

### Using the Category Selector

```tsx
import { CategorySelector } from "@/components/category-selector";

function ProductForm() {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  return (
    <CategorySelector
      selectedCategories={selectedCategories}
      onCategoriesChange={setSelectedCategories}
      placeholder="Select product categories..."
      maxSelections={5}
    />
  );
}
```

## Validation

The system includes comprehensive validation:

- **Name**: Required, 1-100 characters, alphanumeric with spaces, hyphens, and ampersands
- **Slug**: Required, 1-100 characters, lowercase letters, numbers, and hyphens only
- **Description**: Optional, max 500 characters
- **SEO Title**: Optional, max 60 characters
- **SEO Description**: Optional, max 160 characters
- **Keywords**: Optional, max 10 keywords, 50 characters each

## Error Handling

- **Error Boundaries**: React error boundaries for graceful error handling
- **Validation Errors**: Comprehensive form validation with user-friendly messages
- **API Errors**: Proper error handling for all API operations
- **Loading States**: Loading indicators for all async operations

## Navigation Integration

Categories are integrated into the admin sidebar navigation:

```typescript
{
  title: "Categories",
  url: "/dashboard/categories",
  icon: "folder",
  shortcut: ["c", "c"],
  items: [
    {
      title: "All Categories",
      url: "/dashboard/categories",
      shortcut: ["c", "a"],
    },
    {
      title: "Category Tree",
      url: "/dashboard/categories/tree",
      shortcut: ["c", "t"],
    },
  ],
}
```

## Best Practices

1. **Hierarchical Design**: Use the tree structure for logical category organization
2. **SEO Optimization**: Always fill in SEO fields for better search visibility
3. **Product Organization**: Assign products to relevant categories for better organization
4. **Menu Visibility**: Use `includeInMenu` to control category visibility in navigation
5. **Sort Order**: Use `sortOrder` to control category display order
6. **Validation**: Always validate user input before saving
7. **Error Handling**: Implement proper error boundaries and user feedback

## Future Enhancements

- **Category Images**: Upload and manage category images
- **Category Templates**: Predefined category structures
- **Bulk Import/Export**: CSV import/export functionality
- **Category Analytics**: Performance metrics and insights
- **Multi-language Support**: Internationalization for category names
- **Category Permissions**: Role-based access control
- **Category Scheduling**: Publish/unpublish categories at specific times

## Dependencies

- **React Hook Form**: Form management and validation
- **Zod**: Schema validation
- **TanStack Table**: Data table functionality
- **Lucide React**: Icons
- **Tailwind CSS**: Styling
- **Next.js**: Framework and routing

This category management system provides a solid foundation for organizing products in a hierarchical structure, following e-commerce best practices and Magento's proven schema design.
