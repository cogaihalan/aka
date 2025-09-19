import { Metadata } from "next";
import CategoryPage from "@/features/storefront/components/category-page";

interface CategoryPageProps {
  params: Promise<{
    categorySlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  return {
    title: `${categorySlug} - AKA Store`,
    description: `Browse ${categorySlug} products at AKA Store.`,
  };
}

export default async function CategoryPageRoute({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  return <CategoryPage categorySlug={categorySlug} />;
}
