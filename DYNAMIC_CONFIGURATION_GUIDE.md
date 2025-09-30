# Dynamic Configuration System

This guide explains the new dynamic configuration system that allows administrators to configure site settings and mega-menu structure through the admin dashboard, making the website fully dynamic instead of hardcoded.

## 🚀 Features Implemented

### 1. Dynamic Site Settings
- **Theme Configuration**: Primary and secondary colors with live preview
- **General Settings**: Site name, description, currency, language, timezone
- **SEO Settings**: Meta title, description, keywords
- **Contact Information**: Email, phone, address, social media links
- **Real-time Preview**: See changes before saving

### 2. Dynamic Mega Menu Configuration
- **Hierarchical Structure**: Sections → Categories → Menu Items
- **Visual Editor**: Drag-and-drop interface for menu management
- **Live Preview**: See how the menu will look on the storefront
- **Bulk Operations**: Add, edit, delete sections, categories, and items
- **URL Management**: Configure all menu links dynamically

### 3. API Integration
- **RESTful APIs**: `/api/settings` and `/api/mega-menu` endpoints
- **CRUD Operations**: Full create, read, update, delete functionality
- **Error Handling**: Graceful fallbacks to default values
- **Data Persistence**: Settings stored and retrieved from API

## 📁 File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── settings/
│   │   │   └── route.ts              # Site settings API
│   │   └── mega-menu/
│   │       └── route.ts              # Mega menu API
│   └── dashboard/
│       ├── settings/
│       │   └── page.tsx              # Site settings admin page
│       └── mega-menu/
│           └── page.tsx              # Mega menu admin page
├── components/
│   ├── theme-preview.tsx             # Theme preview component
│   └── mega-menu-preview.tsx         # Mega menu preview component
├── stores/
│   └── app-store.ts                  # Updated with dynamic API calls
└── types/
    ├── app.ts                        # Site settings types
    └── menu.ts                       # Menu structure types
```

## 🔧 API Endpoints

### Site Settings API (`/api/settings`)

#### GET `/api/settings`
Returns current site settings.

**Response:**
```json
{
  "success": true,
  "data": {
    "siteName": "AKA Store",
    "siteDescription": "Your premium shopping destination",
    "currency": "VND",
    "currencySymbol": "₫",
    "timezone": "UTC",
    "language": "vi",
    "theme": {
      "primaryColor": "#000000",
      "secondaryColor": "#6B7280"
    },
    "seo": {
      "metaTitle": "AKA Store - Premium Shopping",
      "metaDescription": "Discover amazing products at AKA Store",
      "keywords": ["shopping", "ecommerce", "products"]
    },
    "social": {
      "facebook": "https://facebook.com/akastore",
      "twitter": "https://twitter.com/akastore"
    },
    "contact": {
      "email": "support@akastore.com",
      "phone": "+1 (555) 123-4567",
      "address": "123 Store Street, City, State 12345"
    }
  }
}
```

#### PUT `/api/settings`
Updates site settings.

**Request Body:**
```json
{
  "settings": {
    "siteName": "Updated Store Name",
    "theme": {
      "primaryColor": "#FF0000"
    }
  }
}
```

### Mega Menu API (`/api/mega-menu`)

#### GET `/api/mega-menu`
Returns current mega menu structure.

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "products",
        "title": "Products",
        "href": "/products",
        "categories": [
          {
            "id": "electronics",
            "title": "Electronics",
            "items": [
              {
                "id": "smartphones",
                "label": "Smartphones",
                "href": "/products/smartphones",
                "description": "Latest smartphones and accessories"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

#### PUT `/api/mega-menu`
Updates mega menu structure.

## 🎨 Admin Dashboard Pages

### Site Settings Page (`/dashboard/settings`)

**Features:**
- **General Tab**: Basic site information, currency, language
- **Theme Tab**: Color configuration with live preview
- **SEO Tab**: Meta tags and search optimization
- **Contact Tab**: Contact details and social media links
- **Real-time Preview**: See changes as you type

**Navigation:**
- Access via sidebar: Settings → Site Settings
- Keyboard shortcut: `S` + `S`

### Mega Menu Page (`/dashboard/mega-menu`)

**Features:**
- **Hierarchical Editor**: Manage sections, categories, and items
- **Visual Interface**: Collapsible sections for easy navigation
- **Live Preview**: See menu structure in real-time
- **Bulk Operations**: Add, edit, delete multiple items
- **URL Management**: Configure all menu links

**Navigation:**
- Access via sidebar: Settings → Mega Menu
- Keyboard shortcut: `S` + `M`

## 🔄 Data Flow

### 1. Admin Configuration
```
Admin Dashboard → API Endpoints → Data Storage
```

### 2. Storefront Display
```
Storefront → App Store → API Endpoints → Dynamic Data
```

### 3. Fallback System
```
API Error → Fallback to Default Values → Graceful Degradation
```

## 🛠️ Implementation Details

### App Store Integration

The app store now uses dynamic API calls instead of hardcoded data:

```typescript
// Before (hardcoded)
refreshSettings: async () => {
  setSettings(DEFAULT_SETTINGS);
}

// After (dynamic)
refreshSettings: async () => {
  const response = await fetch("/api/settings");
  const data = await response.json();
  if (data.success) {
    setSettings(data.data);
  } else {
    setSettings(DEFAULT_SETTINGS); // Fallback
  }
}
```

### Error Handling

- **API Failures**: Graceful fallback to default values
- **Network Issues**: Retry mechanisms with user feedback
- **Validation**: Client and server-side validation
- **User Feedback**: Toast notifications for success/error states

### Performance Optimizations

- **Caching**: Settings cached in app store
- **Lazy Loading**: Components loaded on demand
- **Debounced Updates**: Prevent excessive API calls
- **Optimistic Updates**: UI updates before API confirmation

## 🚀 Usage Instructions

### For Administrators

1. **Access Settings**:
   - Navigate to `/dashboard/settings`
   - Or use keyboard shortcut `S` + `S`

2. **Configure Theme**:
   - Go to "Theme" tab
   - Choose primary and secondary colors
   - See live preview of changes
   - Click "Save Changes"

3. **Configure Mega Menu**:
   - Navigate to `/dashboard/mega-menu`
   - Or use keyboard shortcut `S` + `M`
   - Add/edit sections, categories, and menu items
   - Use live preview to see changes
   - Click "Save Changes"

### For Developers

1. **API Integration**:
   ```typescript
   // Fetch settings
   const response = await fetch("/api/settings");
   const { data } = await response.json();
   
   // Update settings
   await fetch("/api/settings", {
     method: "PUT",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ settings: newSettings })
   });
   ```

2. **Store Integration**:
   ```typescript
   // Use in components
   const { settings, refreshSettings } = useAppStore();
   
   // Refresh data
   await refreshSettings();
   ```

## 🔮 Future Enhancements

### Planned Features
- **Database Integration**: Replace mock storage with real database
- **Version Control**: Track settings changes over time
- **Import/Export**: Backup and restore configurations
- **Multi-language**: Support for multiple languages
- **Advanced Themes**: More theme customization options
- **Menu Analytics**: Track menu usage and performance

### Technical Improvements
- **Real-time Updates**: WebSocket integration for live updates
- **Offline Support**: Work offline with sync when online
- **Advanced Validation**: More sophisticated validation rules
- **Performance Monitoring**: Track API performance and usage

## 🐛 Troubleshooting

### Common Issues

1. **Settings Not Saving**:
   - Check API endpoint is accessible
   - Verify request format and headers
   - Check browser console for errors

2. **Menu Not Updating**:
   - Clear browser cache
   - Check if API is returning correct data
   - Verify menu component is using updated data

3. **Preview Not Working**:
   - Ensure all required props are passed
   - Check component imports
   - Verify data structure matches expected format

### Debug Steps

1. **Check API Response**:
   ```bash
   curl -X GET http://localhost:3000/api/settings
   ```

2. **Check Store State**:
   ```typescript
   console.log(useAppStore.getState().settings);
   ```

3. **Check Component Props**:
   ```typescript
   console.log({ settings, megaMenuData });
   ```

## 📚 Related Documentation

- [App Store Guide](./GLOBAL_APP_CONTEXT_GUIDE.md)
- [API Integration Guide](./API_INTEGRATION_GUIDE.md)
- [Component Documentation](./components/README.md)

## 🤝 Contributing

When adding new configuration options:

1. **Update Types**: Add new fields to `SiteSettings` or `MegaMenuData`
2. **Update API**: Add new fields to API endpoints
3. **Update UI**: Add form fields to admin pages
4. **Update Store**: Add new fields to app store
5. **Update Preview**: Add new fields to preview components
6. **Test**: Verify end-to-end functionality

## 📄 License

This dynamic configuration system is part of the AKA Store project and follows the same licensing terms.
