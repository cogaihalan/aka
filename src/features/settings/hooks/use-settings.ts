import { useState } from "react";
import { toast } from "sonner";
import { SiteSettings } from "@/types/app";
import { unifiedSettingsService } from "@/lib/api/services/unified";

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const settings = await unifiedSettingsService.getSettings();
      setSettings(settings);
    } catch (error) {
      toast.error("Failed to fetch settings");
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: SiteSettings) => {
    try {
      setIsSaving(true);
      const updatedSettings =
        await unifiedSettingsService.updateSettings(newSettings);
      setSettings(updatedSettings);
      toast.success("Settings saved successfully");
      return true;
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

  // useEffect(() => {
  //   fetchSettings();
  // }, []);

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
