"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { categoriesService } from "@/lib/api/services/storefront/categories";
import {
  unifiedSettingsService,
  unifiedMegaMenuService,
} from "@/lib/api/services/unified";
import { AppStore, Category, SiteSettings } from "@/types/app";

// Default site settings
const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "AKA Store",
  siteDescription: "Your premium shopping destination",
  currency: "VND",
  currencySymbol: "₫",
  timezone: "UTC",
  language: "vi",
  theme: {
    primaryColor: "#000000",
    secondaryColor: "#6B7280",
  },
  seo: {
    metaTitle: "AKA Store - Premium Shopping",
    metaDescription: "Discover amazing products at AKA Store",
    keywords: ["shopping", "ecommerce", "products"],
  },
  social: {},
  contact: {
    email: "support@akastore.com",
    phone: "+1 (555) 123-4567",
    address: "123 Store Street, City, State 12345",
  },
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isLoading: false,
        isInitialized: false,
        categories: [],
        categoriesTree: [],
        categoriesMap: {},
        settings: DEFAULT_SETTINGS,
        megaMenuData: null,
        error: null,

        // Actions
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),

        setCategories: (categories) => {
          // Build categories tree and map
          const categoriesMap: Record<string, Category> = {};
          const categoriesTree: Category[] = [];

          // Create map for quick lookups
          categories.forEach((category) => {
            categoriesMap[category.id] = category;
          });

          // Build tree structure
          categories.forEach((category) => {
            if (!category.parentId) {
              // Root category
              const children = categories.filter(
                (c) => c.parentId === category.id
              );
              categoriesTree.push({
                ...category,
                children: children.length > 0 ? children : undefined,
              });
            }
          });

          set({
            categories,
            categoriesTree,
            categoriesMap,
            isInitialized: true,
          });
        },

        setSettings: (settings) => set({ settings }),
        setMegaMenuData: (megaMenuData) => set({ megaMenuData }),

        initializeApp: async () => {
          const {
            setLoading,
            setError,
            refreshCategories,
            refreshSettings,
            refreshMegaMenuData,
          } = get();

          try {
            setLoading(true);
            setError(null);

            // Fetch categories, settings, and mega menu data in parallel
            await Promise.all([
              refreshCategories(),
              refreshSettings(),
              refreshMegaMenuData(),
            ]);
          } catch (error) {
            setError(
              error instanceof Error
                ? error.message
                : "Failed to initialize app"
            );
          } finally {
            setLoading(false);
          }
        },

        refreshCategories: async () => {
          const { setLoading, setError, setCategories } = get();

          try {
            setLoading(true);
            setError(null);

            // Fetch categories from API service
            const response = await categoriesService.getCategories({
              isActive: true,
            });
            setCategories(response.categories);
          } catch (error) {
            setError(
              error instanceof Error
                ? error.message
                : "Failed to fetch categories"
            );
          } finally {
            setLoading(false);
          }
        },

        refreshSettings: async () => {
          const { setError, setSettings } = get();

          try {
            const settings = await unifiedSettingsService.getSettings();
            setSettings(settings);
          } catch (error) {
            setError(
              error instanceof Error
                ? error.message
                : "Failed to fetch settings"
            );
            // Fallback to default settings
            setSettings(DEFAULT_SETTINGS);
          }
        },

        refreshMegaMenuData: async () => {
          const { setError, setMegaMenuData } = get();

          try {
            const megaMenuData = await unifiedMegaMenuService.getMegaMenuData();
            setMegaMenuData(megaMenuData);
          } catch (error) {
            setError(
              error instanceof Error
                ? error.message
                : "Failed to fetch mega menu data"
            );
          }
        },

        // Getters
        getCategoryBySlug: (slug) => {
          const { categories } = get();
          return categories.find((category) => category.slug === slug);
        },

        getCategoryById: (id) => {
          const { categoriesMap } = get();
          return categoriesMap[id];
        },

        getChildCategories: (parentId) => {
          const { categories } = get();
          return categories.filter(
            (category) => category.parentId === parentId
          );
        },

        getRootCategories: () => {
          const { categoriesTree } = get();
          return categoriesTree;
        },
      }),
      {
        name: "app-store",
        partialize: (state) => ({
          categories: state.categories,
          settings: state.settings,
          isInitialized: state.isInitialized,
        }),
      }
    ),
    {
      name: "app-store",
    }
  )
);
