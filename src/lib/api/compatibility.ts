// Compatibility layer to bridge existing mock API with new API structure
import { fakeProducts } from "@/constants/mock-api";
import type { Product as MockProduct } from "@/constants/mock-api";
import type { ProductListResponse, QueryParams } from "@/lib/api/types";

// Transform the existing mock API response to match the new API structure
export const transformMockResponse = async (
  params: QueryParams = {}
): Promise<ProductListResponse> => {
  const mockResponse = await fakeProducts.getProducts({
    page: params.page || 1,
    limit: params.limit || 10,
    search: params.search,
    categories: params.filters?.category,
  });

  // Transform mock products to API products
  const products = mockResponse.products.map(transformMockProductToApi);

  return {
    products,
    pagination: {
      page: params.page || 1,
      limit: params.limit || 10,
      total: mockResponse.total_products,
      totalPages: Math.ceil(mockResponse.total_products / (params.limit || 10)),
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
        options: [
          { value: "Electronics", label: "Electronics", count: 5 },
          { value: "Clothing", label: "Clothing", count: 3 },
          { value: "Books", label: "Books", count: 2 },
        ],
      },
    ],
  };
};

// Transform mock product to API product structure
const transformMockProductToApi = (mockProduct: MockProduct) => {
  return {
    id: mockProduct.id,
    name: mockProduct.name,
    description: mockProduct.description,
    price: mockProduct.price,
    compareAtPrice: mockProduct.price * 1.2,
    sku: `SKU-${mockProduct.id.toString().padStart(6, "0")}`,
    barcode: `123456789${mockProduct.id}`,
    weight: Math.random() * 5 + 0.1,
    dimensions: {
      length: Math.random() * 50 + 10,
      width: Math.random() * 30 + 5,
      height: Math.random() * 20 + 2,
    },
    category: {
      id: 1,
      name: mockProduct.category,
      slug: mockProduct.category.toLowerCase(),
      description: `${mockProduct.category} products`,
      level: 1,
      path: mockProduct.category.toLowerCase(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      seo: {
        title: mockProduct.category,
        description: `${mockProduct.category} products`,
      },
    },
    brand: {
      id: 1,
      name: "Generic Brand",
      slug: "generic-brand",
      description: "Generic brand products",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      seo: { title: "Generic Brand", description: "Generic brand products" },
    },
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

// Backward compatibility function for existing components
export const getProductsCompatible = async (params: QueryParams = {}) => {
  if (process.env.NEXT_PUBLIC_API_MODE === "mock") {
    return await transformMockResponse(params);
  }

  // If using real API, this would call the actual API service
  // For now, fallback to mock
  return await transformMockResponse(params);
};
