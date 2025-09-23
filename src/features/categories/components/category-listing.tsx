import { adminCategoryService } from "@/lib/api";
import { searchParamsCache } from "@/lib/searchparams";
import { CategoryTable } from "./category-tables";
import { columns } from "@/features/categories/components/category-tables/columns";

type CategoryListingPage = {};

export default async function CategoryListingPage({}: CategoryListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  const isActive = searchParamsCache.get("isActive");
  const parentId = searchParamsCache.get("parentId");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(isActive !== undefined && {
      filters: { isActive: isActive === "true" },
    }),
    ...(parentId && { filters: { parentId: parseInt(parentId, 10) } }),
  };

  const data = await adminCategoryService.getCategories(filters);
  const totalCategories = Array.isArray(data) ? data.length : data.pagination.total;
  const categories = Array.isArray(data) ? data : data.categories;

  return (
    <CategoryTable
      data={categories}
      totalItems={totalCategories}
      columns={columns}
    />
  );
}
