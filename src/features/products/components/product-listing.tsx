import { searchParamsCache } from '@/lib/searchparams';
import { DataTableWrapper } from '@/components/ui/table/data-table-wrapper';
import { columns } from './product-tables/columns';
import { adminProductService } from '@/lib/api';

type ProductListingPage = {};

export default async function ProductListingPage({}: ProductListingPage) {
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const categories = searchParamsCache.get('category');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories })
  };

  // Fetch products from API using the same pattern as categories
  const data = await adminProductService.getProducts(filters);
  const totalProducts = Array.isArray(data) ? data.length : data.pagination.total;
  const products = Array.isArray(data) ? data : data.products;

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
