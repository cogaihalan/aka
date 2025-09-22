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
      sortBy: searchParams.get("sortBy") || "name",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
      filters: {
        isActive: searchParams.get("filters[isActive]")
          ? searchParams.get("filters[isActive]") === "true"
          : undefined,
        parentId: searchParams.get("filters[parentId]")
          ? parseInt(searchParams.get("filters[parentId]")!)
          : undefined,
        level: searchParams.get("filters[level]")
          ? parseInt(searchParams.get("filters[level]")!)
          : undefined,
      },
    };

    const result = await mockCategoryStore.getCategories(params);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Categories retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await mockCategoryStore.createCategory(body);

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "Category created successfully",
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create category",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
