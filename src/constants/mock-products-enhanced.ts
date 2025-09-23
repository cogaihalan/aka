import {
  Product,
  Category,
  Brand,
  MediaFile,
  ProductVariant,
  Inventory,
  SEO,
  ProductPricing,
  ShippingInfo,
  ProductAttributeValue,
  ProductReview,
  ProductRating,
  ProductRelation,
  TierPrice,
  GroupPrice,
  WarehouseStock,
} from "@/types/product";

// Enhanced Mock Categories with hierarchical structure
export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    description: "Latest electronic devices and gadgets",
    shortDescription: "Electronics & Gadgets",
    level: 0,
    path: "/electronics",
    seo: {
      title: "Electronics - Latest Devices & Gadgets",
      description:
        "Discover the latest electronic devices, smartphones, laptops, and gadgets",
      keywords: ["electronics", "gadgets", "smartphones", "laptops", "devices"],
      canonicalUrl: "/electronics",
      robots: "index, follow",
      openGraph: {
        title: "Electronics Store",
        description: "Latest electronic devices and gadgets",
        type: "website",
      },
    },
    isActive: true,
    includeInMenu: true,
    isAnchor: true,
    displayMode: "products_only",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    image: {
      id: 1,
      url: "/assets/categories/electronics.jpg",
      alt: "Electronics Category",
      order: 1,
      isPrimary: true,
      type: "image",
      mimeType: "image/jpeg",
      fileSize: 1024000,
      dimensions: { width: 800, height: 600 },
    },
  },
  {
    id: 2,
    name: "Smartphones",
    slug: "smartphones",
    description: "Latest smartphones from top brands",
    shortDescription: "Smartphones",
    level: 1,
    path: "/electronics/smartphones",
    parentId: 1,
    seo: {
      title: "Smartphones - Latest Mobile Phones",
      description:
        "Shop the latest smartphones with advanced features and technology",
      keywords: [
        "smartphones",
        "mobile phones",
        "iphone",
        "samsung",
        "android",
      ],
    },
    isActive: true,
    includeInMenu: true,
    isAnchor: true,
    displayMode: "products_only",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Laptops",
    slug: "laptops",
    description: "High-performance laptops for work and gaming",
    shortDescription: "Laptops & Notebooks",
    level: 1,
    path: "/electronics/laptops",
    parentId: 1,
    seo: {
      title: "Laptops - High Performance Computing",
      description:
        "Professional and gaming laptops with cutting-edge technology",
      keywords: [
        "laptops",
        "notebooks",
        "gaming laptops",
        "macbook",
        "windows",
      ],
    },
    isActive: true,
    includeInMenu: true,
    isAnchor: true,
    displayMode: "products_only",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "Clothing",
    slug: "clothing",
    description: "Fashion and apparel for all occasions",
    shortDescription: "Fashion & Apparel",
    level: 0,
    path: "/clothing",
    seo: {
      title: "Clothing - Fashion & Apparel",
      description:
        "Trendy clothing and fashion accessories for men, women, and kids",
      keywords: ["clothing", "fashion", "apparel", "style", "trendy"],
    },
    isActive: true,
    includeInMenu: true,
    isAnchor: true,
    displayMode: "products_only",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 5,
    name: "Shoes",
    slug: "shoes",
    description: "Comfortable and stylish footwear",
    shortDescription: "Footwear",
    level: 1,
    path: "/clothing/shoes",
    parentId: 4,
    seo: {
      title: "Shoes - Comfortable Footwear",
      description: "Quality shoes for every occasion and activity",
      keywords: ["shoes", "footwear", "sneakers", "boots", "comfortable"],
    },
    isActive: true,
    includeInMenu: true,
    isAnchor: true,
    displayMode: "products_only",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// Enhanced Mock Brands
export const MOCK_BRANDS: Brand[] = [
  {
    id: 1,
    name: "Apple",
    slug: "apple",
    description: "Technology company known for innovative products",
    shortDescription: "Innovative Technology",
    logo: {
      id: 1,
      url: "/assets/brands/apple-logo.png",
      alt: "Apple Logo",
      order: 1,
      isPrimary: true,
      type: "image",
      mimeType: "image/png",
      fileSize: 51200,
      dimensions: { width: 200, height: 200 },
    },
    website: "https://apple.com",
    country: "USA",
    foundedYear: 1976,
    seo: {
      title: "Apple - Innovative Technology",
      description:
        "Apple products including iPhone, iPad, Mac, and accessories",
      keywords: ["apple", "iphone", "ipad", "mac", "technology"],
    },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Samsung",
    slug: "samsung",
    description: "Global electronics and technology company",
    shortDescription: "Global Electronics",
    logo: {
      id: 2,
      url: "/assets/brands/samsung-logo.png",
      alt: "Samsung Logo",
      order: 1,
      isPrimary: true,
      type: "image",
      mimeType: "image/png",
      fileSize: 48000,
      dimensions: { width: 200, height: 200 },
    },
    website: "https://samsung.com",
    country: "South Korea",
    foundedYear: 1938,
    seo: {
      title: "Samsung - Global Electronics",
      description: "Samsung smartphones, TVs, appliances, and electronics",
      keywords: ["samsung", "galaxy", "electronics", "smartphones", "tv"],
    },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Nike",
    slug: "nike",
    description: "Athletic footwear and apparel company",
    shortDescription: "Athletic Gear",
    logo: {
      id: 3,
      url: "/assets/brands/nike-logo.png",
      alt: "Nike Logo",
      order: 1,
      isPrimary: true,
      type: "image",
      mimeType: "image/png",
      fileSize: 45000,
      dimensions: { width: 200, height: 200 },
    },
    website: "https://nike.com",
    country: "USA",
    foundedYear: 1964,
    seo: {
      title: "Nike - Athletic Footwear & Apparel",
      description:
        "Nike shoes, clothing, and athletic gear for sports and lifestyle",
      keywords: ["nike", "athletic", "shoes", "clothing", "sports"],
    },
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// Helper function to create comprehensive product images
function createProductImages(
  productId: number,
  productName: string
): MediaFile[] {
  return [
    {
      id: productId * 100,
      url: "/assets/products/placeholder-main.jpg",
      alt: `${productName} - Main View`,
      title: `${productName} Main Image`,
      order: 1,
      isPrimary: true,
      type: "image",
      mimeType: "image/jpeg",
      fileSize: 2048000,
      dimensions: { width: 1200, height: 1200 },
      variants: [
        {
          id: productId * 1000 + 1,
          url: "/assets/products/placeholder-thumb.jpg",
          type: "thumbnail",
          width: 150,
          height: 150,
          fileSize: 25600,
        },
        {
          id: productId * 1000 + 2,
          url: "/assets/products/placeholder-small.jpg",
          type: "small",
          width: 300,
          height: 300,
          fileSize: 102400,
        },
        {
          id: productId * 1000 + 3,
          url: "/assets/products/placeholder-medium.jpg",
          type: "medium",
          width: 600,
          height: 600,
          fileSize: 409600,
        },
        {
          id: productId * 1000 + 4,
          url: "/assets/products/placeholder-large.jpg",
          type: "large",
          width: 1200,
          height: 1200,
          fileSize: 1638400,
        },
      ],
    },
    {
      id: productId * 100 + 1,
      url: "/assets/products/placeholder-side.jpg",
      alt: `${productName} - Side View`,
      title: `${productName} Side View`,
      order: 2,
      isPrimary: false,
      type: "image",
      mimeType: "image/jpeg",
      fileSize: 1800000,
      dimensions: { width: 1200, height: 1200 },
    },
    {
      id: productId * 100 + 2,
      url: "/assets/products/placeholder-back.jpg",
      alt: `${productName} - Back View`,
      title: `${productName} Back View`,
      order: 3,
      isPrimary: false,
      type: "image",
      mimeType: "image/jpeg",
      fileSize: 1900000,
      dimensions: { width: 1200, height: 1200 },
    },
    {
      id: productId * 100 + 3,
      url: "/assets/products/placeholder-detail.jpg",
      alt: `${productName} - Detail View`,
      title: `${productName} Detail View`,
      order: 4,
      isPrimary: false,
      type: "image",
      mimeType: "image/jpeg",
      fileSize: 2200000,
      dimensions: { width: 1200, height: 1200 },
    },
  ];
}

// Helper function to create product variants
function createProductVariants(
  productId: number,
  productName: string,
  basePrice: number
): ProductVariant[] {
  return [
    {
      id: productId * 1000 + 1,
      name: "Default",
      sku: `${productName.replace(/\s+/g, "").toUpperCase()}-${productId}-DEFAULT`,
      price: basePrice,
      compareAtPrice: basePrice * 1.2,
      cost: basePrice * 0.6,
      weight: 1.5,
      dimensions: {
        length: 20,
        width: 15,
        height: 5,
        unit: "cm",
      },
      attributes: {
        color: "default",
        size: "standard",
      },
      inventory: {
        quantity: 100,
        reserved: 5,
        available: 95,
        trackQuantity: true,
        allowBackorder: false,
        allowPreorder: false,
        minQuantity: 1,
        maxQuantity: 10,
        lowStockThreshold: 10,
        stockStatus: "in_stock",
        warehouses: [
          {
            warehouseId: 1,
            warehouseName: "Main Warehouse",
            quantity: 60,
            reserved: 3,
            available: 57,
          },
          {
            warehouseId: 2,
            warehouseName: "Secondary Warehouse",
            quantity: 40,
            reserved: 2,
            available: 38,
          },
        ],
        lastUpdated: "2024-01-15T10:30:00Z",
      },
      images: [],
      isDefault: true,
      position: 1,
      status: "active",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    },
  ];
}

// Helper function to create product reviews
function createProductReviews(productId: number): ProductReview[] {
  return [
    {
      id: productId * 10000 + 1,
      customerName: "John Doe",
      customerEmail: "john@example.com",
      title: "Excellent product!",
      detail:
        "This product exceeded my expectations. Great quality and fast delivery.",
      rating: 5,
      isVerifiedPurchase: true,
      isApproved: true,
      helpfulCount: 12,
      notHelpfulCount: 1,
      createdAt: "2024-01-10T14:30:00Z",
      updatedAt: "2024-01-10T14:30:00Z",
    },
    {
      id: productId * 10000 + 2,
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      title: "Good value for money",
      detail:
        "Decent product for the price. Could be better but overall satisfied.",
      rating: 4,
      isVerifiedPurchase: true,
      isApproved: true,
      helpfulCount: 8,
      notHelpfulCount: 2,
      createdAt: "2024-01-08T09:15:00Z",
      updatedAt: "2024-01-08T09:15:00Z",
    },
  ];
}

// Helper function to create product ratings
function createProductRatings(
  productId: number,
  averageRating: number
): ProductRating[] {
  const totalRatings = Math.floor(Math.random() * 100) + 20;
  const ratingBreakdown = [
    { rating: 5, count: Math.floor(totalRatings * 0.6), percentage: 60 },
    { rating: 4, count: Math.floor(totalRatings * 0.25), percentage: 25 },
    { rating: 3, count: Math.floor(totalRatings * 0.1), percentage: 10 },
    { rating: 2, count: Math.floor(totalRatings * 0.03), percentage: 3 },
    { rating: 1, count: Math.floor(totalRatings * 0.02), percentage: 2 },
  ];

  return [
    {
      attributeId: 1,
      attributeCode: "overall_rating",
      averageRating,
      totalRatings,
      ratingBreakdown,
    },
  ];
}

// Helper function to create comprehensive products
function createEnhancedProduct(
  id: number,
  name: string,
  description: string,
  shortDescription: string,
  basePrice: number,
  categoryId: number,
  brandId: number,
  options: {
    compareAtPrice?: number;
    averageRating?: number;
    featured?: boolean;
    productType?: Product["productType"];
    attributes?: ProductAttributeValue[];
    customAttributes?: Record<string, any>;
    tierPrices?: TierPrice[];
    groupPrices?: GroupPrice[];
    relatedProducts?: ProductRelation[];
    tags?: string[];
    newFrom?: string;
    newTo?: string;
  } = {}
): Product {
  const category =
    MOCK_CATEGORIES.find((c) => c.id === categoryId) || MOCK_CATEGORIES[0];
  const brand = MOCK_BRANDS.find((b) => b.id === brandId);

  const images = createProductImages(id, name);
  const variants = createProductVariants(id, name, basePrice);
  const reviews = createProductReviews(id);
  const ratings = createProductRatings(id, options.averageRating || 4.5);

  return {
    id,
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    description,
    shortDescription,
    sku: `${name.replace(/\s+/g, "").toUpperCase()}-${id}`,
    barcode: `1234567890${id}`,

    // Categorization
    categories: [category],
    primaryCategory: category,
    brand,
    tags:
      options.tags ||
      [category.name.toLowerCase(), brand?.name.toLowerCase()].filter(
        (tag): tag is string => Boolean(tag)
      ),

    // Media
    images,
    videos: [],
    documents: [],
    gallery: images,

    // Variants and Configurations
    variants,
    hasVariants: variants.length > 1,
    variantAttributes: ["color", "size"],

    // Pricing
    pricing: {
      basePrice,
      compareAtPrice: options.compareAtPrice || basePrice * 1.2,
      cost: basePrice * 0.6,
      specialPrice: basePrice * 0.9,
      specialPriceFrom: "2024-01-01T00:00:00Z",
      specialPriceTo: "2024-12-31T23:59:59Z",
      tierPrices: options.tierPrices || [
        {
          id: 1,
          qty: 5,
          price: basePrice * 0.95,
          percentageValue: 5,
        },
        {
          id: 2,
          qty: 10,
          price: basePrice * 0.9,
          percentageValue: 10,
        },
      ],
      groupPrices: options.groupPrices || [],
      currency: "USD",
      taxClass: "standard",
      taxRate: 8.5,
    },

    // Inventory
    inventory: {
      quantity: 100,
      reserved: 5,
      available: 95,
      trackQuantity: true,
      allowBackorder: false,
      allowPreorder: false,
      minQuantity: 1,
      maxQuantity: 10,
      lowStockThreshold: 10,
      stockStatus: "in_stock",
      warehouses: [
        {
          warehouseId: 1,
          warehouseName: "Main Warehouse",
          quantity: 60,
          reserved: 3,
          available: 57,
        },
        {
          warehouseId: 2,
          warehouseName: "Secondary Warehouse",
          quantity: 40,
          reserved: 2,
          available: 38,
        },
      ],
      lastUpdated: "2024-01-15T10:30:00Z",
    },

    // Shipping
    shipping: {
      weight: 1.5,
      weightUnit: "kg",
      dimensions: {
        length: 20,
        width: 15,
        height: 5,
        unit: "cm",
      },
      shippingClass: "standard",
      freeShipping: basePrice > 50,
      shippingCost: basePrice > 50 ? 0 : 9.99,
      estimatedDeliveryDays: {
        min: 2,
        max: 5,
      },
      restrictions: {
        countries: ["US", "CA", "GB", "DE", "FR"],
        states: [],
        zipCodes: [],
      },
    },

    // Attributes (EAV system)
    attributes: options.attributes || [
      {
        attributeId: 1,
        attributeCode: "color",
        value: "black",
      },
      {
        attributeId: 2,
        attributeCode: "material",
        value: "premium",
      },
      {
        attributeId: 3,
        attributeCode: "warranty",
        value: "2 years",
      },
    ],
    customAttributes: options.customAttributes || {
      featured_in_homepage: true,
      seasonal_collection: "spring_2024",
      eco_friendly: true,
    },

    // Relationships
    relatedProducts: options.relatedProducts || [],

    // Reviews and Ratings
    reviews,
    ratings,
    averageRating: options.averageRating || 4.5,
    totalReviews: reviews.length,

    // SEO and Marketing
    seo: {
      title: `${name} - ${brand?.name || "Premium Quality"}`,
      description: shortDescription,
      keywords: [name, brand?.name, category.name].filter(
        (keyword): keyword is string => Boolean(keyword)
      ),
      canonicalUrl: `/products/${name.toLowerCase().replace(/\s+/g, "-")}`,
      robots: "index, follow",
      openGraph: {
        title: name,
        description: shortDescription,
        image: images[0]?.url,
        type: "product",
      },
      twitter: {
        card: "summary_large_image",
        title: name,
        description: shortDescription,
        image: images[0]?.url,
      },
    },
    featured: options.featured || false,
    newFrom: options.newFrom,
    newTo: options.newTo,

    // Status and Publishing
    status: "active",
    visibility: "catalog_search",
    publishedAt: "2024-01-01T00:00:00Z",

    // Product Type
    productType: options.productType || "simple",

    // Additional metadata
    metadata: {
      created_by_admin: true,
      last_sync: "2024-01-15T10:30:00Z",
      external_id: `ext_${id}`,
      source: "manual",
    },

    // Audit fields
    createdBy: 1,
    updatedBy: 1,
    version: 1,
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  };
}

// Enhanced Mock Products with comprehensive data
export const MOCK_PRODUCTS_ENHANCED: Product[] = [
  createEnhancedProduct(
    1,
    "iPhone 15 Pro Max",
    "The most advanced iPhone ever with titanium design, A17 Pro chip, and professional camera system. Features a 6.7-inch Super Retina XDR display, 48MP main camera with 5x optical zoom, and all-day battery life.",
    "Latest iPhone with titanium design and advanced camera system",
    1199.99,
    2, // Smartphones category
    1, // Apple brand
    {
      compareAtPrice: 1299.99,
      averageRating: 4.8,
      featured: true,
      productType: "simple",
      tags: ["smartphone", "apple", "premium", "camera", "titanium"],
      newFrom: "2024-01-15T00:00:00Z",
      newTo: "2024-06-15T00:00:00Z",
      attributes: [
        { attributeId: 1, attributeCode: "color", value: "natural_titanium" },
        { attributeId: 2, attributeCode: "storage", value: "256GB" },
        { attributeId: 3, attributeCode: "screen_size", value: "6.7 inch" },
        { attributeId: 4, attributeCode: "camera", value: "48MP" },
        { attributeId: 5, attributeCode: "battery", value: "all_day" },
      ],
      customAttributes: {
        wireless_charging: true,
        water_resistant: true,
        face_id: true,
        touch_id: false,
        dual_sim: true,
      },
    }
  ),

  createEnhancedProduct(
    2,
    "Samsung Galaxy S24 Ultra",
    "Premium Android smartphone with S Pen, advanced AI features, and titanium construction. Features a 6.8-inch Dynamic AMOLED 2X display, 200MP camera system, and powerful Snapdragon 8 Gen 3 processor.",
    "Premium Android smartphone with S Pen and advanced AI features",
    1299.99,
    2, // Smartphones category
    2, // Samsung brand
    {
      averageRating: 4.7,
      featured: true,
      productType: "simple",
      tags: ["smartphone", "samsung", "android", "s_pen", "ai"],
      attributes: [
        { attributeId: 1, attributeCode: "color", value: "titanium_black" },
        { attributeId: 2, attributeCode: "storage", value: "512GB" },
        { attributeId: 3, attributeCode: "screen_size", value: "6.8 inch" },
        { attributeId: 4, attributeCode: "camera", value: "200MP" },
        { attributeId: 5, attributeCode: "s_pen", value: "included" },
      ],
      customAttributes: {
        wireless_charging: true,
        water_resistant: true,
        face_id: true,
        fingerprint_sensor: true,
        dual_sim: true,
        ai_features: true,
      },
    }
  ),

  createEnhancedProduct(
    3,
    "MacBook Pro 16-inch",
    "Powerful laptop with M3 Pro chip for professionals. Features a 16.2-inch Liquid Retina XDR display, up to 22 hours of battery life, and advanced connectivity options.",
    "Powerful laptop with M3 Pro chip for professionals",
    2499.99,
    3, // Laptops category
    1, // Apple brand
    {
      compareAtPrice: 2699.99,
      averageRating: 4.9,
      featured: true,
      productType: "configurable",
      tags: ["laptop", "macbook", "professional", "m3_pro", "retina"],
      attributes: [
        { attributeId: 1, attributeCode: "color", value: "space_black" },
        { attributeId: 2, attributeCode: "storage", value: "1TB" },
        { attributeId: 3, attributeCode: "memory", value: "18GB" },
        { attributeId: 4, attributeCode: "processor", value: "M3 Pro" },
        { attributeId: 5, attributeCode: "screen_size", value: "16.2 inch" },
      ],
      customAttributes: {
        touch_bar: false,
        touch_id: true,
        face_id: false,
        thunderbolt_ports: 3,
        hdmi_port: true,
        sd_card_slot: true,
      },
    }
  ),

  createEnhancedProduct(
    4,
    "Nike Air Max 270",
    "Comfortable running shoes with Max Air cushioning technology. Features breathable mesh upper, rubber outsole for durability, and modern design perfect for daily wear.",
    "Comfortable running shoes with Max Air cushioning",
    150.99,
    5, // Shoes category
    3, // Nike brand
    {
      compareAtPrice: 180.99,
      averageRating: 4.4,
      featured: false,
      productType: "simple",
      tags: ["shoes", "nike", "running", "air_max", "comfortable"],
      attributes: [
        { attributeId: 1, attributeCode: "color", value: "white" },
        { attributeId: 2, attributeCode: "size", value: "10" },
        { attributeId: 3, attributeCode: "material", value: "mesh" },
        { attributeId: 4, attributeCode: "cushioning", value: "max_air" },
        { attributeId: 5, attributeCode: "style", value: "running" },
      ],
      customAttributes: {
        breathable: true,
        lightweight: true,
        durable: true,
        machine_washable: false,
        vegan_friendly: false,
      },
    }
  ),
];

// Export legacy compatibility
export const MOCK_PRODUCTS = MOCK_PRODUCTS_ENHANCED;
export const MOCK_CATEGORIES_LEGACY = MOCK_CATEGORIES;
export const MOCK_BRANDS_LEGACY = MOCK_BRANDS;
