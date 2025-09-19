import { Metadata } from "next";
import ProductListingPage from "@/features/storefront/components/product-listing-page";

export const metadata: Metadata = {
  title: "All Products - AKA Store",
  description:
    "Browse our complete collection of premium products. Find exactly what you're looking for.",
};

export default function ProductsPage() {
  return <ProductListingPage />;
}
