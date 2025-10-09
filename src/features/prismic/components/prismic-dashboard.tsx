"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, FileText, Calendar, Eye, Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { prismicApiService } from "@/lib/api/prismic-service";
import { PrismicPage, PrismicContent } from "@/types/prismic";

interface PrismicDashboardProps {}

export function PrismicDashboard({}: PrismicDashboardProps) {
  const [content, setContent] = useState<{
    pages: PrismicPage[];
    categories: any[];
    blogPosts: any[];
    staticPages: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const data = await prismicApiService.getAllContent();
        setContent(data);
      } catch (err) {
        setError("Failed to fetch content");
        console.error("Error fetching Prismic content:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!content) {
    return <div>No content available</div>;
  }

  const totalPages = content.pages.length + content.staticPages.length;
  const publishedPages = [...content.pages, ...content.staticPages].filter(
    (page: any) => page.data?.status === 'published'
  ).length;
  const draftPages = [...content.pages, ...content.staticPages].filter(
    (page: any) => page.data?.status === 'draft'
  ).length;

  const recentPages = [...content.pages, ...content.staticPages]
    .sort((a: any, b: any) => 
      new Date(b.last_publication_date).getTime() - new Date(a.last_publication_date).getTime()
    )
    .slice(0, 5);

  const getLastUpdated = () => {
    if (recentPages.length === 0) return "Never";
    return formatDistanceToNow(new Date(recentPages[0].last_publication_date), { addSuffix: true });
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{publishedPages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{draftPages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">{getLastUpdated()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Pages
          </CardTitle>
          <CardDescription>
            Latest content updates from Prismic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentPages.map((page: any) => (
              <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium">{page.data?.title || page.data?.name || 'Untitled'}</h4>
                  <p className="text-sm text-muted-foreground">
                    /{page.uid} • {formatDistanceToNow(new Date(page.last_publication_date), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={page.data?.status === 'published' ? 'default' : 'secondary'}>
                    {page.data?.status || 'draft'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_PRISMIC_URL}/documents/${page.id}`, '_blank')}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Common content management tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => window.open(`${process.env.NEXT_PUBLIC_PRISMIC_URL}/documents/new`, '_blank')}
              className="h-20 flex-col gap-2"
            >
              <Plus className="h-6 w-6" />
              Create New Page
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open(process.env.NEXT_PUBLIC_PRISMIC_URL || 'https://prismic.io', '_blank')}
              className="h-20 flex-col gap-2"
            >
              <ExternalLink className="h-6 w-6" />
              Open Prismic
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
