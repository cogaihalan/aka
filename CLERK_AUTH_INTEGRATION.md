# Clerk Authentication Integration Guide

This document provides a comprehensive guide to the Clerk authentication system integrated into the AKA Store e-commerce platform.

## Overview

The authentication system provides:
- **Role-based access control (RBAC)** with Admin and User roles
- **Permission-based authorization** for granular access control
- **Secure API protection** with middleware and decorators
- **Dashboard protection** for admin-only access
- **Storefront access** for all authenticated users
- **Performance optimization** with caching and state management

## Architecture

### Core Components

1. **Types & Interfaces** (`src/types/auth.ts`)
   - User roles and permissions
   - API response types
   - Error handling types

2. **Auth Utilities** (`src/lib/auth/utils.ts`)
   - User conversion functions
   - Permission checking utilities
   - Route protection configuration

3. **API Protection** (`src/lib/auth/api-protection.ts`)
   - Decorators for API route protection
   - Middleware for authentication
   - Error handling

4. **Hooks** (`src/hooks/use-auth.ts`)
   - React hooks for authentication state
   - Permission checking hooks
   - Role validation hooks

5. **Components** (`src/components/auth/`)
   - Role guards for UI protection
   - User management interface
   - Auth dropdown with role-based navigation

## User Roles & Permissions

### Roles

- **Admin**: Full access to dashboard and all features
- **User**: Access to storefront features only

### Permissions

#### Admin Permissions
- `MANAGE_USERS` - Create, update, delete users
- `MANAGE_PRODUCTS` - Manage product catalog
- `MANAGE_CATEGORIES` - Manage product categories
- `MANAGE_ORDERS` - Process and manage orders
- `VIEW_ANALYTICS` - Access analytics and reports
- `MANAGE_SETTINGS` - Configure system settings
- `ACCESS_DASHBOARD` - Access admin dashboard

#### User Permissions
- `VIEW_PRODUCTS` - Browse product catalog
- `CREATE_ORDERS` - Place orders
- `VIEW_ORDERS` - View order history
- `MANAGE_PROFILE` - Update personal information
- `MANAGE_WISHLIST` - Manage wishlist
- `MANAGE_ADDRESSES` - Manage shipping addresses

## Usage Examples

### 1. Protecting API Routes

```typescript
// Admin-only endpoint
export const GET = withAdminAuth(async (user, req) => {
  // Only admins can access this
  return createSuccessResponse({ data: "admin data" });
});

// Permission-based endpoint
export const POST = withPermissionAuth(
  UserPermission.MANAGE_USERS,
  async (user, req) => {
    // Only users with MANAGE_USERS permission can access
    return createSuccessResponse({ data: "user management data" });
  }
);

// Dashboard access endpoint
export const PUT = withDashboardAuth(async (user, req) => {
  // Only users with dashboard access can use this
  return createSuccessResponse({ data: "dashboard data" });
});
```

### 2. Protecting UI Components

```tsx
import { RoleGuard, AdminOnly, PermissionGuard } from "@/components/auth/role-guard";

// Admin-only component
<AdminOnly fallback={<div>Access denied</div>}>
  <AdminPanel />
</AdminOnly>

// Permission-based component
<PermissionGuard 
  permission={UserPermission.MANAGE_USERS}
  fallback={<div>No permission</div>}
>
  <UserManagement />
</PermissionGuard>

// Custom role guard
<RoleGuard 
  requiredRole={UserRole.ADMIN}
  requiredPermission={UserPermission.VIEW_ANALYTICS}
>
  <AnalyticsDashboard />
</RoleGuard>
```

### 3. Using Auth Hooks

```tsx
import { useAuth, useIsAdmin, usePermission } from "@/hooks/use-auth";

function MyComponent() {
  const { user, isAuthenticated, hasPermission } = useAuth();
  const isAdmin = useIsAdmin();
  const canManageUsers = usePermission(UserPermission.MANAGE_USERS);

  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.fullName}</h1>
      {isAdmin && <AdminPanel />}
      {canManageUsers && <UserManagement />}
    </div>
  );
}
```

### 4. Middleware Protection

The middleware automatically protects routes based on configuration:

```typescript
// Dashboard routes - admin only
if (pathname.startsWith("/dashboard")) {
  // Redirects non-admins to /unauthorized
}

// Account routes - authenticated users only
if (pathname.startsWith("/account")) {
  // Redirects unauthenticated users to /auth/sign-in
}

// API routes - role-based protection
if (pathname.startsWith("/api/users")) {
  // Returns 403 for non-admins
}
```

## Route Protection

### Public Routes
- `/` - Homepage
- `/products/*` - Product catalog
- `/categories/*` - Category pages
- `/search/*` - Search results
- `/cart/*` - Shopping cart
- `/checkout/*` - Checkout process
- `/auth/*` - Authentication pages

### Protected Routes
- `/dashboard/*` - Admin dashboard (admin only)
- `/account/*` - User account (authenticated users)
- `/api/users/*` - User management API (admin only)
- `/api/admin/*` - Admin API endpoints (admin only)

## User Management

### Admin Features
- View all users
- Create new users
- Update user roles
- Activate/deactivate users
- Delete users (except self)

### User Features
- View own profile
- Update personal information
- Manage addresses
- View order history
- Manage wishlist

## Security Features

### 1. Middleware Protection
- Automatic route protection
- Role-based redirects
- Permission validation
- Session validation

### 2. API Security
- Decorator-based protection
- Automatic error handling
- Request validation
- Response standardization

### 3. UI Security
- Component-level protection
- Conditional rendering
- Fallback components
- Loading states

### 4. State Management
- Persistent auth state
- Optimized re-renders
- Cached permissions
- Offline support

## Performance Optimizations

### 1. Caching
- User data caching in Zustand store
- Permission caching
- Role validation caching

### 2. Lazy Loading
- Conditional component loading
- Route-based code splitting
- Permission-based imports

### 3. Optimized Re-renders
- Selective state updates
- Memoized permission checks
- Efficient hook usage

## Error Handling

### 1. Authentication Errors
- `AuthError` - General authentication issues
- `PermissionError` - Permission denied
- `RoleError` - Role access denied

### 2. API Error Responses
```typescript
{
  success: false,
  error: "Error message",
  code: "ERROR_CODE"
}
```

### 3. UI Error States
- Loading skeletons
- Error boundaries
- Fallback components
- User-friendly messages

## Environment Setup

### Required Environment Variables
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### Clerk Dashboard Configuration
1. Create roles: `admin`, `user`
2. Configure user metadata for roles
3. Set up webhooks for user events
4. Configure session settings

## Best Practices

### 1. Security
- Always validate permissions on both client and server
- Use middleware for route protection
- Implement proper error handling
- Regular security audits

### 2. Performance
- Cache user data appropriately
- Use selective re-renders
- Implement loading states
- Optimize bundle size

### 3. User Experience
- Provide clear error messages
- Show loading states
- Implement fallback components
- Maintain consistent UI patterns

### 4. Development
- Use TypeScript for type safety
- Implement proper error boundaries
- Write comprehensive tests
- Document all components

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Check user role assignment
   - Verify permission configuration
   - Ensure middleware is properly configured

2. **Authentication Failures**
   - Verify Clerk configuration
   - Check environment variables
   - Validate session state

3. **Route Protection Issues**
   - Review middleware configuration
   - Check route patterns
   - Verify redirect URLs

4. **Performance Issues**
   - Monitor re-render frequency
   - Check cache configuration
   - Optimize component structure

## Future Enhancements

1. **Advanced Permissions**
   - Resource-based permissions
   - Dynamic permission assignment
   - Permission inheritance

2. **Audit Logging**
   - User action tracking
   - Permission change logs
   - Security event monitoring

3. **Multi-tenant Support**
   - Organization-based access
   - Tenant isolation
   - Cross-tenant permissions

4. **Advanced UI Features**
   - Permission-based navigation
   - Dynamic menu generation
   - Contextual help system

## Support

For issues or questions regarding the authentication system:
1. Check the troubleshooting section
2. Review the Clerk documentation
3. Contact the development team
4. Create an issue in the project repository
