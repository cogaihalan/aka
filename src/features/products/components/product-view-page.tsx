import { notFound } from "next/navigation";
import ProductForm from "./product-form";
import { adminProductService } from "@/lib/api";

type TProductViewPageProps = {
  productId: string;
};

export default async function ProductViewPage({
  productId,
}: TProductViewPageProps) {
  let product = null;
  let pageTitle = "Create New Product";

  if (productId !== "new") {
    try {
      product = await adminProductService.getProduct(Number(productId));
      pageTitle = `Edit Product`;
    } catch (error) {
      console.error("Error fetching product:", error);
      notFound();
    }
  }

  return (
    <ProductForm
      initialData={product}
      pageTitle={pageTitle}
      productId={productId}
    />
  );
}