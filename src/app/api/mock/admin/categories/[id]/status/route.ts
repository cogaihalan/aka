import { NextRequest, NextResponse } from "next/server";
import { mockCategoryStore } from "@/lib/api/adapters/mock-category-adapter";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const body = await request.json();
    const { isActive } = body;

    const result = await mockCategoryStore.updateCategoryStatus(id, isActive);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Category status updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating category status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update category status",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
