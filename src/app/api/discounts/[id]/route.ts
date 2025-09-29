import { NextRequest, NextResponse } from "next/server";
import { DiscountRule } from "@/types/discount";

// Mock data - in real app, this would come from database
const mockDiscountRules: DiscountRule[] = [
  {
    id: 1,
    name: "Welcome Discount",
    description: "10% off for new customers",
    isActive: true,
    priority: 1,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    usageLimit: 1000,
    usageCount: 45,
    customerUsageLimit: 1,
    isAdvanced: false,
    conditions: [],
    actions: [],
    websiteIds: [1],
    customerGroupIds: [1],
    couponCode: "WELCOME10",
    useAutoGeneration: false,
    timesUsed: 45,
    isRss: false,
    couponType: "specific_coupon",
    applyToShipping: false,
    freeShipping: false,
    sortOrder: 1,
    simpleAction: "by_percent",
    discountAmount: 10,
    applyDiscountToFixedPrice: false,
    stopRulesProcessing: false,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: 2,
    name: "Free Shipping",
    description: "Free shipping on orders over $50",
    isActive: true,
    priority: 2,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    usageLimit: undefined,
    usageCount: 0,
    customerUsageLimit: undefined,
    isAdvanced: false,
    conditions: [
      {
        id: 1,
        ruleId: 2,
        type: "salesrule/rule_condition_combine",
        attribute: "total_amount",
        operator: ">=",
        value: 50,
        aggregator: "all",
        conditions: [],
      },
    ],
    actions: [],
    websiteIds: [1],
    customerGroupIds: [1, 2],
    couponCode: "FREESHIP",
    useAutoGeneration: false,
    timesUsed: 0,
    isRss: false,
    couponType: "specific_coupon",
    applyToShipping: true,
    freeShipping: true,
    sortOrder: 2,
    simpleAction: "by_fixed",
    discountAmount: 0,
    applyDiscountToFixedPrice: false,
    stopRulesProcessing: false,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// GET /api/discounts/[id] - Get single discount rule
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const discountId = parseInt(resolvedParams.id);

    if (isNaN(discountId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid discount ID",
          message: "Discount ID must be a number",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const discountRule = mockDiscountRules.find(
      (rule) => rule.id === discountId
    );

    if (!discountRule) {
      return NextResponse.json(
        {
          success: false,
          error: "Discount rule not found",
          message: `No discount rule found with ID ${discountId}`,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: discountRule,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching discount rule:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch discount rule",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// PUT /api/discounts/[id] - Update discount rule (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const discountId = parseInt(resolvedParams.id);

    if (isNaN(discountId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid discount ID",
          message: "Discount ID must be a number",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Find the discount rule
    const ruleIndex = mockDiscountRules.findIndex(
      (rule) => rule.id === discountId
    );

    if (ruleIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Discount rule not found",
          message: `No discount rule found with ID ${discountId}`,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Update the discount rule
    const updatedRule: DiscountRule = {
      ...mockDiscountRules[ruleIndex],
      ...body,
      id: discountId, // Ensure ID doesn't change
      updatedAt: new Date(),
    };

    mockDiscountRules[ruleIndex] = updatedRule;

    return NextResponse.json({
      success: true,
      data: updatedRule,
      message: "Discount rule updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating discount rule:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update discount rule",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// DELETE /api/discounts/[id] - Delete discount rule (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const discountId = parseInt(resolvedParams.id);

    if (isNaN(discountId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid discount ID",
          message: "Discount ID must be a number",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const ruleIndex = mockDiscountRules.findIndex(
      (rule) => rule.id === discountId
    );

    if (ruleIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Discount rule not found",
          message: `No discount rule found with ID ${discountId}`,
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }

    // Remove the discount rule
    mockDiscountRules.splice(ruleIndex, 1);

    return NextResponse.json({
      success: true,
      message: "Discount rule deleted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error deleting discount rule:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete discount rule",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
