# Refactored Dynamic Configuration System

This guide documents the refactored structure of the dynamic configuration system, following the codebase's feature-based architecture pattern.

## 🏗️ New File Structure

### Settings Feature (`/src/features/settings/`)

```
src/features/settings/
├── types.ts                                    # Settings-specific types
├── hooks/
│   └── use-settings.ts                        # Settings state management hook
└── components/
    ├── general-settings-form.tsx              # General settings form
    ├── theme-settings-form.tsx                # Theme configuration form
    ├── seo-settings-form.tsx                  # SEO settings form
    └── contact-settings-form.tsx              # Contact & social media form
```

### Mega Menu Feature (`/src/features/mega-menu/`)

```
src/features/mega-menu/
├── types.ts                                   # Mega menu-specific types
├── hooks/
│   └── use-mega-menu.ts                      # Mega menu state management hook
└── components/
    ├── section-form.tsx                      # Section management form
    ├── category-form.tsx                     # Category management form
    └── menu-item-form.tsx                    # Menu item management form
```

### Shared Components (`/src/components/`)

```
src/components/
├── theme/
│   └── theme-preview.tsx                     # Theme preview component
└── mega-menu/
    └── mega-menu-preview.tsx                 # Mega menu preview component
```

## 🔧 Refactored Pages

### Settings Page (`/src/app/dashboard/settings/page.tsx`)

**Before**: 477 lines of monolithic code
**After**: 111 lines using feature components

```typescript
// Clean, focused page component
export default function SettingsPage() {
  const {
    settings,
    isLoading,
    isSaving,
    fetchSettings,
    saveSettings,
    updateSettings,
    updateTheme,
    updateSeo,
    updateContact,
    updateSocial,
  } = useSettings();

  // Simple save handler
  const handleSave = async () => {
    if (!settings) return;
    await saveSettings(settings);
  };

  // Clean tab structure using feature components
  return (
    <Tabs defaultValue="general">
      <TabsContent value="general">
        <GeneralSettingsForm settings={settings} onUpdate={updateSettings} />
      </TabsContent>
      <TabsContent value="theme">
        <ThemeSettingsForm settings={settings} onUpdateTheme={updateTheme} />
        <ThemePreview settings={settings} />
      </TabsContent>
      // ... other tabs
    </Tabs>
  );
}
```

### Mega Menu Page (`/src/app/dashboard/mega-menu/page.tsx`)

**Before**: 529 lines of complex nested logic
**After**: 110 lines using feature components

```typescript
// Clean, focused page component
export default function MegaMenuPage() {
  const {
    megaMenuData,
    isLoading,
    isSaving,
    expandedSections,
    expandedCategories,
    // ... all mega menu operations
  } = useMegaMenu();

  // Simple save handler
  const handleSave = async () => {
    if (!megaMenuData) return;
    await saveMegaMenuData(megaMenuData);
  };

  // Clean section rendering using feature components
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {megaMenuData.items.map((section) => (
          <SectionForm
            key={section.id}
            section={section}
            onUpdate={(updates) => updateSection(section.id, updates)}
            onDelete={() => deleteSection(section.id)}
            // ... other props
          />
        ))}
      </div>
      <div className="lg:col-span-1">
        <MegaMenuPreview megaMenuData={megaMenuData} />
      </div>
    </div>
  );
}
```

## 🎯 Benefits of Refactoring

### 1. **Separation of Concerns**
- **Pages**: Focus only on layout and high-level orchestration
- **Features**: Contain all related logic, components, and types
- **Components**: Reusable, focused, single-responsibility components

### 2. **Improved Maintainability**
- **Modular Structure**: Each feature is self-contained
- **Clear Dependencies**: Easy to understand component relationships
- **Easier Testing**: Components can be tested in isolation

### 3. **Better Code Organization**
- **Feature-Based**: Related functionality grouped together
- **Consistent Patterns**: Follows established codebase conventions
- **Scalable**: Easy to add new features following the same pattern

### 4. **Enhanced Developer Experience**
- **Smaller Files**: Easier to navigate and understand
- **Clear Imports**: Obvious where functionality comes from
- **Type Safety**: Comprehensive TypeScript support throughout

## 📁 Component Breakdown

### Settings Components

#### `GeneralSettingsForm`
- **Purpose**: Basic site information configuration
- **Props**: `settings`, `onUpdate`
- **Features**: Site name, description, currency, language, timezone

#### `ThemeSettingsForm`
- **Purpose**: Theme color configuration
- **Props**: `settings`, `onUpdateTheme`
- **Features**: Primary/secondary color pickers, live preview

#### `SeoSettingsForm`
- **Purpose**: SEO metadata configuration
- **Props**: `settings`, `onUpdateSeo`
- **Features**: Meta title, description, keywords management

#### `ContactSettingsForm`
- **Purpose**: Contact and social media configuration
- **Props**: `settings`, `onUpdateContact`, `onUpdateSocial`
- **Features**: Contact details, social media links

### Mega Menu Components

#### `SectionForm`
- **Purpose**: Section-level management
- **Props**: `section`, `onUpdate`, `onDelete`, `onAddCategory`, etc.
- **Features**: Section title/URL, category management, expand/collapse

#### `CategoryForm`
- **Purpose**: Category-level management
- **Props**: `category`, `onUpdate`, `onDelete`, `onAddItem`, etc.
- **Features**: Category title, menu item management, expand/collapse

#### `MenuItemForm`
- **Purpose**: Individual menu item management
- **Props**: `item`, `onUpdate`, `onDelete`
- **Features**: Label, URL, description configuration

## 🔄 State Management

### Settings Hook (`useSettings`)
```typescript
const {
  settings,           // Current settings state
  isLoading,          // Loading state
  isSaving,           // Saving state
  fetchSettings,      // Fetch from API
  saveSettings,       // Save to API
  updateSettings,     // Update general settings
  updateTheme,        // Update theme settings
  updateSeo,          // Update SEO settings
  updateContact,      // Update contact settings
  updateSocial,       // Update social settings
} = useSettings();
```

### Mega Menu Hook (`useMegaMenu`)
```typescript
const {
  megaMenuData,       // Current menu data
  isLoading,          // Loading state
  isSaving,           // Saving state
  expandedSections,   // Expanded section IDs
  expandedCategories, // Expanded category IDs
  fetchMegaMenuData,  // Fetch from API
  saveMegaMenuData,   // Save to API
  addSection,         // Add new section
  updateSection,      // Update section
  deleteSection,      // Delete section
  addCategory,        // Add category to section
  updateCategory,     // Update category
  deleteCategory,     // Delete category
  addMenuItem,        // Add item to category
  updateMenuItem,     // Update menu item
  deleteMenuItem,     // Delete menu item
  toggleSection,      // Toggle section expansion
  toggleCategory,     // Toggle category expansion
} = useMegaMenu();
```

## 🎨 Preview Components

### `ThemePreview`
- **Location**: `/src/components/theme/theme-preview.tsx`
- **Purpose**: Live preview of theme settings
- **Features**: Header preview, button preview, color palette, site info

### `MegaMenuPreview`
- **Location**: `/src/components/mega-menu/mega-menu-preview.tsx`
- **Purpose**: Live preview of menu structure
- **Features**: Desktop/mobile menu preview, structure stats, quick actions

## 🚀 Usage Examples

### Adding New Settings Tab
```typescript
// 1. Create new form component
export function AdvancedSettingsForm({ settings, onUpdate }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Form fields */}
      </CardContent>
    </Card>
  );
}

// 2. Add to settings hook
const updateAdvanced = (updates) => {
  setSettings({ ...settings, advanced: { ...settings.advanced, ...updates } });
};

// 3. Add to page
<TabsContent value="advanced">
  <AdvancedSettingsForm settings={settings} onUpdate={updateAdvanced} />
</TabsContent>
```

### Adding New Menu Item Type
```typescript
// 1. Extend menu item type
interface CustomMenuItem extends MenuItem {
  icon?: string;
  badge?: string;
}

// 2. Create custom form component
export function CustomMenuItemForm({ item, onUpdate, onDelete }) {
  return (
    <Card>
      {/* Custom form fields for icon, badge, etc. */}
    </Card>
  );
}

// 3. Integrate into category form
<CustomMenuItemForm
  item={item}
  onUpdate={(updates) => onUpdateItem(item.id, updates)}
  onDelete={() => onDeleteItem(item.id)}
/>
```

## 📊 Code Metrics

### Before Refactoring
- **Settings Page**: 477 lines
- **Mega Menu Page**: 529 lines
- **Total**: 1,006 lines in 2 files
- **Maintainability**: Low (monolithic)
- **Reusability**: Low (tightly coupled)

### After Refactoring
- **Settings Page**: 111 lines
- **Mega Menu Page**: 110 lines
- **Feature Components**: 8 focused components
- **Total**: ~800 lines across 12 files
- **Maintainability**: High (modular)
- **Reusability**: High (loosely coupled)

## 🔧 Migration Guide

### For Developers
1. **Import Changes**: Update imports to use feature components
2. **Props Changes**: Use new prop interfaces
3. **State Management**: Use feature hooks instead of local state
4. **Component Structure**: Follow new component patterns

### For New Features
1. **Create Feature Directory**: `/src/features/feature-name/`
2. **Add Types**: Define feature-specific types
3. **Create Hook**: Implement state management logic
4. **Build Components**: Create focused, reusable components
5. **Update Page**: Use feature components in page

## 🎯 Best Practices

### Component Design
- **Single Responsibility**: Each component has one clear purpose
- **Props Interface**: Define clear, typed prop interfaces
- **Composition**: Build complex UIs from simple components
- **Reusability**: Design components to be reusable

### State Management
- **Feature Hooks**: Encapsulate all feature logic in custom hooks
- **Clear Interfaces**: Define clear interfaces for state and actions
- **Error Handling**: Include comprehensive error handling
- **Loading States**: Manage loading and saving states

### File Organization
- **Feature-Based**: Group related functionality together
- **Consistent Naming**: Use consistent naming conventions
- **Clear Exports**: Export only what's needed
- **Type Safety**: Use TypeScript throughout

## 🚀 Future Enhancements

### Planned Improvements
- **Form Validation**: Add comprehensive form validation
- **Auto-save**: Implement auto-save functionality
- **Undo/Redo**: Add undo/redo capabilities
- **Bulk Operations**: Support bulk editing operations
- **Import/Export**: Add configuration import/export

### Technical Improvements
- **Performance**: Optimize for large datasets
- **Caching**: Implement intelligent caching
- **Offline Support**: Add offline functionality
- **Real-time Updates**: WebSocket integration
- **Analytics**: Add usage analytics

This refactored structure provides a solid foundation for the dynamic configuration system while maintaining the flexibility and maintainability needed for future growth.
