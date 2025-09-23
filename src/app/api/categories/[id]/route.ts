import { NextRequest, NextResponse } from "next/server";
import { unifiedCategoryService } from "@/lib/api/services/unified";
import { storefrontCatalogService } from "@/lib/api/services/storefront/catalog";

// GET /api/categories/[id] - Get single category
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

    // Check if this is an admin request
    const isAdminRequest = request.headers.get("x-admin-request") === "true" || 
                          request.headers.get("authorization")?.includes("admin");
    
    let result;
    
    if (isAdminRequest) {
      // Use admin service for admin requests
      result = await unifiedCategoryService.getCategory(categoryId);
    } else {
      // For storefront, we need to get category by slug instead of ID
      // This endpoint should be used with slug for storefront
      return NextResponse.json(
        {
          success: false,
          error: "Invalid endpoint",
          message: "Use /api/categories/slug/[slug] for storefront requests",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching category:", error);
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

// PUT /api/categories/[id] - Update category (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const body = await request.json();
    const result = await unifiedCategoryService.updateCategory({ id: categoryId, ...body });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Category updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update category",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete category (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    await unifiedCategoryService.deleteCategory(categoryId);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete category",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
