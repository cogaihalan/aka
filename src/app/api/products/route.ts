import { NextRequest, NextResponse } from "next/server";
import { unifiedProductService } from "@/lib/api/services/unified";

// GET /api/products - Get products (used by both admin and storefront)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
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

    // Use unified service for all requests (includes comprehensive details)
    const result = await unifiedProductService.getProducts(params);

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch products",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST /api/products - Create product (admin only)
export async function POST(request: NextRequest) {
  try {
    // Note: In a real application, you would check admin authentication here
    // For now, we allow all requests to create products

    const body = await request.json();
    const result = await unifiedProductService.createProduct(body);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Product created successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create product",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
