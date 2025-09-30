import { MegaMenuData, MenuSection, MenuCategory, MenuItem } from "@/types/menu";

export interface MegaMenuFormData extends MegaMenuData {}

export interface MegaMenuFormErrors {
  items?: {
    [key: string]: {
      title?: string;
      href?: string;
      categories?: {
        [key: string]: {
          title?: string;
          items?: {
            [key: string]: {
              label?: string;
              href?: string;
              description?: string;
            };
          };
        };
      };
    };
  };
}

export interface MegaMenuFormProps {
  megaMenuData: MegaMenuData;
  onUpdate: (updates: Partial<MegaMenuData>) => void;
  onSave: () => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
}

export interface SectionFormProps {
  section: MenuSection;
  onUpdate: (updates: Partial<MenuSection>) => void;
  onDelete: () => void;
  onAddCategory: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface CategoryFormProps {
  category: MenuCategory;
  onUpdate: (updates: Partial<MenuCategory>) => void;
  onDelete: () => void;
  onAddItem: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface MenuItemFormProps {
  item: MenuItem;
  onUpdate: (updates: Partial<MenuItem>) => void;
  onDelete: () => void;
}

export interface MegaMenuStats {
  sections: number;
  categories: number;
  items: number;
  totalLinks: number;
}
