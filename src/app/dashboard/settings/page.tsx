"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, RefreshCw } from "lucide-react";
import { useSettings } from "@/features/settings/hooks/use-settings";
import { GeneralSettingsForm } from "@/features/settings/components/general-settings-form";
import { ThemeSettingsForm } from "@/features/settings/components/theme-settings-form";
import { SeoSettingsForm } from "@/features/settings/components/seo-settings-form";
import { ContactSettingsForm } from "@/features/settings/components/contact-settings-form";
import { ThemePreview } from "@/components/theme/theme-preview";
import PageContainer from "@/components/layout/page-container";

export default function SettingsPage() {
  const {
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
  } = useSettings();

  const handleSave = async () => {
    if (!settings) return;
    await saveSettings(settings);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <RefreshCw className="h-8 w-8 animate-spin" />
        Loading...
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load settings</p>
        <Button onClick={fetchSettings} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
            <p className="text-muted-foreground">
              Configure your site's appearance, content, and functionality
            </p>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <GeneralSettingsForm
              settings={settings}
              onUpdate={updateSettings}
            />
          </TabsContent>

          <TabsContent value="theme" className="space-y-6">
            <ThemeSettingsForm
              settings={settings}
              onUpdateTheme={updateTheme}
            />
            <ThemePreview settings={settings} />
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <SeoSettingsForm settings={settings} onUpdateSeo={updateSeo} />
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <ContactSettingsForm
              settings={settings}
              onUpdateContact={updateContact}
              onUpdateSocial={updateSocial}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
