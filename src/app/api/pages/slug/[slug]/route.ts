import { NextRequest, NextResponse } from "next/server";
import { CustomPage } from "@/types/page";

// Mock data storage - in production, this would be a database
let pages: CustomPage[] = [
  {
    id: "1",
    title: "About Us",
    slug: "about",
    content: {
      time: Date.now(),
      blocks: [
        {
          id: "block1",
          type: "header",
          data: {
            text: "Welcome to AKA Store",
            level: 1
          }
        },
        {
          id: "block2",
          type: "paragraph",
          data: {
            text: "We are a premium ecommerce store dedicated to providing the best products and services to our customers."
          }
        }
      ],
      version: "2.28.2"
    },
    metaTitle: "About Us - AKA Store",
    metaDescription: "Learn more about AKA Store and our commitment to quality.",
    keywords: ["about", "company", "store"],
    status: "published",
    isHomepage: false,
    sortOrder: 1,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    publishedAt: new Date("2024-01-01"),
    authorId: "admin",
    authorName: "Admin"
  },
  {
    id: "2",
    title: "Contact",
    slug: "contact",
    content: {
      time: Date.now(),
      blocks: [
        {
          id: "block1",
          type: "header",
          data: {
            text: "Contact Us",
            level: 1
          }
        },
        {
          id: "block2",
          type: "paragraph",
          data: {
            text: "Get in touch with us for any questions or support."
          }
        }
      ],
      version: "2.28.2"
    },
    metaTitle: "Contact Us - AKA Store",
    metaDescription: "Get in touch with AKA Store for support and inquiries.",
    keywords: ["contact", "support", "help"],
    status: "published",
    isHomepage: false,
    sortOrder: 2,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    publishedAt: new Date("2024-01-01"),
    authorId: "admin",
    authorName: "Admin"
  },
  {
    id: "3",
    title: "Help Center",
    slug: "help",
    content: {
      time: Date.now(),
      blocks: [
        {
          id: "block1",
          type: "header",
          data: {
            text: "Help Center",
            level: 1
          }
        },
        {
          id: "block2",
          type: "paragraph",
          data: {
            text: "Find answers to common questions and get help with your orders."
          }
        }
      ],
      version: "2.28.2"
    },
    metaTitle: "Help Center - AKA Store",
    metaDescription: "Get help and find answers to common questions.",
    keywords: ["help", "faq", "support"],
    status: "published",
    isHomepage: false,
    sortOrder: 3,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    publishedAt: new Date("2024-01-01"),
    authorId: "admin",
    authorName: "Admin"
  }
];

// GET /api/pages/slug/[slug] - Get page by slug (for public access)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const page = pages.find(p => p.slug === slug && p.status === "published");
    
    if (!page) {
      return NextResponse.json(
        {
          success: false,
          error: "Page not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: page,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching page by slug:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch page",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
