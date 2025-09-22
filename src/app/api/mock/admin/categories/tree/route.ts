import { NextRequest, NextResponse } from "next/server";
import { mockCategoryStore } from "@/lib/api/adapters/mock-category-adapter";

export async function GET(request: NextRequest) {
  try {
    const result = await mockCategoryStore.getCategoryTree();

    return NextResponse.json({
      success: true,
      data: result,
      message: "Category tree retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching category tree:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch category tree",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
