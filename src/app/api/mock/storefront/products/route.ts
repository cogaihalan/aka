import { NextRequest, NextResponse } from "next/server";
import { mockProductAdapter } from "@/lib/api/adapters/mock-adapter";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params = {
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : 10,
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: searchParams.get("sortOrder") as "asc" | "desc" | undefined,
      filters: {
        category: searchParams.get("filters[category]") || undefined,
        status: searchParams.get("filters[status]") || undefined,
      },
    };

    const result = await mockProductAdapter.getProducts(params);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Products retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
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
