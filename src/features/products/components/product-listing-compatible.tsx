import { Product } from "@/constants/data";
import { searchParamsCache } from "@/lib/searchparams";
import { ProductTable } from "./product-tables";
import { columns } from "./product-tables/columns";
import { getProductsCompatible } from "@/lib/api/compatibility";

type ProductListingPage = {};

export default async function ProductListingCompatible({}: ProductListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get("page");
  const search = searchParamsCache.get("name");
  const pageLimit = searchParamsCache.get("perPage");
  const categories = searchParamsCache.get("category");

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { filters: { category: categories } }),
  };

  // Use the compatibility layer to get products
  const data = await getProductsCompatible(filters);
  const totalProducts = data.pagination.total;
  const products: Product[] = data.products.map((apiProduct) => ({
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    photo_url: apiProduct.images[0]?.url || "",
    category: apiProduct.category.name,
    created_at: apiProduct.createdAt,
    updated_at: apiProduct.updatedAt,
  }));

  return (
    <ProductTable
      data={products}
      totalItems={totalProducts}
      columns={columns}
    />
  );
}
