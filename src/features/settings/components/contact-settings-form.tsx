"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";
import { SiteSettings } from "@/types/app";

interface ContactSettingsFormProps {
  settings: SiteSettings;
  onUpdateContact: (contactUpdates: Partial<SiteSettings["contact"]>) => void;
  onUpdateSocial: (socialUpdates: Partial<SiteSettings["social"]>) => void;
}

export function ContactSettingsForm({ 
  settings, 
  onUpdateContact, 
  onUpdateSocial 
}: ContactSettingsFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Contact Information
        </CardTitle>
        <CardDescription>
          Configure contact details and social media links
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <h4 className="font-medium">Contact Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.contact.email}
                onChange={(e) => onUpdateContact({ email: e.target.value })}
                placeholder="support@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={settings.contact.phone}
                onChange={(e) => onUpdateContact({ phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={settings.contact.address}
              onChange={(e) => onUpdateContact({ address: e.target.value })}
              placeholder="Enter full address"
              rows={2}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium">Social Media</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={settings.social.facebook || ""}
                onChange={(e) => onUpdateSocial({ facebook: e.target.value })}
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={settings.social.twitter || ""}
                onChange={(e) => onUpdateSocial({ twitter: e.target.value })}
                placeholder="https://twitter.com/yourhandle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={settings.social.instagram || ""}
                onChange={(e) => onUpdateSocial({ instagram: e.target.value })}
                placeholder="https://instagram.com/yourhandle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={settings.social.linkedin || ""}
                onChange={(e) => onUpdateSocial({ linkedin: e.target.value })}
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
