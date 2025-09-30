"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Globe } from "lucide-react";
import { SiteSettings } from "@/types/app";

interface GeneralSettingsFormProps {
  settings: SiteSettings;
  onUpdate: (updates: Partial<SiteSettings>) => void;
}

export function GeneralSettingsForm({ settings, onUpdate }: GeneralSettingsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          General Information
        </CardTitle>
        <CardDescription>
          Basic site information and configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) => onUpdate({ siteName: e.target.value })}
              placeholder="Enter site name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Input
              id="language"
              value={settings.language}
              onChange={(e) => onUpdate({ language: e.target.value })}
              placeholder="en"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="siteDescription">Site Description</Label>
          <Textarea
            id="siteDescription"
            value={settings.siteDescription}
            onChange={(e) => onUpdate({ siteDescription: e.target.value })}
            placeholder="Enter site description"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              value={settings.currency}
              onChange={(e) => onUpdate({ currency: e.target.value })}
              placeholder="USD"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currencySymbol">Currency Symbol</Label>
            <Input
              id="currencySymbol"
              value={settings.currencySymbol}
              onChange={(e) => onUpdate({ currencySymbol: e.target.value })}
              placeholder="$"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input
            id="timezone"
            value={settings.timezone}
            onChange={(e) => onUpdate({ timezone: e.target.value })}
            placeholder="UTC"
          />
        </div>
      </CardContent>
    </Card>
  );
}
