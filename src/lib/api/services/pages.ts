import { CustomPage, PageListParams, PageListResponse, CreatePageRequest, UpdatePageRequest } from "@/types/page";

export class PagesService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  }

  async getPages(params: PageListParams = {}): Promise<PageListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.status !== undefined) queryParams.append("status", params.status);
    if (params.parentId !== undefined) queryParams.append("parentId", params.parentId);
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const response = await fetch(`${this.baseUrl}/api/pages?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch pages: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getPage(id: string): Promise<CustomPage> {
    const response = await fetch(`${this.baseUrl}/api/pages/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getPageBySlug(slug: string): Promise<CustomPage> {
    const response = await fetch(`${this.baseUrl}/api/pages/slug/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page by slug: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async createPage(data: CreatePageRequest): Promise<CustomPage> {
    const response = await fetch(`${this.baseUrl}/api/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to create page: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  async updatePage(id: string, data: UpdatePageRequest): Promise<CustomPage> {
    const response = await fetch(`${this.baseUrl}/api/pages/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to update page: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  async deletePage(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/pages/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to delete page: ${response.status}`);
    }
  }

  async getPageTree(): Promise<CustomPage[]> {
    const response = await this.getPages({ limit: 1000 }); // Get all pages
    const pages = response.pages;
    
    // Build tree structure
    const pageMap = new Map<string, CustomPage & { children: CustomPage[] }>();
    const rootPages: (CustomPage & { children: CustomPage[] })[] = [];

    // Initialize all pages with empty children array
    pages.forEach(page => {
      pageMap.set(page.id, { ...page, children: [] });
    });

    // Build tree
    pages.forEach(page => {
      const pageWithChildren = pageMap.get(page.id)!;
      
      if (page.parentId) {
        const parent = pageMap.get(page.parentId);
        if (parent) {
          parent.children.push(pageWithChildren);
        }
      } else {
        rootPages.push(pageWithChildren);
      }
    });

    return rootPages;
  }
}

export const pagesService = new PagesService();
