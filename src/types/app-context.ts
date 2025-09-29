import { Category, SiteSettings } from "./app";
import { MegaMenuData } from "./menu";

export interface AppContextType {
  // Categories
  categories: Category[];
  categoriesTree: Category[];
  getCategoryBySlug: (slug: string) => Category | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getChildCategories: (parentId: string) => Category[];
  getRootCategories: () => Category[];

  // Settings
  settings: SiteSettings | null;

  // Mega menu data
  megaMenuData: MegaMenuData | null;

  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  refreshCategories: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  refreshMegaMenuData: () => Promise<void>;
  initializeApp: () => Promise<void>;
}
