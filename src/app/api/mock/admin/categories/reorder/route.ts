import { NextRequest, NextResponse } from "next/server";
import { mockCategoryStore } from "@/lib/api/adapters/mock-category-adapter";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryOrders } = body;

    await mockCategoryStore.reorderCategories(categoryOrders);

    return NextResponse.json({
      success: true,
      message: "Categories reordered successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error reordering categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to reorder categories",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
