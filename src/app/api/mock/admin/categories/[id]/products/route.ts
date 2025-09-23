import { NextRequest, NextResponse } from "next/server";
import { mockCategoryStore } from "@/lib/api/adapters/mock-category-adapter";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const categoryId = parseInt(resolvedParams.id);
    const { searchParams } = new URL(request.url);

    const queryParams = {
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : 20,
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sortBy") || "name",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    };

    const result = await mockCategoryStore.getCategoryWithProducts(
      categoryId,
      queryParams
    );

    return NextResponse.json({
      success: true,
      data: result,
      message: "Category with products retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching category with products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch category with products",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const categoryId = parseInt(resolvedParams.id);
    const body = await request.json();

    await mockCategoryStore.assignProductsToCategory({
      categoryId,
      productIds: body.productIds,
      positions: body.positions,
    });

    return NextResponse.json({
      success: true,
      message: "Products assigned to category successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error assigning products to category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to assign products to category",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const categoryId = parseInt(resolvedParams.id);
    const body = await request.json();

    await mockCategoryStore.removeProductsFromCategory(
      categoryId,
      body.productIds
    );

    return NextResponse.json({
      success: true,
      message: "Products removed from category successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error removing products from category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to remove products from category",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
