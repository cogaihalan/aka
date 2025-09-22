import { NextRequest, NextResponse } from "next/server";
import { mockCategoryStore } from "@/lib/api/adapters/mock-category-adapter";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params = {
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : 20,
      search: searchParams.get("search") || undefined,
    };

    const result = await mockCategoryStore.getUncategorizedProducts(params);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Uncategorized products retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching uncategorized products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch uncategorized products",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
