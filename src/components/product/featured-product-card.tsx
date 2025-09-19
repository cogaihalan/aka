"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart, Heart, Share2, Eye } from "lucide-react";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

interface FeaturedProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    rating: number;
    image?: string;
    category?: string;
    inStock?: boolean;
  };
  className?: string;
}

export function FeaturedProductCard({
  product,
  className,
}: FeaturedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, isAdding, error } = useAddToCart({
    onSuccess: (product, quantity) => {
      console.log(`Added ${quantity} x ${product.name} to cart`);
    },
    onError: (error) => {
      console.error("Add to cart error:", error);
    },
  });

  const { isInCart, getItemQuantity } = useCart();
  const isInCartState = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    // Convert to Product type for the cart
    const productForCart = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      sku: `PROD-${product.id}`,
      category: {
        id: 1,
        name: product.category || "General",
        slug: "general",
        level: 1,
        path: "/general",
        seo: { title: product.category || "General", description: "" },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      brand: undefined,
      tags: [],
      images: product.image
        ? [
            {
              id: 1,
              url: product.image,
              alt: product.name,
              order: 0,
              isPrimary: true,
            },
          ]
        : [],
      variants: [],
      inventory: {
        quantity: product.inStock ? 10 : 0,
        reserved: 0,
        available: product.inStock ? 10 : 0,
        trackQuantity: true,
        allowBackorder: false,
      },
      seo: { title: product.name, description: product.description },
      status: (product.inStock ? "active" : "inactive") as
        | "active"
        | "inactive"
        | "draft"
        | "archived",
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addToCart(productForCart, undefined, 1);
  };

  const handleWishlist = () => {
    console.log("Add to wishlist:", product.id);
  };

  const handleShare = () => {
    console.log("Share product:", product.id);
  };

  return (
    <Card
      className={cn("group cursor-pointer relative overflow-hidden", className)}
      isProductCard={true}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square bg-muted rounded-t-lg overflow-hidden relative">
          <Image
            src={product.image || "/assets/placeholder-image.jpeg"}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Overlay Actions */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            {/* Dark overlay background */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Action buttons */}
            <div className="relative flex items-center gap-3">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleWishlist}
                className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
              >
                <Heart className="h-4 w-4 text-red-500" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleAddToCart}
                className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Link>

      <CardContent className="px-4 pb-4 flex flex-col h-full">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>

          <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">${product.price}</span>
              {product.compareAtPrice &&
                product.compareAtPrice > product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.compareAtPrice}
                  </span>
                )}
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-2">
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isAdding || !product.inStock}
            className="w-full"
          >
            {isInCartState ? (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                In Cart ({cartQuantity})
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
