import { NextRequest, NextResponse } from "next/server";
import { storefrontCatalogService } from "@/lib/api/services/storefront/catalog";

// GET /api/categories/slug/[slug] - Get category by slug (storefront)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    
    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid category slug",
          message: "Category slug is required",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const result = await storefrontCatalogService.getCategory(slug);

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch category",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
