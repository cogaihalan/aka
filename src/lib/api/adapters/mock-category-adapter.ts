import { faker } from "@faker-js/faker";
import type {
  Category,
  CategoryTree,
  CategoryWithProducts,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryListResponse,
  CategoryTreeResponse,
  QueryParams,
  Product,
  CategoryProductAssignment,
} from "@/lib/api/types";

// Mock category data store
class MockCategoryStore {
  private categories: Category[] = [];
  private categoryProducts: Map<number, number[]> = new Map(); // categoryId -> productIds
  private nextId = 1;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Create root categories
    const rootCategories = [
      {
        id: this.nextId++,
        name: "Electronics",
        slug: "electronics",
        description: "Electronic devices and accessories",
        parentId: undefined,
        level: 0,
        path: "1",
        image:
          "https://api.slingacademy.com/public/sample-categories/electronics.png",
        seo: {
          title: "Electronics - Best Electronic Devices",
          description: "Shop the latest electronic devices and accessories",
          keywords: ["electronics", "devices", "gadgets"],
        },
        isActive: true,
        sortOrder: 1,
        includeInMenu: true,
        productCount: 0,
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
      },
      {
        id: this.nextId++,
        name: "Fashion",
        slug: "fashion",
        description: "Clothing and fashion accessories",
        parentId: undefined,
        level: 0,
        path: "2",
        image:
          "https://api.slingacademy.com/public/sample-categories/fashion.png",
        seo: {
          title: "Fashion - Latest Trends",
          description: "Discover the latest fashion trends and styles",
          keywords: ["fashion", "clothing", "style"],
        },
        isActive: true,
        sortOrder: 2,
        includeInMenu: true,
        productCount: 0,
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
      },
      {
        id: this.nextId++,
        name: "Home & Garden",
        slug: "home-garden",
        description: "Home improvement and garden supplies",
        parentId: undefined,
        level: 0,
        path: "3",
        image:
          "https://api.slingacademy.com/public/sample-categories/home-garden.png",
        seo: {
          title: "Home & Garden - Everything for Your Home",
          description: "Transform your home with our home and garden products",
          keywords: ["home", "garden", "furniture"],
        },
        isActive: true,
        sortOrder: 3,
        includeInMenu: true,
        productCount: 0,
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
      },
    ];

    this.categories = rootCategories;

    // Create subcategories
    const subcategories = [
      // Electronics subcategories
      {
        id: this.nextId++,
        name: "Smartphones",
        slug: "smartphones",
        description: "Latest smartphones and mobile devices",
        parentId: 1,
        level: 1,
        path: "1/4",
        seo: {
          title: "Smartphones - Latest Mobile Devices",
          description: "Shop the latest smartphones and mobile devices",
          keywords: ["smartphones", "mobile", "phones"],
        },
        isActive: true,
        sortOrder: 1,
        includeInMenu: true,
        productCount: 0,
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
      },
      {
        id: this.nextId++,
        name: "Laptops",
        slug: "laptops",
        description: "Laptops and portable computers",
        parentId: 1,
        level: 1,
        path: "1/5",
        seo: {
          title: "Laptops - Portable Computers",
          description: "Find the perfect laptop for your needs",
          keywords: ["laptops", "computers", "portable"],
        },
        isActive: true,
        sortOrder: 2,
        includeInMenu: true,
        productCount: 0,
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
      },
      // Fashion subcategories
      {
        id: this.nextId++,
        name: "Men's Clothing",
        slug: "mens-clothing",
        description: "Men's fashion and clothing",
        parentId: 2,
        level: 1,
        path: "2/6",
        seo: {
          title: "Men's Clothing - Latest Fashion",
          description: "Shop the latest men's clothing and fashion",
          keywords: ["mens", "clothing", "fashion"],
        },
        isActive: true,
        sortOrder: 1,
        includeInMenu: true,
        productCount: 0,
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
      },
      {
        id: this.nextId++,
        name: "Women's Clothing",
        slug: "womens-clothing",
        description: "Women's fashion and clothing",
        parentId: 2,
        level: 1,
        path: "2/7",
        seo: {
          title: "Women's Clothing - Latest Fashion",
          description: "Shop the latest women's clothing and fashion",
          keywords: ["womens", "clothing", "fashion"],
        },
        isActive: true,
        sortOrder: 2,
        includeInMenu: true,
        productCount: 0,
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
      },
    ];

    this.categories.push(...subcategories);

    // Create some third-level categories
    const thirdLevelCategories = [
      {
        id: this.nextId++,
        name: "iPhone",
        slug: "iphone",
        description: "Apple iPhone smartphones",
        parentId: 4,
        level: 2,
        path: "1/4/8",
        seo: {
          title: "iPhone - Apple Smartphones",
          description: "Shop the latest iPhone models",
          keywords: ["iphone", "apple", "smartphone"],
        },
        isActive: true,
        sortOrder: 1,
        includeInMenu: true,
        productCount: 0,
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
      },
      {
        id: this.nextId++,
        name: "Android",
        slug: "android",
        description: "Android smartphones",
        parentId: 4,
        level: 2,
        path: "1/4/9",
        seo: {
          title: "Android - Android Smartphones",
          description: "Shop the latest Android smartphones",
          keywords: ["android", "smartphone", "mobile"],
        },
        isActive: true,
        sortOrder: 2,
        includeInMenu: true,
        productCount: 0,
        createdAt: faker.date.past().toISOString(),
        updatedAt: faker.date.recent().toISOString(),
      },
    ];

    this.categories.push(...thirdLevelCategories);

    // Simulate some product assignments
    this.categoryProducts.set(1, [1, 2, 3, 4, 5]); // Electronics
    this.categoryProducts.set(2, [6, 7, 8, 9, 10]); // Fashion
    this.categoryProducts.set(3, [11, 12, 13, 14, 15]); // Home & Garden
    this.categoryProducts.set(4, [1, 2, 3]); // Smartphones
    this.categoryProducts.set(5, [4, 5]); // Laptops
    this.categoryProducts.set(6, [6, 7, 8]); // Men's Clothing
    this.categoryProducts.set(7, [9, 10]); // Women's Clothing
    this.categoryProducts.set(8, [1, 2]); // iPhone
    this.categoryProducts.set(9, [3]); // Android

    // Update product counts
    this.updateProductCounts();
  }

  private updateProductCounts() {
    this.categories.forEach((category) => {
      const productIds = this.categoryProducts.get(category.id) || [];
      category.productCount = productIds.length;
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  private buildPath(category: Category): string {
    if (!category.parentId) {
      return category.id.toString();
    }

    const parent = this.categories.find((c) => c.id === category.parentId);
    if (!parent) {
      return category.id.toString();
    }

    return `${parent.path}/${category.id}`;
  }

  private calculateLevel(category: Category): number {
    if (!category.parentId) {
      return 0;
    }

    const parent = this.categories.find((c) => c.id === category.parentId);
    if (!parent) {
      return 0;
    }

    return parent.level + 1;
  }

  // Get all categories with filtering
  async getCategories(params: QueryParams = {}): Promise<CategoryListResponse> {
    const {
      page = 1,
      limit = 20,
      search,
      sortBy = "name",
      sortOrder = "asc",
      filters = {},
    } = params;

    let filteredCategories = [...this.categories];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCategories = filteredCategories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchLower) ||
          category.description?.toLowerCase().includes(searchLower) ||
          category.slug.toLowerCase().includes(searchLower)
      );
    }

    // Apply other filters
    if (filters.isActive !== undefined) {
      filteredCategories = filteredCategories.filter(
        (category) => category.isActive === filters.isActive
      );
    }

    if (filters.parentId !== undefined) {
      filteredCategories = filteredCategories.filter(
        (category) => category.parentId === filters.parentId
      );
    }

    if (filters.level !== undefined) {
      filteredCategories = filteredCategories.filter(
        (category) => category.level === filters.level
      );
    }

    // Apply sorting
    filteredCategories.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Category];
      let bValue: any = b[sortBy as keyof Category];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "desc") {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });

    // Apply pagination
    const total = filteredCategories.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

    return {
      categories: paginatedCategories,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // Get category tree
  async getCategoryTree(): Promise<CategoryTreeResponse> {
    const rootCategories = this.categories.filter((cat) => !cat.parentId);
    const tree: CategoryTree[] = rootCategories.map((root) =>
      this.buildCategoryTree(root)
    );

    return {
      categories: tree,
      totalCategories: this.categories.length,
    };
  }

  private buildCategoryTree(category: Category): CategoryTree {
    const children = this.categories
      .filter((cat) => cat.parentId === category.id)
      .map((child) => this.buildCategoryTree(child));

    return {
      ...category,
      children,
      productCount: category.productCount || 0,
    };
  }

  // Get single category
  async getCategory(id: number): Promise<Category> {
    const category = this.categories.find((cat) => cat.id === id);
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }
    return category;
  }

  // Get category with products
  async getCategoryWithProducts(
    id: number,
    params: QueryParams = {}
  ): Promise<CategoryWithProducts> {
    const category = await this.getCategory(id);
    const productIds = this.categoryProducts.get(id) || [];

    // In a real implementation, you would fetch products from a product service
    // For now, we'll return mock products
    const products: Product[] = productIds.map((productId) => ({
      id: productId,
      name: `Product ${productId}`,
      description: `Description for product ${productId}`,
      price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
      sku: `SKU-${productId}`,
      category: category,
      tags: [],
      images: [],
      variants: [],
      inventory: {
        quantity: faker.number.int({ min: 0, max: 100 }),
        reserved: 0,
        available: faker.number.int({ min: 0, max: 100 }),
        trackQuantity: true,
        allowBackorder: false,
      },
      seo: {
        title: `Product ${productId}`,
        description: `Description for product ${productId}`,
      },
      status: "active" as const,
      featured: false,
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    }));

    return {
      ...category,
      products,
      totalProducts: products.length,
    };
  }

  // Create category
  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const newCategory: Category = {
      id: this.nextId++,
      name: data.name,
      slug: data.slug || this.generateSlug(data.name),
      description: data.description,
      parentId: data.parentId,
      level: data.parentId
        ? this.calculateLevel({ parentId: data.parentId } as Category)
        : 0,
      path: "", // Will be set after creation
      image: data.image,
      seo: data.seo || {},
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder || 0,
      includeInMenu: data.includeInMenu ?? true,
      productCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Calculate path and level
    newCategory.level = this.calculateLevel(newCategory);
    newCategory.path = this.buildPath(newCategory);

    this.categories.push(newCategory);
    return newCategory;
  }

  // Update category
  async updateCategory(data: UpdateCategoryRequest): Promise<Category> {
    const categoryIndex = this.categories.findIndex(
      (cat) => cat.id === data.id
    );
    if (categoryIndex === -1) {
      throw new Error(`Category with id ${data.id} not found`);
    }

    const existingCategory = this.categories[categoryIndex];
    const updatedCategory: Category = {
      ...existingCategory,
      ...data,
      slug: data.slug || this.generateSlug(data.name || existingCategory.name),
      updatedAt: new Date().toISOString(),
    };

    // Recalculate level and path if parent changed
    if (
      data.parentId !== undefined &&
      data.parentId !== existingCategory.parentId
    ) {
      updatedCategory.level = this.calculateLevel(updatedCategory);
      updatedCategory.path = this.buildPath(updatedCategory);
    }

    this.categories[categoryIndex] = updatedCategory;
    return updatedCategory;
  }

  // Delete category
  async deleteCategory(id: number): Promise<void> {
    const categoryIndex = this.categories.findIndex((cat) => cat.id === id);
    if (categoryIndex === -1) {
      throw new Error(`Category with id ${id} not found`);
    }

    // Check if category has children
    const hasChildren = this.categories.some((cat) => cat.parentId === id);
    if (hasChildren) {
      throw new Error(
        "Cannot delete category with children. Please delete children first."
      );
    }

    this.categories.splice(categoryIndex, 1);
    this.categoryProducts.delete(id);
  }

  // Assign products to category
  async assignProductsToCategory(
    assignment: CategoryProductAssignment
  ): Promise<void> {
    const { categoryId, productIds, positions } = assignment;
    const existingProducts = this.categoryProducts.get(categoryId) || [];
    const newProducts = productIds.filter(
      (id) => !existingProducts.includes(id)
    );
    this.categoryProducts.set(categoryId, [
      ...existingProducts,
      ...newProducts,
    ]);
    this.updateProductCounts();
  }

  // Remove products from category
  async removeProductsFromCategory(
    categoryId: number,
    productIds: number[]
  ): Promise<void> {
    const existingProducts = this.categoryProducts.get(categoryId) || [];
    const updatedProducts = existingProducts.filter(
      (id) => !productIds.includes(id)
    );
    this.categoryProducts.set(categoryId, updatedProducts);
    this.updateProductCounts();
  }

  // Get uncategorized products
  async getUncategorizedProducts(params: QueryParams = {}): Promise<{
    products: Product[];
    pagination: any;
  }> {
    const allProductIds = new Set<number>();
    this.categoryProducts.forEach((productIds) => {
      productIds.forEach((id) => allProductIds.add(id));
    });

    // Mock uncategorized products
    const uncategorizedProducts: Product[] = Array.from(
      { length: 10 },
      (_, index) => {
        const id = 100 + index; // Use IDs that don't exist in categories
        return {
          id,
          name: `Uncategorized Product ${id}`,
          description: `Description for uncategorized product ${id}`,
          price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
          sku: `UNC-${id}`,
          category: {
            id: 0,
            name: "Uncategorized",
            slug: "uncategorized",
            level: 0,
            path: "0",
            seo: {},
            isActive: true,
            includeInMenu: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          tags: [],
          images: [],
          variants: [],
          inventory: {
            quantity: faker.number.int({ min: 0, max: 100 }),
            reserved: 0,
            available: faker.number.int({ min: 0, max: 100 }),
            trackQuantity: true,
            allowBackorder: false,
          },
          seo: {
            title: `Uncategorized Product ${id}`,
            description: `Description for uncategorized product ${id}`,
          },
          status: "active" as const,
          featured: false,
          createdAt: faker.date.past().toISOString(),
          updatedAt: faker.date.recent().toISOString(),
        };
      }
    );

    return {
      products: uncategorizedProducts,
      pagination: {
        page: 1,
        limit: 10,
        total: uncategorizedProducts.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  // Get category statistics
  async getCategoryStats(): Promise<{
    totalCategories: number;
    activeCategories: number;
    inactiveCategories: number;
    categoriesWithProducts: number;
    totalProducts: number;
  }> {
    const totalCategories = this.categories.length;
    const activeCategories = this.categories.filter(
      (cat) => cat.isActive
    ).length;
    const inactiveCategories = totalCategories - activeCategories;
    const categoriesWithProducts = Array.from(
      this.categoryProducts.keys()
    ).length;
    const totalProducts = Array.from(this.categoryProducts.values()).reduce(
      (sum, productIds) => sum + productIds.length,
      0
    );

    return {
      totalCategories,
      activeCategories,
      inactiveCategories,
      categoriesWithProducts,
      totalProducts,
    };
  }

  // Search categories
  async searchCategories(
    query: string,
    limit: number = 10
  ): Promise<Category[]> {
    const searchLower = query.toLowerCase();
    return this.categories
      .filter(
        (category) =>
          category.name.toLowerCase().includes(searchLower) ||
          category.description?.toLowerCase().includes(searchLower) ||
          category.slug.toLowerCase().includes(searchLower)
      )
      .slice(0, limit);
  }

  // Validate slug uniqueness
  async validateSlug(
    slug: string,
    excludeId?: number
  ): Promise<{
    isValid: boolean;
    message?: string;
  }> {
    const existingCategory = this.categories.find(
      (cat) => cat.slug === slug && cat.id !== excludeId
    );

    if (existingCategory) {
      return {
        isValid: false,
        message: `Slug "${slug}" is already in use by category "${existingCategory.name}"`,
      };
    }

    return { isValid: true };
  }

  // Update category status (active/inactive)
  async updateCategoryStatus(id: number, isActive: boolean): Promise<Category> {
    const categoryIndex = this.categories.findIndex((cat) => cat.id === id);
    if (categoryIndex === -1) {
      throw new Error(`Category with id ${id} not found`);
    }

    const updatedCategory: Category = {
      ...this.categories[categoryIndex],
      isActive,
      updatedAt: new Date().toISOString(),
    };

    this.categories[categoryIndex] = updatedCategory;
    return updatedCategory;
  }

  // Bulk delete categories
  async bulkDeleteCategories(ids: number[]): Promise<void> {
    for (const id of ids) {
      const categoryIndex = this.categories.findIndex((cat) => cat.id === id);
      if (categoryIndex === -1) {
        throw new Error(`Category with id ${id} not found`);
      }

      // Check if category has children
      const hasChildren = this.categories.some((cat) => cat.parentId === id);
      if (hasChildren) {
        throw new Error(
          `Cannot delete category with id ${id} as it has children. Please delete children first.`
        );
      }

      this.categories.splice(categoryIndex, 1);
      this.categoryProducts.delete(id);
    }
  }

  // Reorder categories
  async reorderCategories(
    categoryOrders: { id: number; sortOrder: number }[]
  ): Promise<void> {
    for (const { id, sortOrder } of categoryOrders) {
      const categoryIndex = this.categories.findIndex((cat) => cat.id === id);
      if (categoryIndex === -1) {
        throw new Error(`Category with id ${id} not found`);
      }

      this.categories[categoryIndex] = {
        ...this.categories[categoryIndex],
        sortOrder,
        updatedAt: new Date().toISOString(),
      };
    }
  }
}

// Export singleton instance
export const mockCategoryStore = new MockCategoryStore();
