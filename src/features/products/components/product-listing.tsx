import { searchParamsCache } from "@/lib/searchparams";
import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { columns } from "./product-tables/columns";

export default async function ProductListingPage() {
  // Get search parameters for filtering
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  const categories = searchParamsCache.get("category");

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (page) queryParams.append("page", page.toString());
  if (pageLimit) queryParams.append("limit", pageLimit.toString());
  if (search) queryParams.append("search", search);
  if (categories) queryParams.append("filters[categories]", categories);

  // Fetch products from API endpoint with query parameters
  const response = await fetch(
    `http://localhost:3000/api/products?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products: ${response.status} ${response.statusText}`
    );
  }

  const result = await response.json();

  const data = result.data;
  const totalProducts = data.pagination?.total || data.products?.length || 0;
  const products = data.products || [];

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
