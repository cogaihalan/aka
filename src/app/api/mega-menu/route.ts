import { NextRequest, NextResponse } from "next/server";
import { MegaMenuData } from "@/types/menu";

// Mock data storage - in production, this would be a database
let megaMenuData: MegaMenuData = {
  items: [
    {
      id: "products",
      title: "Products",
      href: "/products",
      categories: [
        {
          id: "electronics",
          title: "Electronics",
          items: [
            {
              id: "smartphones",
              label: "Smartphones",
              href: "/products/smartphones",
              description: "Latest smartphones and accessories",
            },
            {
              id: "laptops",
              label: "Laptops",
              href: "/products/laptops",
              description: "High-performance laptops for work and gaming",
            },
          ],
        },
        {
          id: "clothing",
          title: "Clothing",
          items: [
            {
              id: "mens-clothing",
              label: "Men's Clothing",
              href: "/products/mens-clothing",
              description: "Stylish men's fashion",
            },
            {
              id: "womens-clothing",
              label: "Women's Clothing",
              href: "/products/womens-clothing",
              description: "Trendy women's fashion",
            },
          ],
        },
      ],
    },
    {
      id: "services",
      title: "Services",
      href: "/services",
      categories: [
        {
          id: "support",
          title: "Support",
          items: [
            {
              id: "customer-service",
              label: "Customer Service",
              href: "/support",
              description: "Get help with your orders",
            },
            {
              id: "returns",
              label: "Returns & Exchanges",
              href: "/returns",
              description: "Easy returns and exchanges",
            },
          ],
        },
      ],
    },
    {
      id: "company",
      title: "Company",
      href: "/company",
      categories: [
        {
          id: "about",
          title: "About Us",
          items: [
            {
              id: "our-story",
              label: "Our Story",
              href: "/about",
              description: "Learn about our company",
            },
            {
              id: "careers",
              label: "Careers",
              href: "/careers",
              description: "Join our team",
            },
          ],
        },
      ],
    },
  ],
};

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: megaMenuData,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch mega menu data",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { megaMenuData: newMegaMenuData } = body;

    // Validate required fields
    if (!newMegaMenuData.items || !Array.isArray(newMegaMenuData.items)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid mega menu data structure",
        },
        { status: 400 }
      );
    }

    // Update mega menu data
    megaMenuData = newMegaMenuData;

    return NextResponse.json({
      success: true,
      data: megaMenuData,
      message: "Mega menu updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update mega menu",
      },
      { status: 500 }
    );
  }
}
