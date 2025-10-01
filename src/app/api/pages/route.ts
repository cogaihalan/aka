import { NextRequest, NextResponse } from "next/server";
import { CustomPage, PageListParams, CreatePageRequest } from "@/types/page";

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

// GET /api/pages - Get pages with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const params: PageListParams = {
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10,
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") as "published" | "draft" || undefined,
      parentId: searchParams.get("parentId") || undefined,
      sortBy: (searchParams.get("sortBy") as any) || "sortOrder",
      sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "asc",
    };

    let filteredPages = [...pages];

    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredPages = filteredPages.filter(page => 
        page.title.toLowerCase().includes(searchTerm) ||
        page.slug.toLowerCase().includes(searchTerm) ||
        (page.metaDescription && page.metaDescription.toLowerCase().includes(searchTerm))
      );
    }

    // Apply status filter
    if (params.status !== undefined) {
      filteredPages = filteredPages.filter(page => page.status === params.status);
    }

    // Apply parent filter
    if (params.parentId !== undefined) {
      if (params.parentId === "root") {
        filteredPages = filteredPages.filter(page => !page.parentId);
      } else {
        filteredPages = filteredPages.filter(page => page.parentId === params.parentId);
      }
    }

    // Apply sorting
    filteredPages.sort((a, b) => {
      const aValue = a[params.sortBy!];
      const bValue = b[params.sortBy!];
      
      if (params.sortOrder === "desc") {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });

    // Apply pagination
    const total = filteredPages.length;
    const totalPages = Math.ceil(total / params.limit!);
    const startIndex = (params.page! - 1) * params.limit!;
    const endIndex = startIndex + params.limit!;
    const paginatedPages = filteredPages.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        pages: paginatedPages,
        pagination: {
          total,
          page: params.page!,
          limit: params.limit!,
          totalPages
        }
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch pages",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// POST /api/pages - Create new page
export async function POST(request: NextRequest) {
  try {
    const body: CreatePageRequest = await request.json();
    
    // Validate required fields
    if (!body.title || !body.slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Title and slug are required",
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPage = pages.find(page => page.slug === body.slug);
    if (existingPage) {
      return NextResponse.json(
        {
          success: false,
          error: "A page with this slug already exists",
        },
        { status: 409 }
      );
    }

    // If this is set as homepage, unset other homepages
    if (body.isHomepage) {
      pages = pages.map(page => ({ ...page, isHomepage: false }));
    }

    // Create new page
    const newPage: CustomPage = {
      id: Date.now().toString(),
      title: body.title,
      slug: body.slug,
      content: body.content || { time: Date.now(), blocks: [], version: "2.28.2" },
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
      keywords: body.keywords || [],
      status: body.status || "draft",
      isHomepage: body.isHomepage || false,
      parentId: body.parentId,
      sortOrder: body.sortOrder || pages.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: body.status === "published" ? new Date() : undefined,
      authorId: "admin", // In real app, get from auth
      authorName: "Admin"
    };

    pages.push(newPage);

    return NextResponse.json({
      success: true,
      data: newPage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create page",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
