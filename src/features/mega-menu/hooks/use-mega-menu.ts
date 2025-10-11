import { useState, useEffect } from "react";
import { toast } from "sonner";
import { arrayMove } from "@dnd-kit/sortable";
import {
  MegaMenuData,
  MenuSection,
  MenuCategory,
  MenuItem,
} from "@/types/menu";
import { unifiedMegaMenuService } from "@/lib/api/services/unified";

export function useMegaMenu() {
  const [megaMenuData, setMegaMenuData] = useState<MegaMenuData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const fetchMegaMenuData = async () => {
    try {
      setIsLoading(true);
      const megaMenuData = await unifiedMegaMenuService.getMegaMenuData();
      setMegaMenuData(megaMenuData);
      // Expand first section by default
      if (megaMenuData.items.length > 0) {
        setExpandedSections(new Set([megaMenuData.items[0].id]));
      }
    } catch (error) {
      toast.error("Failed to fetch mega menu data");
    } finally {
      setIsLoading(false);
    }
  };

  const saveMegaMenuData = async (newMegaMenuData: MegaMenuData) => {
    try {
      setIsSaving(true);
      const updatedMegaMenuData =
        await unifiedMegaMenuService.updateMegaMenuData(newMegaMenuData);
      setMegaMenuData(updatedMegaMenuData);
      toast.success("Mega menu updated successfully");
      return true;
    } catch (error) {
      toast.error("Failed to save mega menu");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const addSection = () => {
    if (!megaMenuData) return;

    const newSection: MenuSection = {
      id: `section-${Date.now()}`,
      title: "New Section",
      href: "/new-section",
      categories: [],
    };

    setMegaMenuData({
      ...megaMenuData,
      items: [...megaMenuData.items, newSection],
    });
  };

  const updateSection = (sectionId: string, updates: Partial<MenuSection>) => {
    if (!megaMenuData) return;

    setMegaMenuData({
      ...megaMenuData,
      items: megaMenuData.items.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    });
  };

  const deleteSection = (sectionId: string) => {
    if (!megaMenuData) return;

    setMegaMenuData({
      ...megaMenuData,
      items: megaMenuData.items.filter((section) => section.id !== sectionId),
    });

    // Remove from expanded sections
    const newExpanded = new Set(expandedSections);
    newExpanded.delete(sectionId);
    setExpandedSections(newExpanded);
  };

  const addCategory = (sectionId: string) => {
    if (!megaMenuData) return;

    const newCategory: MenuCategory = {
      id: `category-${Date.now()}`,
      title: "New Category",
      items: [],
    };

    setMegaMenuData({
      ...megaMenuData,
      items: megaMenuData.items.map((section) =>
        section.id === sectionId
          ? { ...section, categories: [...section.categories, newCategory] }
          : section
      ),
    });
  };

  const updateCategory = (
    sectionId: string,
    categoryId: string,
    updates: Partial<MenuCategory>
  ) => {
    if (!megaMenuData) return;

    setMegaMenuData({
      ...megaMenuData,
      items: megaMenuData.items.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              categories: section.categories.map((category) =>
                category.id === categoryId
                  ? { ...category, ...updates }
                  : category
              ),
            }
          : section
      ),
    });
  };

  const deleteCategory = (sectionId: string, categoryId: string) => {
    if (!megaMenuData) return;

    setMegaMenuData({
      ...megaMenuData,
      items: megaMenuData.items.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              categories: section.categories.filter(
                (category) => category.id !== categoryId
              ),
            }
          : section
      ),
    });

    // Remove from expanded categories
    const newExpanded = new Set(expandedCategories);
    newExpanded.delete(categoryId);
    setExpandedCategories(newExpanded);
  };

  const addMenuItem = (sectionId: string, categoryId: string) => {
    if (!megaMenuData) return;

    const newMenuItem: MenuItem = {
      id: `item-${Date.now()}`,
      label: "New Item",
      href: "/new-item",
      description: "New menu item",
    };

    setMegaMenuData({
      ...megaMenuData,
      items: megaMenuData.items.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              categories: section.categories.map((category) =>
                category.id === categoryId
                  ? { ...category, items: [...category.items, newMenuItem] }
                  : category
              ),
            }
          : section
      ),
    });
  };

  const updateMenuItem = (
    sectionId: string,
    categoryId: string,
    itemId: string,
    updates: Partial<MenuItem>
  ) => {
    if (!megaMenuData) return;

    setMegaMenuData({
      ...megaMenuData,
      items: megaMenuData.items.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              categories: section.categories.map((category) =>
                category.id === categoryId
                  ? {
                      ...category,
                      items: category.items.map((item) =>
                        item.id === itemId ? { ...item, ...updates } : item
                      ),
                    }
                  : category
              ),
            }
          : section
      ),
    });
  };

  const deleteMenuItem = (
    sectionId: string,
    categoryId: string,
    itemId: string
  ) => {
    if (!megaMenuData) return;

    setMegaMenuData({
      ...megaMenuData,
      items: megaMenuData.items.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              categories: section.categories.map((category) =>
                category.id === categoryId
                  ? {
                      ...category,
                      items: category.items.filter(
                        (item) => item.id !== itemId
                      ),
                    }
                  : category
              ),
            }
          : section
      ),
    });
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Drag and drop handlers
  const reorderSections = (activeId: string, overId: string) => {
    if (!megaMenuData) return;

    const oldIndex = megaMenuData.items.findIndex(
      (section) => section.id === activeId
    );
    const newIndex = megaMenuData.items.findIndex(
      (section) => section.id === overId
    );

    if (oldIndex !== -1 && newIndex !== -1) {
      setMegaMenuData({
        ...megaMenuData,
        items: arrayMove(megaMenuData.items, oldIndex, newIndex),
      });
    }
  };

  const reorderCategories = (
    sectionId: string,
    activeId: string,
    overId: string
  ) => {
    if (!megaMenuData) return;

    setMegaMenuData({
      ...megaMenuData,
      items: megaMenuData.items.map((section) => {
        if (section.id === sectionId) {
          const oldIndex = section.categories.findIndex(
            (category) => category.id === activeId
          );
          const newIndex = section.categories.findIndex(
            (category) => category.id === overId
          );

          if (oldIndex !== -1 && newIndex !== -1) {
            return {
              ...section,
              categories: arrayMove(section.categories, oldIndex, newIndex),
            };
          }
        }
        return section;
      }),
    });
  };

  const reorderMenuItems = (
    sectionId: string,
    categoryId: string,
    activeId: string,
    overId: string
  ) => {
    if (!megaMenuData) return;

    setMegaMenuData({
      ...megaMenuData,
      items: megaMenuData.items.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            categories: section.categories.map((category) => {
              if (category.id === categoryId) {
                const oldIndex = category.items.findIndex(
                  (item) => item.id === activeId
                );
                const newIndex = category.items.findIndex(
                  (item) => item.id === overId
                );

                if (oldIndex !== -1 && newIndex !== -1) {
                  return {
                    ...category,
                    items: arrayMove(category.items, oldIndex, newIndex),
                  };
                }
              }
              return category;
            }),
          };
        }
        return section;
      }),
    });
  };

  const moveCategoryBetweenSections = (
    activeId: string,
    overId: string,
    targetSectionId: string
  ) => {
    if (!megaMenuData) return;

    let categoryToMove: MenuCategory | null = null;
    let sourceSectionId = "";

    // Find the category to move and its source section
    for (const section of megaMenuData.items) {
      const category = section.categories.find((cat) => cat.id === activeId);
      if (category) {
        categoryToMove = category;
        sourceSectionId = section.id;
        break;
      }
    }

    if (!categoryToMove || sourceSectionId === targetSectionId) return;

    setMegaMenuData({
      ...megaMenuData,
      items: megaMenuData.items.map((section) => {
        if (section.id === sourceSectionId) {
          // Remove category from source section
          return {
            ...section,
            categories: section.categories.filter((cat) => cat.id !== activeId),
          };
        } else if (section.id === targetSectionId) {
          // Add category to target section
          const targetIndex = section.categories.findIndex(
            (cat) => cat.id === overId
          );
          const newCategories = [...section.categories];
          newCategories.splice(targetIndex, 0, categoryToMove);

          return {
            ...section,
            categories: newCategories,
          };
        }
        return section;
      }),
    });
  };

  const moveMenuItemBetweenCategories = (
    activeId: string,
    overId: string,
    sourceSectionId: string,
    sourceCategoryId: string,
    targetSectionId: string,
    targetCategoryId: string
  ) => {
    if (!megaMenuData) return;

    let itemToMove: MenuItem | null = null;

    // Find the item to move
    for (const section of megaMenuData.items) {
      if (section.id === sourceSectionId) {
        for (const category of section.categories) {
          if (category.id === sourceCategoryId) {
            const item = category.items.find((item) => item.id === activeId);
            if (item) {
              itemToMove = item;
              break;
            }
          }
        }
      }
    }

    if (!itemToMove) return;

    setMegaMenuData({
      ...megaMenuData,
      items: megaMenuData.items.map((section) => {
        if (section.id === sourceSectionId) {
          // Remove item from source category
          return {
            ...section,
            categories: section.categories.map((category) => {
              if (category.id === sourceCategoryId) {
                return {
                  ...category,
                  items: category.items.filter((item) => item.id !== activeId),
                };
              }
              return category;
            }),
          };
        } else if (section.id === targetSectionId) {
          // Add item to target category
          return {
            ...section,
            categories: section.categories.map((category) => {
              if (category.id === targetCategoryId) {
                const targetIndex = category.items.findIndex(
                  (item) => item.id === overId
                );
                const newItems = [...category.items];
                newItems.splice(targetIndex, 0, itemToMove);

                return {
                  ...category,
                  items: newItems,
                };
              }
              return category;
            }),
          };
        }
        return section;
      }),
    });
  };

  // useEffect(() => {
  //   fetchMegaMenuData();
  // }, []);

  return {
    megaMenuData,
    isLoading,
    isSaving,
    expandedSections,
    expandedCategories,
    fetchMegaMenuData,
    saveMegaMenuData,
    addSection,
    updateSection,
    deleteSection,
    addCategory,
    updateCategory,
    deleteCategory,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleSection,
    toggleCategory,
    // Drag and drop functions
    reorderSections,
    reorderCategories,
    reorderMenuItems,
    moveCategoryBetweenSections,
    moveMenuItemBetweenCategories,
  };
}
