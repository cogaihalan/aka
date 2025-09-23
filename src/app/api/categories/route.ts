import { NextRequest, NextResponse } from "next/server";
import { unifiedCategoryService } from "@/lib/api/services/unified";
import { storefrontCatalogService } from "@/lib/api/services/storefront/catalog";

// GET /api/categories - Get categories (used by both admin and storefront)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check if this is an admin request
    const isAdminRequest = request.headers.get("x-admin-request") === "true" || 
                          request.headers.get("authorization")?.includes("admin");
    
    // Parse query parameters
    const params = {
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined,
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: searchParams.get("sortOrder") as "asc" | "desc" || undefined,
      filters: {} as Record<string, any>,
    };

    // Parse filters
    searchParams.forEach((value, key) => {
      if (key.startsWith("filters[")) {
        const filterKey = key.slice(8, -1); // Remove "filters[" and "]"
        params.filters[filterKey] = value;
      }
    });

    let result;
    
    if (isAdminRequest) {
      // Use admin service for admin requests
      result = await unifiedCategoryService.getCategories(params, true);
    } else {
      // Use storefront service for public requests
      result = await storefrontCatalogService.getCategories();
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create category (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check if this is an admin request
    const isAdminRequest = request.headers.get("x-admin-request") === "true" || 
                          request.headers.get("authorization")?.includes("admin");
    
    if (!isAdminRequest) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          message: "Admin access required",
          timestamp: new Date().toISOString(),
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = await unifiedCategoryService.createCategory(body);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Category created successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create category",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
