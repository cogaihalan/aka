import { NextRequest, NextResponse } from "next/server";
import { DiscountRule, DiscountRuleListParams } from "@/types/discount";

// Mock data for development
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
  {
    id: 3,
    name: "Bulk Discount",
    description: "15% off when buying 3 or more items",
    isActive: true,
    priority: 3,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    usageLimit: undefined,
    usageCount: 0,
    customerUsageLimit: undefined,
    isAdvanced: true,
    conditions: [
      {
        id: 2,
        ruleId: 3,
        type: "salesrule/rule_condition_combine",
        attribute: "total_qty",
        operator: ">=",
        value: 3,
        aggregator: "all",
        conditions: [],
      },
    ],
    actions: [],
    websiteIds: [1],
    customerGroupIds: [1, 2],
    useAutoGeneration: false,
    timesUsed: 0,
    isRss: false,
    couponType: "no_coupon",
    applyToShipping: false,
    freeShipping: false,
    sortOrder: 3,
    simpleAction: "by_percent",
    discountAmount: 15,
    applyDiscountToFixedPrice: false,
    stopRulesProcessing: false,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

// GET /api/discounts - Get discount rules
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const params: DiscountRuleListParams = {
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : 10,
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
      filters: {
        isActive: searchParams.get("isActive")
          ? searchParams.get("isActive") === "true"
          : undefined,
        couponType: (searchParams.get("couponType") as any) || undefined,
        websiteIds: searchParams.get("websiteIds")
          ? searchParams.get("websiteIds")!.split(",").map(Number)
          : undefined,
        customerGroupIds: searchParams.get("customerGroupIds")
          ? searchParams.get("customerGroupIds")!.split(",").map(Number)
          : undefined,
      },
    };

    // Filter and sort data
    let filteredRules = [...mockDiscountRules];

    // Apply search filter
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredRules = filteredRules.filter(
        (rule) =>
          rule.name.toLowerCase().includes(searchLower) ||
          rule.description?.toLowerCase().includes(searchLower) ||
          rule.couponCode?.toLowerCase().includes(searchLower)
      );
    }

    // Apply other filters
    if (params.filters?.isActive !== undefined) {
      filteredRules = filteredRules.filter(
        (rule) => rule.isActive === params.filters?.isActive
      );
    }

    if (params.filters?.couponType) {
      filteredRules = filteredRules.filter(
        (rule) => rule.couponType === params.filters?.couponType
      );
    }

    // Apply sorting
    filteredRules.sort((a, b) => {
      const aValue = a[params.sortBy as keyof DiscountRule] as any;
      const bValue = b[params.sortBy as keyof DiscountRule] as any;

      if (params.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const startIndex = (params.page! - 1) * params.limit!;
    const endIndex = startIndex + params.limit!;
    const paginatedRules = filteredRules.slice(startIndex, endIndex);

    const result = {
      data: paginatedRules,
      pagination: {
        page: params.page!,
        limit: params.limit!,
        total: filteredRules.length,
        totalPages: Math.ceil(filteredRules.length / params.limit!),
        hasNext: endIndex < filteredRules.length,
        hasPrev: params.page! > 1,
      },
    };

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching discount rules:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch discount rules",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST /api/discounts - Create discount rule (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.simpleAction || body.discountAmount === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
          message: "Name, simpleAction, and discountAmount are required",
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    // Create new discount rule
    const newRule: DiscountRule = {
      id: mockDiscountRules.length + 1,
      name: body.name,
      description: body.description,
      isActive: body.isActive ?? true,
      priority: body.priority ?? 1,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      usageLimit: body.usageLimit,
      usageCount: 0,
      customerUsageLimit: body.customerUsageLimit,
      isAdvanced: body.isAdvanced ?? false,
      conditions: body.conditions ?? [],
      actions: body.actions ?? [],
      websiteIds: body.websiteIds ?? [1],
      customerGroupIds: body.customerGroupIds ?? [1],
      couponCode: body.couponCode,
      useAutoGeneration: body.useAutoGeneration ?? false,
      timesUsed: 0,
      isRss: false,
      couponType: body.couponType ?? "no_coupon",
      applyToShipping: body.applyToShipping ?? false,
      freeShipping: body.freeShipping ?? false,
      sortOrder: body.sortOrder ?? 1,
      simpleAction: body.simpleAction,
      discountAmount: body.discountAmount,
      discountQty: body.discountQty,
      discountStep: body.discountStep,
      applyDiscountToFixedPrice: body.applyDiscountToFixedPrice ?? false,
      stopRulesProcessing: body.stopRulesProcessing ?? false,
      rewardPointsDelta: body.rewardPointsDelta,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to mock data
    mockDiscountRules.push(newRule);

    return NextResponse.json({
      success: true,
      data: newRule,
      message: "Discount rule created successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error creating discount rule:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create discount rule",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
