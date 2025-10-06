import { NextRequest, NextResponse } from "next/server";
import { unifiedCourseService } from "@/lib/api/services/unified";

// GET /api/courses/[id] - Get single course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const courseId = parseInt(resolvedParams.id);
    
    if (isNaN(courseId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid course ID",
          message: "Course ID must be a number",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const result = await unifiedCourseService.getCourseMock(courseId);

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch course",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[id] - Update course (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const courseId = parseInt(resolvedParams.id);
    
    if (isNaN(courseId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid course ID",
          message: "Course ID must be a number",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Note: In a real application, you would check admin authentication here
    const body = await request.json();
    const result = await unifiedCourseService.updateCourseMock(courseId, body);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Course updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update course",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id] - Delete course (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const courseId = parseInt(resolvedParams.id);
    
    if (isNaN(courseId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid course ID",
          message: "Course ID must be a number",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Note: In a real application, you would check admin authentication here
    await unifiedCourseService.deleteCourseMock(courseId);

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete course",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
