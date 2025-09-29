import { MegaMenuData } from "./menu";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount: number;
  parentId?: string;
  children?: Category[];
  isActive: boolean;
  sortOrder: number;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  logo?: string;
  favicon?: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  language: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
}

export interface AppStore {
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;

  // Categories
  categories: Category[];
  categoriesTree: Category[];
  categoriesMap: Record<string, Category>;

  // Site settings
  settings: SiteSettings | null;

  // Mega menu data
  megaMenuData: MegaMenuData | null;

  // Error states
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCategories: (categories: Category[]) => void;
  setSettings: (settings: SiteSettings) => void;
  setMegaMenuData: (megaMenuData: MegaMenuData) => void;
  initializeApp: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  refreshMegaMenuData: () => Promise<void>;

  // Getters
  getCategoryBySlug: (slug: string) => Category | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getChildCategories: (parentId: string) => Category[];
  getRootCategories: () => Category[];
}

// Re-export MegaMenuData from menu types for convenience
export type { MegaMenuData } from "./menu";
