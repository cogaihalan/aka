"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";
import { SiteSettings } from "@/types/app";

interface ThemeSettingsFormProps {
  settings: SiteSettings;
  onUpdateTheme: (themeUpdates: Partial<SiteSettings["theme"]>) => void;
}

export function ThemeSettingsForm({ settings, onUpdateTheme }: ThemeSettingsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme Settings
        </CardTitle>
        <CardDescription>
          Customize your site's color scheme and appearance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="primaryColor"
                type="color"
                value={settings.theme.primaryColor}
                onChange={(e) => onUpdateTheme({ primaryColor: e.target.value })}
                className="w-16 h-10"
              />
              <Input
                value={settings.theme.primaryColor}
                onChange={(e) => onUpdateTheme({ primaryColor: e.target.value })}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="secondaryColor"
                type="color"
                value={settings.theme.secondaryColor}
                onChange={(e) => onUpdateTheme({ secondaryColor: e.target.value })}
                className="w-16 h-10"
              />
              <Input
                value={settings.theme.secondaryColor}
                onChange={(e) => onUpdateTheme({ secondaryColor: e.target.value })}
                placeholder="#6B7280"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Color Preview</Label>
          <div className="flex gap-2">
            <div
              className="w-12 h-12 rounded border"
              style={{ backgroundColor: settings.theme.primaryColor }}
            />
            <div
              className="w-12 h-12 rounded border"
              style={{ backgroundColor: settings.theme.secondaryColor }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
