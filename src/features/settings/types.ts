import { SiteSettings } from "@/types/app";

export interface SettingsFormData extends SiteSettings {}

export interface SettingsFormErrors {
  siteName?: string;
  siteDescription?: string;
  currency?: string;
  currencySymbol?: string;
  language?: string;
  timezone?: string;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface SettingsTab {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface ColorPreview {
  primary: string;
  secondary: string;
}

export interface SettingsFormProps {
  settings: SiteSettings;
  onUpdate: (updates: Partial<SiteSettings>) => void;
  onSave: () => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
}
