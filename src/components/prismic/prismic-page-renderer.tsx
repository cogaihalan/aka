"use client";

import { PrismicRichText } from "@prismicio/react";
import { PrismicContent } from "@/types/prismic";

interface PrismicPageRendererProps {
  content: PrismicContent;
  type: "page" | "static_page" | "blog_post";
}

export function PrismicPageRenderer({
  content,
  type,
}: PrismicPageRendererProps) {
  const data = content.data;

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Content Not Available</h1>
          <p className="text-muted-foreground">
            This content is not available or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section for Blog Posts */}
      {type === "blog_post" &&
        "featured_image" in data &&
        data.featured_image && (
          <div className="relative h-64 md:h-96 bg-muted">
            <img
              src={data.featured_image.url}
              alt={data.featured_image.alt || ""}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {"title" in data
              ? data.title
              : "name" in data
                ? data.name
                : "Untitled"}
          </h1>

          {/* Blog Post Meta */}
          {type === "blog_post" && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              {"author" in data && data.author && <span>By {data.author}</span>}
              {"published_date" in data && data.published_date && (
                <span>
                  {new Date(data.published_date).toLocaleDateString()}
                </span>
              )}
              {"tags" in data && data.tags && data.tags.length > 0 && (
                <div className="flex gap-2">
                  {data.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-muted rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Blog Post Excerpt */}
          {type === "blog_post" && "excerpt" in data && data.excerpt && (
            <p className="text-lg text-muted-foreground mb-6">{data.excerpt}</p>
          )}
        </div>

        {/* Rich Text Content */}
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            {"content" in data && data.content && (
              <PrismicRichText field={data.content} />
            )}
            {"description" in data && data.description && (
              <p className="text-lg text-muted-foreground">
                {data.description}
              </p>
            )}
          </div>
        </div>

        {/* Blog Post Tags */}
        {type === "blog_post" &&
          "tags" in data &&
          data.tags &&
          data.tags.length > 0 && (
            <div className="max-w-4xl mx-auto mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
