import { NextRequest, NextResponse } from "next/server";
import { mockCartAdapter } from "@/lib/api/adapters/mock-adapter";

export async function GET() {
  try {
    const result = await mockCartAdapter.getCart();

    return NextResponse.json({
      success: true,
      data: result,
      message: "Cart retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch cart",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await mockCartAdapter.addItem(body);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Item added to cart successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to add item to cart",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
