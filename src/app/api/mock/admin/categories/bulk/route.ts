import { NextRequest, NextResponse } from "next/server";
import { mockCategoryStore } from "@/lib/api/adapters/mock-category-adapter";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    await mockCategoryStore.bulkDeleteCategories(ids);

    return NextResponse.json({
      success: true,
      message: "Categories deleted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error bulk deleting categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to bulk delete categories",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
