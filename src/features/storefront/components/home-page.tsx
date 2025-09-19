"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Truck, Shield, RotateCcw } from "lucide-react";
import Link from "next/link";
import { FeaturedProductCard } from "@/components/product/featured-product-card";
import FullWidthBanner from "@/components/full-width-banner";

export default function StorefrontHomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section - Full Width */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8">
        <FullWidthBanner />
      </div>
      
      {/* Rest of content with normal padding */}
        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Truck className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg">Free Shipping</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Free shipping on orders over $50. Fast and reliable delivery to
              your doorstep.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg">Secure Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Your payment information is secure with our encrypted checkout
              process.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <RotateCcw className="h-6 w-6 text-primary" />
            <CardTitle className="text-lg">Easy Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              30-day return policy. Not satisfied? Return it for a full refund.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Button variant="outline" asChild>
            <Link href="/products">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              id: 50,
              name: "Premium Wireless Headphones",
              description:
                "High-quality wireless headphones with noise cancellation",
              price: 199.99,
              compareAtPrice: 249.99,
              rating: 4.8,
              image: "",
              category: "Electronics",
              inStock: true,
            },
            {
              id: 51,
              name: "Smart Fitness Watch",
              description:
                "Track your fitness goals with this advanced smartwatch",
              price: 299.99,
              rating: 4.6,
              image: "",
              category: "Wearables",
              inStock: true,
            },
            {
              id: 52,
              name: "Gaming Mechanical Keyboard",
              description: "Professional gaming keyboard with RGB lighting",
              price: 149.99,
              compareAtPrice: 179.99,
              rating: 4.9,
              image: "",
              category: "Gaming",
              inStock: true,
            },
            {
              id: 4,
              name: "Wireless Charging Pad",
              description: "Fast wireless charging for all compatible devices",
              price: 79.99,
              rating: 4.5,
              image: "",
              category: "Accessories",
              inStock: true,
            },
          ].map((product) => (
            <FeaturedProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-muted/50 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Subscribe to our newsletter and be the first to know about new
          products, exclusive offers, and special promotions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border rounded-md bg-background"
          />
          <Button>Subscribe</Button>
        </div>
      </section>
    </div>
  );
}
