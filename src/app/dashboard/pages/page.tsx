import { Metadata } from "next";
import { Suspense } from "react";
import { AddPageDialog } from "@/features/pages/components/add-page-dialog";
import PageListingPage from "@/features/pages/components/page-listing";
import PageContainer from "@/components/layout/page-container";
import { searchParamsCache } from "@/lib/searchparams";
import { DashboardPageProps } from "@/types";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";

export const metadata: Metadata = {
  title: "Pages - AKA Store Admin",
  description: "Manage custom pages and content for your store",
};

export default async function PagesPage(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  // Allow nested RSCs to access the search params (in a type-safe way)
  searchParamsCache.parse(searchParams);

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title="Pages"
            description="Create and manage custom pages for your store. Build pages with rich content using the visual editor."
          />
          <AddPageDialog />
        </div>
        <Separator />
        <Suspense
          fallback={
            <DataTableSkeleton columnCount={6} rowCount={8} filterCount={3} />
          }
        >
          <PageListingPage />
        </Suspense>
      </div>
    </PageContainer>
  );
}
