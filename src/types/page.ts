export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: EditorJSOutput;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  status: "published" | "draft";
  isHomepage: boolean;
  parentId?: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  authorId: string;
  authorName: string;
  children?: CustomPage[];
  parent?: CustomPage;
}

export interface EditorJSOutput {
  time: number;
  blocks: EditorJSBlock[];
  version: string;
}

export interface EditorJSBlock {
  id: string;
  type: string;
  data: Record<string, any>;
}

export interface PageListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "published" | "draft";
  parentId?: string;
  sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'sortOrder';
  sortOrder?: 'asc' | 'desc';
}

export interface PageListResponse {
  pages: CustomPage[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreatePageRequest {
  title: string;
  slug: string;
  content: EditorJSOutput;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  status?: "published" | "draft";
  isHomepage?: boolean;
  parentId?: string;
  sortOrder?: number;
}

export interface UpdatePageRequest extends Partial<CreatePageRequest> {
  id: string;
}

export interface PageTreeNode {
  id: string;
  title: string;
  slug: string;
  status: "published" | "draft";
  children: PageTreeNode[];
  level: number;
}
