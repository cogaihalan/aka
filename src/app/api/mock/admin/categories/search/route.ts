import { NextRequest, NextResponse } from "next/server";
import { mockCategoryStore } from "@/lib/api/adapters/mock-category-adapter";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 10;

    const result = await mockCategoryStore.searchCategories(query, limit);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Categories searched successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error searching categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search categories",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
