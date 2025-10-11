import { BaseService } from "../base-service";
import type { MegaMenuData } from "@/types/menu";

class UnifiedMegaMenuService extends BaseService {
  constructor() {
    super({ basePath: "/mega-menu" });
  }

  // Get mega menu data
  async getMegaMenuData(): Promise<MegaMenuData> {
    return this.get<MegaMenuData>("/");
  }

  // Update mega menu data
  async updateMegaMenuData(megaMenuData: MegaMenuData): Promise<MegaMenuData> {
    return this.put<MegaMenuData>("/", megaMenuData);
  }

  // Add new section
  async addSection(section: {
    title: string;
    href: string;
  }): Promise<MegaMenuData> {
    return this.post<MegaMenuData>("/sections", section);
  }

  // Update section
  async updateSection(
    sectionId: string,
    updates: { title?: string; href?: string }
  ): Promise<MegaMenuData> {
    return this.patch<MegaMenuData>(`/sections/${sectionId}`, updates);
  }

  // Delete section
  async deleteSection(sectionId: string): Promise<void> {
    return this.delete(`/sections/${sectionId}`);
  }

  // Add category to section
  async addCategory(
    sectionId: string,
    category: { title: string }
  ): Promise<MegaMenuData> {
    return this.post<MegaMenuData>(
      `/sections/${sectionId}/categories`,
      category
    );
  }

  // Update category
  async updateCategory(
    sectionId: string,
    categoryId: string,
    updates: { title?: string }
  ): Promise<MegaMenuData> {
    return this.patch<MegaMenuData>(
      `/sections/${sectionId}/categories/${categoryId}`,
      updates
    );
  }

  // Delete category
  async deleteCategory(sectionId: string, categoryId: string): Promise<void> {
    return this.delete(`/sections/${sectionId}/categories/${categoryId}`);
  }

  // Add menu item to category
  async addMenuItem(
    sectionId: string,
    categoryId: string,
    item: {
      label: string;
      href: string;
      description?: string;
    }
  ): Promise<MegaMenuData> {
    return this.post<MegaMenuData>(
      `/sections/${sectionId}/categories/${categoryId}/items`,
      item
    );
  }

  // Update menu item
  async updateMenuItem(
    sectionId: string,
    categoryId: string,
    itemId: string,
    updates: {
      label?: string;
      href?: string;
      description?: string;
    }
  ): Promise<MegaMenuData> {
    return this.patch<MegaMenuData>(
      `/sections/${sectionId}/categories/${categoryId}/items/${itemId}`,
      updates
    );
  }

  // Delete menu item
  async deleteMenuItem(
    sectionId: string,
    categoryId: string,
    itemId: string
  ): Promise<void> {
    return this.delete(
      `/sections/${sectionId}/categories/${categoryId}/items/${itemId}`
    );
  }
}

// Export singleton instance
export const unifiedMegaMenuService = new UnifiedMegaMenuService();
