import { NextRequest, NextResponse } from "next/server";
import {
  DiscountValidationResult,
  DiscountCalculationContext,
} from "@/types/discount";

// Mock discount rules for validation
const mockDiscountRules = [
  {
    id: 1,
    name: "Welcome Discount",
    couponCode: "WELCOME10",
    isActive: true,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2025-12-31"),
    usageLimit: 1000,
    usageCount: 45,
    customerUsageLimit: 1,
    websiteIds: [1],
    customerGroupIds: [1],
    simpleAction: "by_percent",
    discountAmount: 10,
    conditions: [],
  },
  {
    id: 2,
    name: "Free Shipping",
    couponCode: "FREESHIP",
    isActive: true,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2025-12-31"),
    usageLimit: undefined,
    usageCount: 0,
    customerUsageLimit: undefined,
    websiteIds: [1],
    customerGroupIds: [1, 2],
    simpleAction: "by_fixed",
    discountAmount: 0,
    freeShipping: true,
    conditions: [
      {
        attribute: "total_amount",
        operator: ">=",
        value: 50,
      },
    ],
  },
  {
    id: 3,
    name: "Bulk Discount",
    isActive: true,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2025-12-31"),
    usageLimit: undefined,
    usageCount: 0,
    customerUsageLimit: undefined,
    websiteIds: [1],
    customerGroupIds: [1, 2],
    simpleAction: "by_percent",
    discountAmount: 15,
    conditions: [
      {
        attribute: "total_qty",
        operator: ">=",
        value: 3,
      },
    ],
  },
];

// POST /api/discounts/validate - Validate coupon code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      couponCode,
      context,
    }: { couponCode: string; context: DiscountCalculationContext } = body;

    if (!couponCode || !context) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message: "couponCode and context are required",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Find matching discount rule
    const discountRule = mockDiscountRules.find(
      (rule) => rule.couponCode === couponCode.toUpperCase()
    );

    if (!discountRule) {
      return NextResponse.json({
        success: true,
        data: {
          isValid: false,
          discountAmount: 0,
          message: "Invalid coupon code",
          errors: ["Coupon code not found"],
        } as DiscountValidationResult,
        timestamp: new Date().toISOString(),
      });
    }

    // Validate rule conditions
    const validationResult = validateDiscountRule(discountRule, context);

    return NextResponse.json({
      success: true,
      data: validationResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to validate coupon",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

function validateDiscountRule(
  rule: any,
  context: DiscountCalculationContext
): DiscountValidationResult {
  const errors: string[] = [];
  let discountAmount = 0;

  // Check if rule is active
  if (!rule.isActive) {
    errors.push("Discount rule is not active");
    return { isValid: false, discountAmount: 0, errors };
  }

  // Check date range
  const now = new Date();
  if (rule.startDate && now < new Date(rule.startDate)) {
    errors.push("Discount rule has not started yet");
  }
  if (rule.endDate && now > new Date(rule.endDate)) {
    errors.push("Discount rule has expired");
  }

  // Check usage limits
  if (rule.usageLimit && rule.usageCount >= rule.usageLimit) {
    errors.push("Discount usage limit reached");
  }

  // Check customer usage limit
  if (rule.customerUsageLimit && context.customerId) {
    // In real app, check customer usage from database
    // For now, assume unlimited
  }

  // Check website and customer group
  if (!rule.websiteIds.includes(context.websiteId)) {
    errors.push("Discount not valid for this website");
  }

  if (
    context.customerGroupId &&
    !rule.customerGroupIds.includes(context.customerGroupId)
  ) {
    errors.push("Discount not valid for your customer group");
  }

  // Check conditions
  if (rule.conditions && rule.conditions.length > 0) {
    for (const condition of rule.conditions) {
      if (!validateCondition(condition, context)) {
        errors.push(
          `Condition not met: ${condition.attribute} ${condition.operator} ${condition.value}`
        );
      }
    }
  }

  // Calculate discount amount if valid
  if (errors.length === 0) {
    discountAmount = calculateDiscountAmount(rule, context);
  }

  return {
    isValid: errors.length === 0,
    discountAmount,
    message: errors.length === 0 ? "Coupon applied successfully" : errors[0],
    errors,
  };
}

function validateCondition(
  condition: any,
  context: DiscountCalculationContext
): boolean {
  const { attribute, operator, value } = condition;

  switch (attribute) {
    case "total_amount":
      return compareValues(context.subtotal, operator, value);
    case "total_qty":
      const totalQty = context.cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      return compareValues(totalQty, operator, value);
    case "shipping_amount":
      return compareValues(context.shippingAmount, operator, value);
    default:
      return true; // Unknown conditions pass
  }
}

function compareValues(
  actual: number,
  operator: string,
  expected: number
): boolean {
  switch (operator) {
    case ">=":
      return actual >= expected;
    case "<=":
      return actual <= expected;
    case ">":
      return actual > expected;
    case "<":
      return actual < expected;
    case "==":
      return actual === expected;
    case "!=":
      return actual !== expected;
    default:
      return true;
  }
}

function calculateDiscountAmount(
  rule: any,
  context: DiscountCalculationContext
): number {
  switch (rule.simpleAction) {
    case "by_percent":
      return (context.subtotal * rule.discountAmount) / 100;
    case "by_fixed":
    case "cart_fixed":
      return rule.discountAmount;
    case "buy_x_get_y":
      // Implement buy X get Y logic
      return 0;
    default:
      return 0;
  }
}
