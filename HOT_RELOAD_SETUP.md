# Hot Reload Configuration Guide

This guide explains how to set up optimal hot reload for your Next.js project with Tailwind CSS.

## 🚀 Quick Start

1. **Start the development server with Turbopack:**

   ```bash
   pnpm dev
   ```

2. **For debugging mode:**

   ```bash
   pnpm dev:debug
   ```

3. **For custom port:**
   ```bash
   pnpm dev:port
   ```

## ⚡ Hot Reload Features

### ✅ What's Configured

- **Turbopack**: Ultra-fast bundler for development
- **CSS Hot Reload**: Instant CSS updates without page refresh
- **React Fast Refresh**: Preserves component state during updates
- **File Watching**: Automatic rebuilds on file changes
- **TypeScript**: Type checking with watch mode
- **Tailwind CSS**: JIT mode with hot reload

### 🎯 Hot Reload Triggers

The following changes will trigger hot reload:

- **CSS Classes**: Adding/removing Tailwind classes
- **CSS Files**: Changes to `.css` files
- **React Components**: Updates to `.tsx`/`.jsx` files
- **TypeScript**: Changes to `.ts` files
- **Configuration**: Updates to config files

## 🔧 Configuration Details

### Next.js Configuration (`next.config.ts`)

```typescript
// Turbopack configuration for faster development builds and hot reload
turbopack: {
  rules: {
    // Enable CSS hot reload for all CSS files
    "*.css": {
      loaders: ["css-loader"],
      as: "*.css",
    },
  },
  // Enable file watching for hot reload
  resolveAlias: {
    // Ensure proper module resolution for hot reload
  },
},
```

### Tailwind Configuration (`tailwind.config.ts`)

```typescript
// Enable JIT mode for better performance and hot reload
mode: "jit",
// Enable CSS purging for better performance
purge: {
  enabled: process.env.NODE_ENV === "production",
  // ... content paths
},
```

### PostCSS Configuration (`postcss.config.js`)

```javascript
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {
      // Enable hot reload for CSS changes
      hot: process.env.NODE_ENV === "development",
      // Enable JIT mode for better performance
      jit: true,
      // Enable CSS purging in production
      purge: process.env.NODE_ENV === "production",
    },
  },
};
```

## 🛠️ Development Scripts

| Script                  | Description                             |
| ----------------------- | --------------------------------------- |
| `pnpm dev`              | Start development server with Turbopack |
| `pnpm dev:debug`        | Start with debugging enabled            |
| `pnpm dev:port`         | Start on custom port (3000)             |
| `pnpm type-check:watch` | TypeScript type checking in watch mode  |

## 🎨 CSS Hot Reload

### Tailwind Classes

```tsx
// These changes will trigger instant hot reload
<div className="bg-blue-500 hover:bg-blue-600 transition-colors">Content</div>
```

### Custom CSS

```css
/* Changes to globals.css will trigger hot reload */
.custom-class {
  @apply bg-red-500 text-white;
}
```

### CSS Variables

```css
/* Changes to CSS variables will trigger hot reload */
:root {
  --custom-color: #ff0000;
}
```

## 🔍 Troubleshooting

### Hot Reload Not Working?

1. **Check if Turbopack is enabled:**

   ```bash
   pnpm dev
   # Should show "Turbopack" in the output
   ```

2. **Clear Next.js cache:**

   ```bash
   rm -rf .next
   pnpm dev
   ```

3. **Check file watching:**

   - Ensure your files are being watched
   - Check for any file permission issues

4. **Restart development server:**
   ```bash
   # Stop the server (Ctrl+C)
   pnpm dev
   ```

### Performance Issues?

1. **Use Turbopack:**

   ```bash
   pnpm dev  # Uses --turbo flag automatically
   ```

2. **Disable source maps in development:**

   - Already configured in `next.config.ts`

3. **Use type checking in watch mode:**
   ```bash
   pnpm type-check:watch
   ```

## 📁 File Structure

```
src/
├── app/
│   ├── globals.css          # Global styles (hot reload enabled)
│   └── theme.css           # Theme variables (hot reload enabled)
├── components/
│   └── ui/                 # UI components (hot reload enabled)
└── features/               # Feature components (hot reload enabled)
```

## 🚀 Best Practices

1. **Use Tailwind classes** for styling (better hot reload)
2. **Keep components small** for faster updates
3. **Use CSS modules** for component-specific styles
4. **Avoid inline styles** when possible
5. **Use TypeScript** for better development experience

## 🔧 Advanced Configuration

### Custom Webpack Configuration

The project includes custom webpack configuration for better hot reload:

```typescript
webpack: (config, { dev, isServer }) => {
  if (dev && !isServer) {
    // Enable hot reload for CSS
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
  }
  return config;
},
```

### Environment Variables

For optimal hot reload, you can set these environment variables:

```bash
# Enable fast refresh
FAST_REFRESH=true

# Enable webpack hot reload
WEBPACK_HOT_RELOAD=true

# Enable CSS hot reload
CSS_HOT_RELOAD=true
```

## 📚 Additional Resources

- [Next.js Turbopack Documentation](https://nextjs.org/docs/app/building-your-application/configuring/turbo)
- [Tailwind CSS JIT Mode](https://tailwindcss.com/docs/just-in-time-mode)
- [React Fast Refresh](https://nextjs.org/docs/advanced-features/fast-refresh)
- [Webpack Hot Module Replacement](https://webpack.js.org/concepts/hot-module-replacement/)

---

**Happy coding! 🎉** Your hot reload is now configured for optimal development experience.
