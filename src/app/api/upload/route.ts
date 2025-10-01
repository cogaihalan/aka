import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No file provided",
        },
        { status: 400 }
      );
    }

    // In a real application, you would upload the file to a cloud storage service
    // For now, we'll return a mock response
    const mockUrl = `https://via.placeholder.com/800x600/cccccc/666666?text=${encodeURIComponent(file.name)}`;
    
    return NextResponse.json({
      success: 1,
      file: {
        url: mockUrl,
        name: file.name,
        size: file.size,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      {
        success: 0,
        error: "Failed to upload file",
      },
      { status: 500 }
    );
  }
}
