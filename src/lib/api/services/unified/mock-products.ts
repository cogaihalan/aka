import type {
  Product,
  ProductListResponse,
  QueryParams,
  ProductQuery,
  ProductSearchResult,
} from "@/lib/api/types";
import { ALL_DEV_PRODUCTS } from "@/constants/products";

class MockUnifiedProductService {
  // Legacy methods for backward compatibility
  async getProducts(params: QueryParams = {}): Promise<ProductListResponse> {
    // Use fake data from ALL_DEV_PRODUCTS
    let filteredProducts = [...ALL_DEV_PRODUCTS];

    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply category filter
    if (params.filters?.categoryId) {
      filteredProducts = filteredProducts.filter((product) =>
        product.categories.some((cat) => cat.id === params.filters!.categoryId)
      );
    }

    // Apply brand filter
    if (params.filters?.brandId) {
      filteredProducts = filteredProducts.filter(
        (product) => product.brand?.id === params.filters!.brandId
      );
    }

    // Apply status filter
    if (params.filters?.status) {
      filteredProducts = filteredProducts.filter(
        (product) => product.status === params.filters!.status
      );
    }

    // Apply featured filter
    if (params.filters?.featured !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.featured === params.filters!.featured
      );
    }

    // Apply price range filter
    if (
      params.filters?.priceMin !== undefined ||
      params.filters?.priceMax !== undefined
    ) {
      filteredProducts = filteredProducts.filter((product) => {
        const price = product.pricing.basePrice;
        const minPrice = params.filters!.priceMin ?? 0;
        const maxPrice = params.filters!.priceMax ?? Infinity;
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Apply sorting
    if (params.sortBy) {
      filteredProducts.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (params.sortBy) {
          case "name":
            aValue = a.name;
            bValue = b.name;
            break;
          case "price":
            aValue = a.pricing.basePrice;
            bValue = b.pricing.basePrice;
            break;
          case "createdAt":
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case "rating":
            aValue = a.averageRating;
            bValue = b.averageRating;
            break;
          default:
            aValue = a.name;
            bValue = b.name;
        }

        if (aValue < bValue) return params.sortOrder === "desc" ? 1 : -1;
        if (aValue > bValue) return params.sortOrder === "desc" ? -1 : 1;
        return 0;
      });
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: [
        {
          key: "categoryId",
          label: "Category",
          type: "select",
          options: [
            {
              value: 1,
              label: "Electronics",
              count: ALL_DEV_PRODUCTS.filter((p) =>
                p.categories.some((c) => c.id === 1)
              ).length,
            },
            {
              value: 2,
              label: "Smartphones",
              count: ALL_DEV_PRODUCTS.filter((p) =>
                p.categories.some((c) => c.id === 2)
              ).length,
            },
            {
              value: 3,
              label: "Laptops",
              count: ALL_DEV_PRODUCTS.filter((p) =>
                p.categories.some((c) => c.id === 3)
              ).length,
            },
            {
              value: 4,
              label: "Fashion",
              count: ALL_DEV_PRODUCTS.filter((p) =>
                p.categories.some((c) => c.id === 4)
              ).length,
            },
            {
              value: 5,
              label: "Home & Garden",
              count: ALL_DEV_PRODUCTS.filter((p) =>
                p.categories.some((c) => c.id === 5)
              ).length,
            },
          ],
        },
        {
          key: "brandId",
          label: "Brand",
          type: "select",
          options: [
            {
              value: 1,
              label: "Apple",
              count: ALL_DEV_PRODUCTS.filter((p) => p.brand?.id === 1).length,
            },
            {
              value: 2,
              label: "Samsung",
              count: ALL_DEV_PRODUCTS.filter((p) => p.brand?.id === 2).length,
            },
            {
              value: 3,
              label: "Nike",
              count: ALL_DEV_PRODUCTS.filter((p) => p.brand?.id === 3).length,
            },
          ],
        },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            {
              value: "active",
              label: "Active",
              count: ALL_DEV_PRODUCTS.filter((p) => p.status === "active")
                .length,
            },
            {
              value: "inactive",
              label: "Inactive",
              count: ALL_DEV_PRODUCTS.filter((p) => p.status === "inactive")
                .length,
            },
          ],
        },
        {
          key: "featured",
          label: "Featured",
          type: "boolean",
          options: [
            {
              value: true,
              label: "Featured",
              count: ALL_DEV_PRODUCTS.filter((p) => p.featured).length,
            },
            {
              value: false,
              label: "Regular",
              count: ALL_DEV_PRODUCTS.filter((p) => !p.featured).length,
            },
          ],
        },
      ],
    };
  }

  // Enhanced product search with comprehensive filtering
  async searchProducts(
    params: ProductQuery = {}
  ): Promise<ProductSearchResult> {
    // Use fake data from ALL_DEV_PRODUCTS
    let filteredProducts = [...ALL_DEV_PRODUCTS];

    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply category filter
    if (params.categoryIds?.length) {
      filteredProducts = filteredProducts.filter((product) =>
        product.categories.some((cat) => params.categoryIds!.includes(cat.id))
      );
    }

    // Apply brand filter
    if (params.brandIds?.length) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.brand && params.brandIds!.includes(product.brand.id)
      );
    }

    // Apply price range filter
    if (params.priceRange) {
      filteredProducts = filteredProducts.filter((product) => {
        const price = product.pricing.basePrice;
        return (
          price >= params.priceRange!.min && price <= params.priceRange!.max
        );
      });
    }

    // Apply status filter
    if (params.status?.length) {
      filteredProducts = filteredProducts.filter((product) =>
        params.status!.includes(product.status)
      );
    }

    // Apply featured filter
    if (params.featured !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.featured === params.featured
      );
    }

    // Apply in stock filter
    if (params.inStock !== undefined) {
      filteredProducts = filteredProducts.filter((product) => {
        const isInStock = product.inventory.stockStatus === "in_stock";
        return params.inStock ? isInStock : !isInStock;
      });
    }

    // Apply tags filter
    if (params.tags?.length) {
      filteredProducts = filteredProducts.filter((product) =>
        params.tags!.some((tag) => product.tags.includes(tag))
      );
    }

    // Apply date range filter
    if (params.createdFrom || params.createdTo) {
      filteredProducts = filteredProducts.filter((product) => {
        const productDate = new Date(product.createdAt);
        if (params.createdFrom && productDate < new Date(params.createdFrom)) {
          return false;
        }
        if (params.createdTo && productDate > new Date(params.createdTo)) {
          return false;
        }
        return true;
      });
    }

    // Apply sorting
    if (params.sortBy) {
      filteredProducts.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (params.sortBy) {
          case "name":
            aValue = a.name;
            bValue = b.name;
            break;
          case "price":
            aValue = a.pricing.basePrice;
            bValue = b.pricing.basePrice;
            break;
          case "createdAt":
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case "rating":
            aValue = a.averageRating;
            bValue = b.averageRating;
            break;
          default:
            aValue = a.name;
            bValue = b.name;
        }

        if (aValue < bValue) return params.sortOrder === "desc" ? 1 : -1;
        if (aValue > bValue) return params.sortOrder === "desc" ? -1 : 1;
        return 0;
      });
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      total,
      page,
      limit,
      totalPages,
      facets: {
        categories: [
          {
            id: 1,
            name: "Electronics",
            count: ALL_DEV_PRODUCTS.filter((p) =>
              p.categories.some((c) => c.id === 1)
            ).length,
          },
          {
            id: 2,
            name: "Smartphones",
            count: ALL_DEV_PRODUCTS.filter((p) =>
              p.categories.some((c) => c.id === 2)
            ).length,
          },
          {
            id: 3,
            name: "Laptops",
            count: ALL_DEV_PRODUCTS.filter((p) =>
              p.categories.some((c) => c.id === 3)
            ).length,
          },
          {
            id: 4,
            name: "Fashion",
            count: ALL_DEV_PRODUCTS.filter((p) =>
              p.categories.some((c) => c.id === 4)
            ).length,
          },
          {
            id: 5,
            name: "Home & Garden",
            count: ALL_DEV_PRODUCTS.filter((p) =>
              p.categories.some((c) => c.id === 5)
            ).length,
          },
        ],
        brands: [
          {
            id: 1,
            name: "Apple",
            count: ALL_DEV_PRODUCTS.filter((p) => p.brand?.id === 1).length,
          },
          {
            id: 2,
            name: "Samsung",
            count: ALL_DEV_PRODUCTS.filter((p) => p.brand?.id === 2).length,
          },
          {
            id: 3,
            name: "Nike",
            count: ALL_DEV_PRODUCTS.filter((p) => p.brand?.id === 3).length,
          },
        ],
        priceRanges: [
          {
            min: 0,
            max: 100,
            count: ALL_DEV_PRODUCTS.filter(
              (p) => p.pricing.basePrice >= 0 && p.pricing.basePrice <= 100
            ).length,
          },
          {
            min: 100,
            max: 500,
            count: ALL_DEV_PRODUCTS.filter(
              (p) => p.pricing.basePrice > 100 && p.pricing.basePrice <= 500
            ).length,
          },
          {
            min: 500,
            max: 1000,
            count: ALL_DEV_PRODUCTS.filter(
              (p) => p.pricing.basePrice > 500 && p.pricing.basePrice <= 1000
            ).length,
          },
          {
            min: 1000,
            max: Infinity,
            count: ALL_DEV_PRODUCTS.filter((p) => p.pricing.basePrice > 1000)
              .length,
          },
        ],
        attributes: {
          status: [
            {
              value: "active",
              count: ALL_DEV_PRODUCTS.filter((p) => p.status === "active")
                .length,
            },
            {
              value: "inactive",
              count: ALL_DEV_PRODUCTS.filter((p) => p.status === "inactive")
                .length,
            },
          ],
          featured: [
            {
              value: "true",
              count: ALL_DEV_PRODUCTS.filter((p) => p.featured).length,
            },
            {
              value: "false",
              count: ALL_DEV_PRODUCTS.filter((p) => !p.featured).length,
            },
          ],
        },
      },
    };
  }

  // Basic CRUD operations
  async getProduct(id: number): Promise<Product> {
    // Use fake data from ALL_DEV_PRODUCTS
    const product = ALL_DEV_PRODUCTS.find((p) => p.id === id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }
}

export const mockUnifiedProductService = new MockUnifiedProductService();
