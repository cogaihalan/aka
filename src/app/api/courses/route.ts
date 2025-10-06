import { NextRequest, NextResponse } from "next/server";
import { unifiedCourseService } from "@/lib/api/services/unified";

// GET /api/courses - Get courses (used by both admin and storefront)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const params = {
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined,
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sortBy") || undefined,
      sortOrder: searchParams.get("sortOrder") as "asc" | "desc" || undefined,
      filters: {} as Record<string, any>,
    };

    // Parse filters
    searchParams.forEach((value, key) => {
      if (key.startsWith("filters[")) {
        const filterKey = key.slice(8, -1); // Remove "filters[" and "]"
        params.filters[filterKey] = value;
      }
    });

    // Use unified service for all requests
    const result = await unifiedCourseService.getCoursesMock(params);

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch courses",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create course (admin only)
export async function POST(request: NextRequest) {
  try {
    // Note: In a real application, you would check admin authentication here
    // For now, we allow all requests to create courses

    const body = await request.json();
    const result = await unifiedCourseService.createCourseMock(body);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Course created successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create course",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
