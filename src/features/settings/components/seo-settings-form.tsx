"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { SiteSettings } from "@/types/app";

interface SeoSettingsFormProps {
  settings: SiteSettings;
  onUpdateSeo: (seoUpdates: Partial<SiteSettings["seo"]>) => void;
}

export function SeoSettingsForm({ settings, onUpdateSeo }: SeoSettingsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          SEO Settings
        </CardTitle>
        <CardDescription>
          Configure search engine optimization settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            value={settings.seo.metaTitle}
            onChange={(e) => onUpdateSeo({ metaTitle: e.target.value })}
            placeholder="Enter meta title"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            value={settings.seo.metaDescription}
            onChange={(e) => onUpdateSeo({ metaDescription: e.target.value })}
            placeholder="Enter meta description"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {settings.seo.keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
          <Input
            value={settings.seo.keywords.join(", ")}
            onChange={(e) => onUpdateSeo({ 
              keywords: e.target.value.split(",").map(k => k.trim()).filter(k => k)
            })}
            placeholder="Enter keywords separated by commas"
          />
        </div>
      </CardContent>
    </Card>
  );
}
