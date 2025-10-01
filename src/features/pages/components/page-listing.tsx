import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./page-tables/columns";
import { pagesService } from "@/lib/api";

export default async function PageListingPage() {
  // Get search parameters for filtering
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name"); // Use 'name' instead of 'title' to match existing cache
  const pageLimit = searchParamsCache.get("perPage");
  const status = searchParamsCache.get("status");
  const parentId = searchParamsCache.get("parentId");

  // Build query parameters
  const queryParams = {
    page: page ? parseInt(page.toString()) : undefined,
    limit: pageLimit ? parseInt(pageLimit.toString()) : undefined,
    search: search ? search.toString() : undefined,
    status: status ? status as "published" | "draft" : undefined,
    parentId: parentId ? parentId.toString() : undefined,
  };

  // Fetch pages from API endpoint
  const result = await pagesService.getPages(queryParams);

  return (
    <DataTableWrapper
      data={result.pages}
      totalItems={result.pagination.total}
      columns={columns}
      debounceMs={500}
      shallow={false}
    />
  );
}
