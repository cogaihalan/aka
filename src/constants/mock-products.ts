import { Product, Category, Brand } from '@/lib/api';

// Extended Product interface for mock data that includes additional fields
interface MockProduct extends Omit<Product, 'category' | 'brand'> {
  category: Category;
  brand?: Brand;
  // Additional fields for mock data
  rating?: number;
  inStock?: boolean;
  color?: string;
  sizes?: string[];
}

// Mock Categories
export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices and gadgets",
    level: 1,
    path: "/electronics",
    seo: { title: "Electronics", description: "Shop the latest electronic devices" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Clothing",
    slug: "clothing",
    description: "Fashion and apparel",
    level: 1,
    path: "/clothing",
    seo: { title: "Clothing", description: "Shop the latest fashion trends" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "Home",
    slug: "home",
    description: "Home and garden products",
    level: 1,
    path: "/home",
    seo: { title: "Home & Garden", description: "Shop home and garden essentials" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Sports",
    slug: "sports",
    description: "Sports and outdoor equipment",
    level: 1,
    path: "/sports",
    seo: { title: "Sports & Outdoors", description: "Shop sports and outdoor gear" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    name: "Books",
    slug: "books",
    description: "Books and literature",
    level: 1,
    path: "/books",
    seo: { title: "Books", description: "Shop books and literature" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 6,
    name: "Beauty",
    slug: "beauty",
    description: "Beauty and health products",
    level: 1,
    path: "/beauty",
    seo: { title: "Beauty & Health", description: "Shop beauty and health products" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

// Mock Brands
export const MOCK_BRANDS: Brand[] = [
  {
    id: 1,
    name: "Apple",
    slug: "apple",
    description: "Technology company",
    seo: { title: "Apple", description: "Apple products" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Samsung",
    slug: "samsung",
    description: "Electronics manufacturer",
    seo: { title: "Samsung", description: "Samsung products" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    name: "Sony",
    slug: "sony",
    description: "Electronics and entertainment",
    seo: { title: "Sony", description: "Sony products" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    name: "Nike",
    slug: "nike",
    description: "Athletic footwear and apparel",
    seo: { title: "Nike", description: "Nike products" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    name: "Adidas",
    slug: "adidas",
    description: "Sports apparel and footwear",
    seo: { title: "Adidas", description: "Adidas products" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 6,
    name: "Dyson",
    slug: "dyson",
    description: "Home appliances",
    seo: { title: "Dyson", description: "Dyson products" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 7,
    name: "KitchenAid",
    slug: "kitchenaid",
    description: "Kitchen appliances",
    seo: { title: "KitchenAid", description: "KitchenAid products" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 8,
    name: "Philips",
    slug: "philips",
    description: "Health and home products",
    seo: { title: "Philips", description: "Philips products" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 9,
    name: "Yeti",
    slug: "yeti",
    description: "Outdoor gear and drinkware",
    seo: { title: "Yeti", description: "Yeti products" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 10,
    name: "Patagonia",
    slug: "patagonia",
    description: "Outdoor clothing and gear",
    seo: { title: "Patagonia", description: "Patagonia products" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 11,
    name: "Penguin",
    slug: "penguin",
    description: "Publishing company",
    seo: { title: "Penguin", description: "Penguin books" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 12,
    name: "Harriman House",
    slug: "harriman-house",
    description: "Financial publishing",
    seo: { title: "Harriman House", description: "Harriman House books" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 13,
    name: "The Ordinary",
    slug: "the-ordinary",
    description: "Skincare brand",
    seo: { title: "The Ordinary", description: "The Ordinary skincare" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 14,
    name: "CeraVe",
    slug: "cerave",
    description: "Skincare brand",
    seo: { title: "CeraVe", description: "CeraVe skincare" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 15,
    name: "Amazon",
    slug: "amazon",
    description: "Technology and e-commerce",
    seo: { title: "Amazon", description: "Amazon products" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 16,
    name: "Google",
    slug: "google",
    description: "Technology company",
    seo: { title: "Google", description: "Google products" },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

// Helper function to create a mock product
function createMockProduct(
  id: number,
  name: string,
  description: string,
  price: number,
  categoryIndex: number,
  brandIndex?: number,
  options: {
    compareAtPrice?: number;
    rating?: number;
    inStock?: boolean;
    color?: string;
    sizes?: string[];
    featured?: boolean;
    createdAt?: string;
  } = {}
): MockProduct {
  const category = MOCK_CATEGORIES[categoryIndex];
  const brand = brandIndex !== undefined ? MOCK_BRANDS[brandIndex] : undefined;
  
  return {
    id,
    name,
    description,
    price,
    compareAtPrice: options.compareAtPrice,
    sku: `${name.replace(/\s+/g, '').toUpperCase()}-${id}`,
    category,
    brand,
    tags: [category.name.toLowerCase(), ...(brand ? [brand.name.toLowerCase()] : [])],
    images: [
      {
        id: id * 100,
        url: "/assets/placeholder-image.jpeg",
        alt: name,
        order: 1,
        isPrimary: true
      }
    ],
    variants: [
      {
        id: id * 100 + 1,
        name: "Default",
        sku: `${name.replace(/\s+/g, '').toUpperCase()}-${id}-DEFAULT`,
        price,
        compareAtPrice: options.compareAtPrice,
        attributes: { color: options.color || "default" },
        inventory: { 
          quantity: options.inStock ? 100 : 0, 
          reserved: 0, 
          available: options.inStock ? 100 : 0, 
          trackQuantity: true, 
          allowBackorder: false 
        },
        images: []
      }
    ],
    inventory: { 
      quantity: options.inStock ? 100 : 0, 
      reserved: 0, 
      available: options.inStock ? 100 : 0, 
      trackQuantity: true, 
      allowBackorder: false 
    },
    seo: { title: name, description },
    status: "active" as const,
    featured: options.featured || false,
    createdAt: options.createdAt || "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    // Additional mock fields
    rating: options.rating,
    inStock: options.inStock,
    color: options.color,
    sizes: options.sizes
  };
}

export const MOCK_PRODUCTS: MockProduct[] = [
  // Electronics
  createMockProduct(1, "iPhone 15 Pro Max", "Latest iPhone with titanium design and advanced camera system", 1199.99, 0, 0, {
    compareAtPrice: 1299.99,
    rating: 4.8,
    inStock: true,
    color: "black",
    sizes: ["256GB", "512GB", "1TB"],
    featured: true,
    createdAt: "2024-01-15T00:00:00Z"
  }),
  createMockProduct(2, "Samsung Galaxy S24 Ultra", "Premium Android smartphone with S Pen and advanced AI features", 1299.99, 0, 1, {
    rating: 4.7,
    inStock: true,
    color: "white",
    sizes: ["256GB", "512GB", "1TB"],
    createdAt: "2024-01-10T00:00:00Z"
  }),
  createMockProduct(3, "MacBook Pro 16-inch", "Powerful laptop with M3 Pro chip for professionals", 2499.99, 0, 0, {
    compareAtPrice: 2699.99,
    rating: 4.9,
    inStock: true,
    color: "black",
    sizes: ["512GB", "1TB", "2TB"],
    featured: true,
    createdAt: "2024-01-05T00:00:00Z"
  }),
  createMockProduct(4, "Sony WH-1000XM5 Headphones", "Industry-leading noise canceling wireless headphones", 399.99, 0, 2, {
    rating: 4.6,
    inStock: true,
    color: "black",
    sizes: ["One Size"],
    createdAt: "2023-12-20T00:00:00Z"
  }),
  createMockProduct(5, "iPad Air 5th Gen", "Powerful tablet with M1 chip and Liquid Retina display", 599.99, 0, 0, {
    rating: 4.5,
    inStock: true,
    color: "blue",
    sizes: ["64GB", "256GB"],
    createdAt: "2023-12-15T00:00:00Z"
  }),

  // Clothing
  createMockProduct(6, "Nike Air Max 270", "Comfortable running shoes with Max Air cushioning", 150.99, 1, 3, {
    compareAtPrice: 180.99,
    rating: 4.4,
    inStock: true,
    color: "white",
    sizes: ["7", "8", "9", "10", "11", "12"],
    createdAt: "2023-11-30T00:00:00Z"
  }),
  createMockProduct(7, "Adidas Ultraboost 22", "Premium running shoes with responsive Boost technology", 180.99, 1, 4, {
    rating: 4.3,
    inStock: true,
    color: "black",
    sizes: ["7", "8", "9", "10", "11", "12"],
    createdAt: "2023-11-25T00:00:00Z"
  }),
  createMockProduct(8, "Nike Dri-FIT T-Shirt", "Moisture-wicking athletic t-shirt for active lifestyle", 29.99, 1, 3, {
    rating: 4.2,
    inStock: true,
    color: "red",
    sizes: ["S", "M", "L", "XL", "XXL"],
    createdAt: "2023-11-20T00:00:00Z"
  }),
  createMockProduct(9, "Adidas Originals Hoodie", "Classic hoodie with three stripes design", 79.99, 1, 4, {
    compareAtPrice: 99.99,
    rating: 4.1,
    inStock: true,
    color: "blue",
    sizes: ["S", "M", "L", "XL", "XXL"],
    createdAt: "2023-11-15T00:00:00Z"
  }),

  // Home & Garden
  createMockProduct(10, "Dyson V15 Detect Vacuum", "Advanced cordless vacuum with laser dust detection", 749.99, 2, 5, {
    rating: 4.7,
    inStock: true,
    color: "yellow",
    sizes: ["One Size"],
    createdAt: "2023-10-30T00:00:00Z"
  }),
  createMockProduct(11, "KitchenAid Stand Mixer", "Professional stand mixer for baking enthusiasts", 399.99, 2, 6, {
    compareAtPrice: 449.99,
    rating: 4.8,
    inStock: true,
    color: "red",
    sizes: ["5 Quart", "6 Quart"],
    createdAt: "2023-10-25T00:00:00Z"
  }),
  createMockProduct(12, "Philips Hue Smart Bulbs", "Smart LED bulbs with millions of colors and voice control", 49.99, 2, 7, {
    rating: 4.5,
    inStock: true,
    color: "white",
    sizes: ["A19", "BR30"],
    createdAt: "2023-10-20T00:00:00Z"
  }),

  // Sports & Outdoors
  createMockProduct(13, "Yeti Rambler Tumbler", "Insulated stainless steel tumbler keeps drinks hot or cold", 35.99, 3, 8, {
    rating: 4.6,
    inStock: true,
    color: "green",
    sizes: ["20oz", "30oz", "40oz"],
    createdAt: "2023-09-30T00:00:00Z"
  }),
  createMockProduct(14, "Patagonia Better Sweater", "Sustainable fleece jacket made from recycled materials", 99.99, 3, 9, {
    compareAtPrice: 129.99,
    rating: 4.4,
    inStock: true,
    color: "blue",
    sizes: ["S", "M", "L", "XL", "XXL"],
    createdAt: "2023-09-25T00:00:00Z"
  }),
  createMockProduct(15, "Nike Basketball", "Official size basketball for indoor and outdoor play", 24.99, 3, 3, {
    rating: 4.3,
    inStock: true,
    color: "yellow",
    sizes: ["Size 7"],
    createdAt: "2023-09-20T00:00:00Z"
  }),

  // Books
  createMockProduct(16, "Atomic Habits", "An Easy & Proven Way to Build Good Habits & Break Bad Ones", 16.99, 4, 10, {
    rating: 4.8,
    inStock: true,
    color: "white",
    sizes: ["Paperback", "Hardcover", "Audiobook"],
    createdAt: "2023-08-30T00:00:00Z"
  }),
  createMockProduct(17, "The Psychology of Money", "Timeless lessons on wealth, greed, and happiness", 14.99, 4, 11, {
    compareAtPrice: 18.99,
    rating: 4.7,
    inStock: true,
    color: "white",
    sizes: ["Paperback", "Hardcover", "Audiobook"],
    createdAt: "2023-08-25T00:00:00Z"
  }),

  // Beauty & Health
  createMockProduct(18, "The Ordinary Niacinamide 10%", "High-strength vitamin and mineral blemish formula", 12.99, 5, 12, {
    rating: 4.5,
    inStock: true,
    color: "white",
    sizes: ["30ml"],
    createdAt: "2023-07-30T00:00:00Z"
  }),
  createMockProduct(19, "CeraVe Foaming Facial Cleanser", "Gentle foaming cleanser for normal to oily skin", 15.99, 5, 13, {
    rating: 4.4,
    inStock: true,
    color: "white",
    sizes: ["236ml", "473ml"],
    createdAt: "2023-07-25T00:00:00Z"
  }),

  // More Electronics
  createMockProduct(20, "Apple Watch Series 9", "Advanced smartwatch with health monitoring and fitness tracking", 399.99, 0, 0, {
    compareAtPrice: 429.99,
    rating: 4.6,
    inStock: true,
    color: "black",
    sizes: ["41mm", "45mm"],
    createdAt: "2024-01-01T00:00:00Z"
  }),
  createMockProduct(21, "Samsung 55-inch QLED TV", "4K QLED Smart TV with Quantum Dot technology", 899.99, 0, 1, {
    rating: 4.5,
    inStock: true,
    color: "black",
    sizes: ["55-inch"],
    createdAt: "2023-12-10T00:00:00Z"
  }),
  createMockProduct(22, "Sony PlayStation 5", "Next-generation gaming console with ultra-high speed SSD", 499.99, 0, 2, {
    rating: 4.9,
    inStock: false,
    color: "white",
    sizes: ["Standard", "Digital"],
    createdAt: "2023-11-30T00:00:00Z"
  }),
  createMockProduct(23, "Amazon Echo Dot 5th Gen", "Smart speaker with Alexa and improved audio", 49.99, 0, 14, {
    compareAtPrice: 59.99,
    rating: 4.3,
    inStock: true,
    color: "blue",
    sizes: ["One Size"],
    createdAt: "2023-11-20T00:00:00Z"
  }),
  createMockProduct(24, "Google Pixel 8 Pro", "AI-powered smartphone with advanced camera system", 999.99, 0, 15, {
    rating: 4.4,
    inStock: true,
    color: "black",
    sizes: ["128GB", "256GB", "512GB"],
    createdAt: "2023-10-15T00:00:00Z"
  })
];

// Legacy category and brand arrays for backward compatibility
export const MOCK_CATEGORIES_LEGACY = [
  { id: 'electronics', name: 'Electronics', slug: 'electronics', count: 10 },
  { id: 'clothing', name: 'Clothing', slug: 'clothing', count: 4 },
  { id: 'home', name: 'Home & Garden', slug: 'home', count: 3 },
  { id: 'sports', name: 'Sports & Outdoors', slug: 'sports', count: 3 },
  { id: 'books', name: 'Books', slug: 'books', count: 2 },
  { id: 'beauty', name: 'Beauty & Health', slug: 'beauty', count: 2 }
];

export const MOCK_BRANDS_LEGACY = [
  { id: 'apple', name: 'Apple', count: 5 },
  { id: 'samsung', name: 'Samsung', count: 3 },
  { id: 'sony', name: 'Sony', count: 2 },
  { id: 'nike', name: 'Nike', count: 4 },
  { id: 'adidas', name: 'Adidas', count: 2 },
  { id: 'amazon', name: 'Amazon', count: 1 },
  { id: 'google', name: 'Google', count: 1 },
  { id: 'dyson', name: 'Dyson', count: 1 },
  { id: 'kitchenaid', name: 'KitchenAid', count: 1 },
  { id: 'philips', name: 'Philips', count: 1 },
  { id: 'yeti', name: 'Yeti', count: 1 },
  { id: 'patagonia', name: 'Patagonia', count: 1 },
  { id: 'penguin', name: 'Penguin', count: 1 },
  { id: 'harriman-house', name: 'Harriman House', count: 1 },
  { id: 'the-ordinary', name: 'The Ordinary', count: 1 },
  { id: 'cerave', name: 'CeraVe', count: 1 }
];
