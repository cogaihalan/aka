import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types/product";
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

  const handleSubmit = async (data: CreateProductRequest) => {
    try {
      if (productId === "new") {
        await adminProductService.createProduct(data);
      } else {
        const updateData: UpdateProductRequest = {
          ...data,
          id: Number(productId),
          version: product?.version || 1,
        };
        await adminProductService.updateProduct(Number(productId), updateData);
      }
      // Handle success (redirect, show toast, etc.)
    } catch (error) {
      console.error("Error saving product:", error);
      // Handle error (show toast, etc.)
    }
  };

  return (
    <ProductForm
      initialData={product}
      pageTitle={pageTitle}
      onSubmit={handleSubmit}
    />
  );
}
