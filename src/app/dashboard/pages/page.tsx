import { Suspense } from "react";
import { Metadata } from "next";
import { Plus, ExternalLink, RefreshCw } from "lucide-react";

import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { PrismicDashboard } from "@/features/prismic/components/prismic-dashboard";
import { PrismicPagesList } from "@/features/prismic/components/prismic-pages-list";

export const metadata: Metadata = {
  title: "Content Pages",
  description: "Manage static pages and content using Prismic CMS",
};

function PrismicDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Quick Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Pages Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2 border rounded">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PrismicPagesPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        {/* <div className="flex items-start justify-between">
          <Heading
            title="Content Pages"
            description="Manage static pages and content using Prismic CMS"
          />
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => window.open(process.env.NEXT_PUBLIC_PRISMIC_URL || 'https://prismic.io', '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Prismic
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button
              onClick={() => window.open(`${process.env.NEXT_PUBLIC_PRISMIC_URL}/documents/new`, '_blank')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Page
            </Button>
          </div>
        </div> */}
        <Separator />
        
        <Suspense fallback={<PrismicDashboardSkeleton />}>
          <PrismicDashboard />
        </Suspense>
        
        <Separator />
        
        <Suspense fallback={<div>Loading pages...</div>}>
          <PrismicPagesList />
        </Suspense>
      </div>
    </PageContainer>
  );
}
