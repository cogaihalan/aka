import { NextRequest, NextResponse } from "next/server";
import { unifiedCategoryService } from "@/lib/api/services/unified";

// GET /api/categories/[id]/products - Get products in a category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const categoryId = parseInt(resolvedParams.id);
    
    if (isNaN(categoryId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid category ID",
          message: "Category ID must be a number",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const queryParams = {
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined,
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: searchParams.get("sortOrder") as "asc" | "desc" || undefined,
    };

    const result = await unifiedCategoryService.getCategoryWithProducts(categoryId, queryParams);

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching category products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch category products",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
