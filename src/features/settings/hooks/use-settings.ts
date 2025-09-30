import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SiteSettings } from "@/types/app";

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/settings");
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error("Failed to fetch settings");
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: SiteSettings) => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings: newSettings }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSettings(newSettings);
        toast.success("Settings saved successfully");
        return true;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error("Failed to save settings");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const updateSettings = (updates: Partial<SiteSettings>) => {
    if (!settings) return;
    setSettings({ ...settings, ...updates });
  };

  const updateTheme = (themeUpdates: Partial<SiteSettings["theme"]>) => {
    if (!settings) return;
    setSettings({
      ...settings,
      theme: { ...settings.theme, ...themeUpdates },
    });
  };

  const updateSeo = (seoUpdates: Partial<SiteSettings["seo"]>) => {
    if (!settings) return;
    setSettings({
      ...settings,
      seo: { ...settings.seo, ...seoUpdates },
    });
  };

  const updateContact = (contactUpdates: Partial<SiteSettings["contact"]>) => {
    if (!settings) return;
    setSettings({
      ...settings,
      contact: { ...settings.contact, ...contactUpdates },
    });
  };

  const updateSocial = (socialUpdates: Partial<SiteSettings["social"]>) => {
    if (!settings) return;
    setSettings({
      ...settings,
      social: { ...settings.social, ...socialUpdates },
    });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    isLoading,
    isSaving,
    fetchSettings,
    saveSettings,
    updateSettings,
    updateTheme,
    updateSeo,
    updateContact,
    updateSocial,
  };
}
