import { NextRequest, NextResponse } from "next/server";
import { mockOrders } from "@/lib/api/mock-data/orders";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Get filter parameters
    const status = searchParams.get("filters[status]");
    const paymentStatus = searchParams.get("filters[paymentStatus]");
    const fulfillmentStatus = searchParams.get("filters[fulfillmentStatus]");
    const userId = searchParams.get("filters[userId]");
    const dateFrom = searchParams.get("filters[dateFrom]");
    const dateTo = searchParams.get("filters[dateTo]");

    let filteredOrders = [...mockOrders];

    // Apply search filter
    if (search) {
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
          order.customer?.firstName
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          order.customer?.lastName
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          order.customer?.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (status) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === status
      );
    }

    // Apply payment status filter
    if (paymentStatus) {
      filteredOrders = filteredOrders.filter(
        (order) => order.paymentStatus === paymentStatus
      );
    }

    // Apply fulfillment status filter
    if (fulfillmentStatus) {
      filteredOrders = filteredOrders.filter(
        (order) => order.fulfillmentStatus === fulfillmentStatus
      );
    }

    // Apply user filter (for storefront)
    if (userId) {
      filteredOrders = filteredOrders.filter(
        (order) => order.customer?.id === parseInt(userId)
      );
    }

    // Apply date range filter
    if (dateFrom || dateTo) {
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        if (dateFrom && orderDate < new Date(dateFrom)) return false;
        if (dateTo && orderDate > new Date(dateTo)) return false;
        return true;
      });
    }

    // Apply sorting
    filteredOrders.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "orderNumber":
          aValue = a.orderNumber;
          bValue = b.orderNumber;
          break;
        case "total":
          aValue = a.pricing.total;
          bValue = b.pricing.total;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "createdAt":
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }

      if (aValue < bValue) return sortOrder === "desc" ? 1 : -1;
      if (aValue > bValue) return sortOrder === "desc" ? -1 : 1;
      return 0;
    });

    // Apply pagination
    const total = filteredOrders.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return NextResponse.json({
      orders: paginatedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generate order number
    const orderNumber = `AKA-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    const newOrder = {
      id: mockOrders.length + 1,
      orderNumber,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock data (in real app, this would be saved to database)
    mockOrders.unshift(newOrder);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
