import { NextRequest, NextResponse } from "next/server";
import { unifiedProductService } from "@/lib/api/services/unified";
import { storefrontCatalogService } from "@/lib/api/services/storefront/catalog";

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product ID",
          message: "Product ID must be a number",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Use unified service for all requests (includes comprehensive details)
    const result = await unifiedProductService.getProduct(productId);

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product (admin only)
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
    const productId = parseInt(resolvedParams.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product ID",
          message: "Product ID must be a number",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const result = await unifiedProductService.updateProduct(productId, body);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Product updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update product",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// PATCH /api/products/[id] - Partially update product (admin only)
export async function PATCH(
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
    const productId = parseInt(resolvedParams.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product ID",
          message: "Product ID must be a number",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const result = await unifiedProductService.patchProduct(productId, body);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Product updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update product",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
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
    const productId = parseInt(resolvedParams.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid product ID",
          message: "Product ID must be a number",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    await unifiedProductService.deleteProduct(productId);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete product",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
