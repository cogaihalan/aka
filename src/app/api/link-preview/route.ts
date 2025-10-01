import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error: "No URL provided",
        },
        { status: 400 }
      );
    }

    // In a real application, you would fetch the URL and extract meta information
    // For now, we'll return mock data
    return NextResponse.json({
      success: 1,
      link: url,
      meta: {
        title: "External Link",
        description: "This is an external link",
        image: {
          url: "https://via.placeholder.com/400x300/cccccc/666666?text=Link+Preview"
        }
      }
    });
  } catch (error) {
    console.error("Error fetching link preview:", error);
    return NextResponse.json(
      {
        success: 0,
        error: "Failed to fetch link preview",
      },
      { status: 500 }
    );
  }
}
