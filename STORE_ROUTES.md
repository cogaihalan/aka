# AKA Ecommerce Storefront Routes

This document outlines the complete routing structure for the AKA ecommerce storefront.

## Route Structure Overview

```
/                              # Main storefront (public)
├── /                          # Home page
├── /products/                 # Product listing
│   └── /[productId]/         # Product detail page
├── /categories/              # Category listing
│   └── /[categorySlug]/      # Category page
├── /cart/                    # Shopping cart
├── /checkout/                # Checkout process
│   └── /success/             # Order confirmation
├── /search/                  # Product search
├── /wishlist/                # User wishlist
├── /about/                   # About page
├── /contact/                 # Contact page
├── /help/                    # Help center
└── /account/                 # User account (protected)
    ├── /                     # Account dashboard
    ├── /orders/              # Order history
    │   └── /[orderId]/       # Order details
    ├── /profile/             # Profile settings
    └── /addresses/           # Address book

/dashboard/                   # Admin dashboard (protected)
├── /overview/                # Dashboard overview
├── /product/                 # Product management
├── /kanban/                  # Kanban board
└── /profile/                 # Admin profile

/auth/                        # Authentication (public)
├── /sign-in/                 # Sign in
└── /sign-up/                 # Sign up
```

## Storefront Routes (Public)

### Main Storefront

- **`/`** - Home page with featured products and hero section
- **`/products`** - Complete product catalog with filtering and search
- **`/products/[productId]`** - Individual product detail page
- **`/categories`** - Browse products by category
- **`/categories/[categorySlug]`** - Products in specific category

### Shopping Experience

- **`/cart`** - Shopping cart with item management
- **`/checkout`** - Checkout process with payment forms
- **`/checkout/success`** - Order confirmation page
- **`/search`** - Product search with filters
- **`/wishlist`** - User's saved items

### Information Pages

- **`/about`** - Company information and values
- **`/contact`** - Contact form and information
- **`/help`** - Help center with FAQ and support

## User Account Routes (Protected)

### Account Management

- **`/account`** - Account dashboard with overview
- **`/account/profile`** - Personal information settings
- **`/account/addresses`** - Shipping address management

### Order Management

- **`/account/orders`** - Order history and tracking
- **`/account/orders/[orderId]`** - Detailed order information

## Admin Dashboard Routes (Protected)

### Dashboard

- **`/dashboard/overview`** - Admin dashboard with analytics
- **`/dashboard/product`** - Product management interface
- **`/dashboard/kanban`** - Project management board
- **`/dashboard/profile`** - Admin profile settings

## Authentication Routes (Public)

- **`/auth/sign-in`** - User sign in
- **`/auth/sign-up`** - User registration

## Route Protection

- **Public Routes**: All root-level routes (except account), `/auth/*`
- **Protected Routes**: `/dashboard/*`, `/account/*`
- **Middleware**: Uses Clerk for authentication and route protection

## Key Features

### Storefront Features

- Responsive design with mobile-first approach
- Product catalog with filtering and search
- Shopping cart and checkout process
- User account management
- Order tracking and history
- Wishlist functionality
- Help center and support

### Admin Features

- Product management
- Order management
- Analytics dashboard
- User management
- Content management

## Navigation Structure

### Storefront Navigation

- Header with logo, search, cart, and user menu
- Main navigation: Home, Products, Categories, About, Contact
- Footer with links, contact info, and social media

### Admin Navigation

- Sidebar with dashboard sections
- Header with user profile and notifications
- Breadcrumb navigation for deep pages

## Component Organization

```
src/features/storefront/components/
├── home-page.tsx
├── product-listing-page.tsx
├── product-detail-page.tsx
├── category-listing-page.tsx
├── category-page.tsx
├── cart-page.tsx
├── checkout-page.tsx
├── checkout-success-page.tsx
├── search-page.tsx
├── wishlist-page.tsx
├── about-page.tsx
├── contact-page.tsx
├── help-page.tsx
├── account-layout.tsx
├── account-dashboard.tsx
├── order-history-page.tsx
├── order-detail-page.tsx
├── profile-page.tsx
└── address-book-page.tsx
```

## Layout Components

```
src/components/layout/
├── storefront-layout.tsx      # Main storefront layout
├── storefront-header.tsx      # Storefront header with navigation
└── storefront-footer.tsx      # Storefront footer
```

## Route Examples

### Public Routes

- `https://yourdomain.com/` - Home page
- `https://yourdomain.com/products` - All products
- `https://yourdomain.com/products/laptop-123` - Specific product
- `https://yourdomain.com/categories/electronics` - Electronics category
- `https://yourdomain.com/cart` - Shopping cart
- `https://yourdomain.com/checkout` - Checkout process
- `https://yourdomain.com/about` - About page

### Protected Routes

- `https://yourdomain.com/account` - User dashboard
- `https://yourdomain.com/account/orders` - Order history
- `https://yourdomain.com/account/orders/123` - Order details
- `https://yourdomain.com/dashboard` - Admin dashboard

This routing structure provides a clean, SEO-friendly URL structure with the storefront as the main experience and admin functionality separated under `/dashboard`.
