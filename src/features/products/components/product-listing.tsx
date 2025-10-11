import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./product-tables/columns";
import { unifiedProductService } from "@/lib/api/services/unified";

export default async function ProductListingPage() {
  // Get search parameters for filtering
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  const categories = searchParamsCache.get("category");
  const sort = searchParamsCache.get("sort");

  // Build query parameters for the service
  const queryParams = {
    page: page ? parseInt(page.toString()) : undefined,
    limit: pageLimit ? parseInt(pageLimit.toString()) : undefined,
    search: search?.toString(),
    sortBy: sort
      ? Array.isArray(sort)
        ? sort[0]?.id
        : (sort as any).id
      : undefined,
    sortOrder: sort
      ? Array.isArray(sort)
        ? sort[0]?.desc
          ? ("desc" as const)
          : ("asc" as const)
        : (sort as any).desc
          ? ("desc" as const)
          : ("asc" as const)
      : undefined,
    filters: {
      ...(categories && { categories: categories.toString() }),
    },
  };

  // Fetch products using the unified service
  const result = await unifiedProductService.getProducts(queryParams);

  const totalProducts =
    result.pagination?.total || result.items?.length || 0;
  const products = result.items || [];

  return (
    <DataTableWrapper
      data={products}
      totalItems={totalProducts}
      columns={columns}
      debounceMs={500}
      shallow={false}
    />
  );
}
