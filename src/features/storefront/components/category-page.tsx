"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { FeaturedProductCard } from "@/components/product/featured-product-card";

interface CategoryPageProps {
  categorySlug: string;
}

export default function CategoryPage({ categorySlug }: CategoryPageProps) {
  // Mock products for the category
  const products = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation",
      price: 199.99,
      compareAtPrice: 249.99,
      rating: 4.8,
      image: "/api/placeholder/300/300",
      category: "Electronics",
      inStock: true,
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      description: "Track your fitness goals with this advanced smartwatch",
      price: 299.99,
      rating: 4.6,
      image: "/api/placeholder/300/300",
      category: "Wearables",
      inStock: true,
    },
    {
      id: 3,
      name: "Gaming Mechanical Keyboard",
      description: "Professional gaming keyboard with RGB lighting",
      price: 149.99,
      compareAtPrice: 179.99,
      rating: 4.9,
      image: "/api/placeholder/300/300",
      category: "Gaming",
      inStock: true,
    },
    {
      id: 4,
      name: "Wireless Charging Pad",
      description: "Fast wireless charging for all compatible devices",
      price: 79.99,
      rating: 4.5,
      image: "/api/placeholder/300/300",
      category: "Accessories",
      inStock: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 capitalize">
          {categorySlug.replace("-", " ")}
        </h1>
        <p className="text-muted-foreground">
          Browse our {categorySlug.replace("-", " ")} collection
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <FeaturedProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
