"use client";

import { CustomPage } from "@/types/page";
import { EditorJSRenderer } from "@/components/editor/editorjs-renderer";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Home } from "lucide-react";
import { format } from "date-fns";

interface PageRendererProps {
  page: CustomPage;
  showMeta?: boolean;
  className?: string;
}

export function PageRenderer({ 
  page, 
  showMeta = true, 
  className = "" 
}: PageRendererProps) {
  return (
    <div className={`page-renderer ${className}`}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
        
        {showMeta && (
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>By {page.authorName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                {page.publishedAt 
                  ? `Published ${format(new Date(page.publishedAt), "MMM dd, yyyy")}`
                  : `Updated ${format(new Date(page.updatedAt), "MMM dd, yyyy")}`
                }
              </span>
            </div>
            {page.isHomepage && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Home className="h-3 w-3" />
                <span>Homepage</span>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Page Content */}
      <div className="prose prose-lg max-w-none">
        <EditorJSRenderer data={page.content} />
      </div>
    </div>
  );
}
