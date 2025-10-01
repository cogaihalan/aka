import { NextRequest, NextResponse } from "next/server";
import { CustomPage, UpdatePageRequest } from "@/types/page";

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

// GET /api/pages/[id] - Get single page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const page = pages.find(p => p.id === id);
    
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
    console.error("Error fetching page:", error);
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

// PUT /api/pages/[id] - Update page
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdatePageRequest = await request.json();
    
    const pageIndex = pages.findIndex(p => p.id === id);
    
    if (pageIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Page not found",
        },
        { status: 404 }
      );
    }

    // Check if slug already exists (excluding current page)
    if (body.slug) {
      const existingPage = pages.find(p => p.slug === body.slug && p.id !== id);
      if (existingPage) {
        return NextResponse.json(
          {
            success: false,
            error: "A page with this slug already exists",
          },
          { status: 409 }
        );
      }
    }

    // If this is set as homepage, unset other homepages
    if (body.isHomepage) {
      pages = pages.map(page => ({ ...page, isHomepage: false }));
    }

    // Update page
    const updatedPage: CustomPage = {
      ...pages[pageIndex],
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
      publishedAt: body.status === "published" && !pages[pageIndex].publishedAt ? new Date() : pages[pageIndex].publishedAt,
    };

    pages[pageIndex] = updatedPage;

    return NextResponse.json({
      success: true,
      data: updatedPage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update page",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// DELETE /api/pages/[id] - Delete page
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const pageIndex = pages.findIndex(p => p.id === id);
    
    if (pageIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Page not found",
        },
        { status: 404 }
      );
    }

    // Check if page has children
    const hasChildren = pages.some(p => p.parentId === id);
    if (hasChildren) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot delete page with child pages. Please delete child pages first.",
        },
        { status: 400 }
      );
    }

    // Remove page
    pages.splice(pageIndex, 1);

    return NextResponse.json({
      success: true,
      message: "Page deleted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete page",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
