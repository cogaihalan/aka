import { Metadata } from "next";
import ProductDetailPage from "@/features/storefront/components/product-detail-page";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productId } = await params;
  // In a real app, you'd fetch product data here
  return {
    title: `Product - AKA Store`,
    description: "Premium product details and specifications.",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;
  return <ProductDetailPage productId={productId} />;
}
