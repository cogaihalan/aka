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
    // Start with empty categories array - no predefined categories
    this.categories = [];

    // Clear any existing product assignments
    this.categoryProducts.clear();

    // Reset nextId to start from 1
    this.nextId = 1;
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
        updatedAt: new Date().toISOString(),
      };
    }
  }
}

// Export singleton instance
export const mockCategoryStore = new MockCategoryStore();
