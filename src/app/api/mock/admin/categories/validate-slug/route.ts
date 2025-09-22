import { NextRequest, NextResponse } from "next/server";
import { mockCategoryStore } from "@/lib/api/adapters/mock-category-adapter";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug") || "";
    const excludeId = searchParams.get("excludeId")
      ? parseInt(searchParams.get("excludeId")!)
      : undefined;

    const result = await mockCategoryStore.validateSlug(slug, excludeId);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Slug validation completed",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error validating slug:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to validate slug",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
