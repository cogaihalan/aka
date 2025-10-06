import { NextRequest, NextResponse } from "next/server";
import { unifiedCourseService } from "@/lib/api/services/unified";

// GET /api/courses/[id]/access - Check if user has access to course
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

    // Note: In a real application, you would check user authentication here
    // and verify if the user has made any purchases
    const result = await unifiedCourseService.checkCourseAccessMock(courseId);

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error checking course access:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check course access",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
