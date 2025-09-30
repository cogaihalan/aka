import { NextRequest, NextResponse } from "next/server";
import { SiteSettings } from "@/types/app";

// Mock data storage - in production, this would be a database
let siteSettings: SiteSettings = {
  siteName: "AKA Store",
  siteDescription: "Your premium shopping destination",
  currency: "VND",
  currencySymbol: "₫",
  timezone: "UTC",
  language: "vi",
  theme: {
    primaryColor: "#000000",
    secondaryColor: "#6B7280",
  },
  seo: {
    metaTitle: "AKA Store - Premium Shopping",
    metaDescription: "Discover amazing products at AKA Store",
    keywords: ["shopping", "ecommerce", "products"],
  },
  social: {},
  contact: {
    email: "support@akastore.com",
    phone: "+1 (555) 123-4567",
    address: "123 Store Street, City, State 12345",
  },
};

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: siteSettings,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch site settings",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { settings } = body;

    // Validate required fields
    if (!settings.siteName || !settings.currency || !settings.language) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Update settings
    siteSettings = {
      ...siteSettings,
      ...settings,
    };

    return NextResponse.json({
      success: true,
      data: siteSettings,
      message: "Site settings updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update site settings",
      },
      { status: 500 }
    );
  }
}
