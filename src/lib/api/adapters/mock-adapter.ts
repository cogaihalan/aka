import { fakeProducts } from "@/constants/mock-api";
import type { Product as MockProduct } from "@/constants/mock-api";
import type {
  Product,
  ProductListResponse,
  CreateProductRequest,
  UpdateProductRequest,
  QueryParams,
  Category,
  Brand,
  Order,
  OrderListResponse,
  Customer,
  CustomerListResponse,
  AnalyticsOverview,
  SalesData,
  TopProduct,
  CustomerAnalytics,
  Cart,
  CartItem,
  SearchResult,
} from "../types";

// Mock data generators
const generateMockCategories = (): Category[] => [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices and gadgets",
    level: 1,
    path: "electronics",
    isActive: true,
    includeInMenu: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    seo: { title: "Electronics", description: "Electronic devices" },
  },
  {
    id: 2,
    name: "Clothing",
    slug: "clothing",
    description: "Fashion and apparel",
    level: 1,
    path: "clothing",
    isActive: true,
    includeInMenu: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    seo: { title: "Clothing", description: "Fashion and apparel" },
  },
  {
    id: 3,
    name: "Books",
    slug: "books",
    description: "Books and literature",
    level: 1,
    path: "books",
    isActive: true,
    includeInMenu: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    seo: { title: "Books", description: "Books and literature" },
  },
];

const generateMockBrands = (): Brand[] => [
  {
    id: 1,
    name: "Apple",
    slug: "apple",
    description: "Technology company",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    seo: { title: "Apple", description: "Apple products" },
  },
  {
    id: 2,
    name: "Samsung",
    slug: "samsung",
    description: "Electronics manufacturer",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    seo: { title: "Samsung", description: "Samsung products" },
  },
];

// Transform mock product to API product
const transformMockProductToApi = (mockProduct: MockProduct): Product => {
  const categories = generateMockCategories();
  const brands = generateMockBrands();

  return {
    id: mockProduct.id,
    name: mockProduct.name,
    description: mockProduct.description,
    price: mockProduct.price,
    compareAtPrice: mockProduct.price * 1.2, // 20% markup
    sku: `SKU-${mockProduct.id.toString().padStart(6, "0")}`,
    barcode: `123456789${mockProduct.id}`,
    weight: Math.random() * 5 + 0.1, // 0.1 to 5.1 kg
    dimensions: {
      length: Math.random() * 50 + 10,
      width: Math.random() * 30 + 5,
      height: Math.random() * 20 + 2,
    },
    category:
      categories.find((c) => c.name === mockProduct.category) || categories[0],
    brand: brands[Math.floor(Math.random() * brands.length)],
    tags: [mockProduct.category.toLowerCase(), "featured"],
    images: [
      {
        id: 1,
        url: mockProduct.photo_url,
        alt: mockProduct.name,
        order: 1,
        isPrimary: true,
      },
    ],
    variants: [],
    inventory: {
      quantity: Math.floor(Math.random() * 100) + 10,
      reserved: 0,
      available: Math.floor(Math.random() * 100) + 10,
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 10,
    },
    seo: {
      title: mockProduct.name,
      description: mockProduct.description,
      keywords: [mockProduct.category, mockProduct.name.split(" ")[0]],
    },
    status: "active" as const,
    featured: Math.random() > 0.7,
    createdAt: mockProduct.created_at,
    updatedAt: mockProduct.updated_at,
    publishedAt: mockProduct.created_at,
  };
};

// Mock API Adapter for Products
export class MockProductAdapter {
  async getProducts(params: QueryParams = {}): Promise<ProductListResponse> {
    const mockResponse = await fakeProducts.getProducts({
      page: params.page || 1,
      limit: params.limit || 10,
      search: params.search,
      categories: params.filters?.category,
    });

    const products = mockResponse.products.map(transformMockProductToApi);

    return {
      products,
      pagination: {
        page: params.page || 1,
        limit: params.limit || 10,
        total: mockResponse.total_products,
        totalPages: Math.ceil(
          mockResponse.total_products / (params.limit || 10)
        ),
        hasNext:
          (params.page || 1) <
          Math.ceil(mockResponse.total_products / (params.limit || 10)),
        hasPrev: (params.page || 1) > 1,
      },
      filters: [
        {
          key: "category",
          label: "Category",
          type: "multiselect" as const,
          options: generateMockCategories().map((cat) => ({
            value: cat.name,
            label: cat.name,
            count: Math.floor(Math.random() * 50) + 1,
          })),
        },
        {
          key: "priceRange",
          label: "Price Range",
          type: "range" as const,
          options: [],
        },
      ],
    };
  }

  async getProduct(id: number): Promise<Product> {
    const mockResponse = await fakeProducts.getProductById(id);

    if (!mockResponse.success || !mockResponse.product) {
      throw new Error(mockResponse.message);
    }

    return transformMockProductToApi(mockResponse.product);
  }

  async createProduct(data: CreateProductRequest): Promise<Product> {
    // Generate new ID
    const newId = Math.max(...fakeProducts.records.map((p) => p.id)) + 1;

    const newMockProduct: MockProduct = {
      id: newId,
      name: data.name,
      description: data.description,
      price: data.price,
      photo_url: `https://api.slingacademy.com/public/sample-products/${newId}.png`,
      category:
        data.categoryId === 1
          ? "Electronics"
          : data.categoryId === 2
            ? "Clothing"
            : "Books",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    fakeProducts.records.push(newMockProduct);
    return transformMockProductToApi(newMockProduct);
  }

  async updateProduct(
    id: number,
    data: UpdateProductRequest
  ): Promise<Product> {
    const productIndex = fakeProducts.records.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }

    const updatedMockProduct = {
      ...fakeProducts.records[productIndex],
      ...data,
      updated_at: new Date().toISOString(),
    };

    fakeProducts.records[productIndex] = updatedMockProduct;
    return transformMockProductToApi(updatedMockProduct);
  }

  async deleteProduct(id: number): Promise<void> {
    const productIndex = fakeProducts.records.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }

    fakeProducts.records.splice(productIndex, 1);
  }

  async getCategories(): Promise<Category[]> {
    return generateMockCategories();
  }

  async getBrands(): Promise<Brand[]> {
    return generateMockBrands();
  }
}

// Mock API Adapter for Orders
export class MockOrderAdapter {
  private orders: Order[] = [];

  constructor() {
    this.initializeMockOrders();
  }

  private initializeMockOrders() {
    // Generate some mock orders
    for (let i = 1; i <= 10; i++) {
      this.orders.push({
        id: i,
        orderNumber: `ORD-${i.toString().padStart(6, "0")}`,
        status: ["pending", "confirmed", "processing", "shipped", "delivered"][
          Math.floor(Math.random() * 5)
        ] as any,
        paymentStatus: ["pending", "paid", "failed"][
          Math.floor(Math.random() * 3)
        ] as any,
        fulfillmentStatus: ["unfulfilled", "partial", "fulfilled"][
          Math.floor(Math.random() * 3)
        ] as any,
        customer: {
          id: i,
          email: `customer${i}@example.com`,
          firstName: `Customer${i}`,
          lastName: "Doe",
          addresses: [],
          preferences: {
            newsletter: true,
            sms: false,
            language: "en",
            currency: "USD",
            timezone: "UTC",
          },
          tags: [],
          status: "active" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        shippingAddress: {
          id: 1,
          type: "shipping" as const,
          firstName: `Customer${i}`,
          lastName: "Doe",
          address1: `${i} Main St`,
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "US",
          isDefault: true,
        },
        billingAddress: {
          id: 2,
          type: "billing" as const,
          firstName: `Customer${i}`,
          lastName: "Doe",
          address1: `${i} Main St`,
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "US",
          isDefault: true,
        },
        items: [],
        pricing: {
          subtotal: Math.random() * 1000 + 100,
          tax: 0,
          shipping: 10,
          discount: 0,
          total: 0,
          currency: "USD",
        },
        shipping: {
          method: "Standard",
          cost: 10,
          estimatedDelivery: "3-5",
        },
        payment: {
          method: "Credit Card",
          gateway: "stripe",
          status: "paid" as const,
          processedAt: new Date().toISOString(),
        },
        notes: "",
        tags: [],
        createdAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  async getOrders(params: QueryParams = {}): Promise<OrderListResponse> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    let filteredOrders = [...this.orders];

    // Apply search filter
    if (params.search) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.orderNumber
            .toLowerCase()
            .includes(params.search!.toLowerCase()) ||
          order.customer.email
            .toLowerCase()
            .includes(params.search!.toLowerCase())
      );
    }

    // Apply status filter
    if (params.filters?.status) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === params.filters!.status
      );
    }

    const paginatedOrders = filteredOrders.slice(offset, offset + limit);

    return {
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total: filteredOrders.length,
        totalPages: Math.ceil(filteredOrders.length / limit),
        hasNext: page < Math.ceil(filteredOrders.length / limit),
        hasPrev: page > 1,
      },
    };
  }

  async getOrder(id: number): Promise<Order> {
    const order = this.orders.find((o) => o.id === id);
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }
    return order;
  }
}

// Mock API Adapter for Analytics
export class MockAnalyticsAdapter {
  async getOverview(period?: string): Promise<AnalyticsOverview> {
    return {
      totalRevenue: 125000,
      totalOrders: 150,
      totalCustomers: 89,
      averageOrderValue: 833.33,
      conversionRate: 3.2,
      period: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date().toISOString(),
      },
    };
  }

  async getSalesData(
    period: string = "30d",
    granularity: "day" | "week" | "month" = "day"
  ): Promise<SalesData[]> {
    const days = period === "30d" ? 30 : period === "7d" ? 7 : 90;
    const data: SalesData[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      data.push({
        date: date.toISOString().split("T")[0],
        revenue: Math.random() * 5000 + 1000,
        orders: Math.floor(Math.random() * 20) + 1,
        customers: Math.floor(Math.random() * 15) + 1,
      });
    }

    return data;
  }

  async getTopProducts(
    period?: string,
    limit: number = 10
  ): Promise<TopProduct[]> {
    const mockProducts = fakeProducts.records.slice(0, limit);
    return mockProducts.map((product) => ({
      product: transformMockProductToApi(product),
      revenue: Math.random() * 10000 + 1000,
      quantity: Math.floor(Math.random() * 100) + 10,
      orders: Math.floor(Math.random() * 50) + 5,
    }));
  }

  async getCustomerAnalytics(period?: string): Promise<CustomerAnalytics> {
    return {
      newCustomers: 25,
      returningCustomers: 64,
      customerLifetimeValue: 1400,
      churnRate: 0.05,
    };
  }
}

// Mock API Adapter for Cart
export class MockCartAdapter {
  private cart: Cart = {
    id: "mock-cart-1",
    items: [],
    pricing: {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      currency: "USD",
    },
    appliedCoupons: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  async getCart(): Promise<Cart> {
    return this.cart;
  }

  async addItem(data: {
    productId: number;
    variantId?: number;
    quantity: number;
  }): Promise<Cart> {
    const mockProduct = fakeProducts.records.find(
      (p) => p.id === data.productId
    );
    if (!mockProduct) {
      throw new Error(`Product with ID ${data.productId} not found`);
    }

    const existingItem = this.cart.items.find(
      (item) => item.product.id === data.productId
    );

    if (existingItem) {
      existingItem.quantity += data.quantity;
    } else {
      const cartItem: CartItem = {
        id: `item-${Date.now()}`,
        product: transformMockProductToApi(mockProduct),
        variant: data.variantId ? undefined : undefined,
        quantity: data.quantity,
        addedAt: new Date().toISOString(),
      };
      this.cart.items.push(cartItem);
    }

    this.updateCartPricing();
    return this.cart;
  }

  async updateItemQuantity(itemId: string, quantity: number): Promise<Cart> {
    const item = this.cart.items.find((i) => i.id === itemId);
    if (!item) {
      throw new Error(`Cart item with ID ${itemId} not found`);
    }

    if (quantity <= 0) {
      this.cart.items = this.cart.items.filter((i) => i.id !== itemId);
    } else {
      item.quantity = quantity;
    }

    this.updateCartPricing();
    return this.cart;
  }

  async removeItem(itemId: string): Promise<Cart> {
    this.cart.items = this.cart.items.filter((i) => i.id !== itemId);
    this.updateCartPricing();
    return this.cart;
  }

  private updateCartPricing() {
    const subtotal = this.cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    this.cart.pricing = {
      subtotal,
      tax: subtotal * 0.08, // 8% tax
      shipping: subtotal > 100 ? 0 : 10, // Free shipping over $100
      discount: 0,
      total: subtotal + subtotal * 0.08 + (subtotal > 100 ? 0 : 10),
      currency: "USD",
    };
  }
}

// Export all adapters
export const mockProductAdapter = new MockProductAdapter();
export const mockOrderAdapter = new MockOrderAdapter();
export const mockAnalyticsAdapter = new MockAnalyticsAdapter();
export const mockCartAdapter = new MockCartAdapter();
