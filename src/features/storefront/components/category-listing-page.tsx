"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "Electronics",
    slug: "electronics",
    productCount: 45,
    image: "",
  },
  { id: 2, name: "Fashion", slug: "fashion", productCount: 32, image: "" },
  {
    id: 3,
    name: "Home & Garden",
    slug: "home-garden",
    productCount: 28,
    image: "",
  },
  { id: 4, name: "Sports", slug: "sports", productCount: 19, image: "" },
  { id: 5, name: "Books", slug: "books", productCount: 67, image: "" },
  { id: 6, name: "Beauty", slug: "beauty", productCount: 23, image: "" },
];

export default function CategoryListingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="text-muted-foreground">Browse products by category</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="group cursor-pointer">
            <Link href={`/categories/${category.slug}`}>
              <div className="aspect-video bg-muted rounded-t-lg"></div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <Badge variant="secondary">
                  {category.productCount} products
                </Badge>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
