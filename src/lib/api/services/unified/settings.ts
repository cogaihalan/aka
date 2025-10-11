import { BaseService } from "../base-service";
import type { SiteSettings } from "@/types/app";

class UnifiedSettingsService extends BaseService {
  constructor() {
    super({ basePath: "/settings" });
  }

  // Get site settings
  async getSettings(): Promise<SiteSettings> {
    const response = await this.get<SiteSettings>("/");
    return response;
  }

  // Update site settings
  async updateSettings(settings: SiteSettings): Promise<SiteSettings> {
    const response = await this.put<SiteSettings>("/", settings);
    return response;
  }

  // Update specific settings section
  async updateTheme(theme: SiteSettings["theme"]): Promise<SiteSettings> {
    const response = await this.patch<SiteSettings>("/theme", theme);
    return response;
  }

  async updateSeo(seo: SiteSettings["seo"]): Promise<SiteSettings> {
    const response = await this.patch<SiteSettings>("/seo", seo);
    return response;
  }

  async updateContact(contact: SiteSettings["contact"]): Promise<SiteSettings> {
    const response = await this.patch<SiteSettings>("/contact", contact);
    return response;
  }

  async updateSocial(social: SiteSettings["social"]): Promise<SiteSettings> {
    const response = await this.patch<SiteSettings>("/social", social);
    return response;
  }
}

// Export singleton instance
export const unifiedSettingsService = new UnifiedSettingsService();
