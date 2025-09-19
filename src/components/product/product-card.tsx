"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "featured";
  showWishlist?: boolean;
  className?: string;
}

export function ProductCard({
  product,
  variant = "default",
  showWishlist = true,
  className,
}: ProductCardProps) {
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
    addToCart(product, undefined, 1);
  };

  const handleWishlist = () => {
    // TODO: Implement wishlist functionality
    console.log("Add to wishlist:", product.id);
  };

  const handleQuickView = () => {
    // TODO: Implement quick view functionality
    console.log("Quick view:", product.id);
    // For now, open in new tab
    window.open(`/products/${product.id}`, "_blank");
  };

  if (variant === "compact") {
    return (
      <Card
        className={cn("group cursor-pointer h-full flex flex-col", className)}
        isProductCard={true}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-3 flex-1 flex flex-col">
          <div className="flex gap-3 flex-1">
            {/* Image on the left - smaller */}
            <Link href={`/products/${product.id}`} className="flex-shrink-0">
              <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={product.images?.[0]?.url || "/assets/placeholder-image.jpeg"}
                  alt={product.images?.[0]?.alt || product.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            
            {/* Content on the right */}
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    {product.category?.name || "Uncategorized"}
                  </Badge>
                </div>
                <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold">${product.price}</span>
                <div className="flex items-center gap-1">
                  {showWishlist && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleWishlist}
                      className="h-7 w-7 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Heart className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleQuickView}
                    className="h-7 w-7 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddToCart}
                    disabled={isAdding || product.status !== "active"}
                    className="h-7 px-2 text-xs"
                  >
                    <ShoppingCart className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "featured") {
    return (
      <Card
        className={cn(
          "group cursor-pointer relative overflow-hidden h-full flex flex-col",
          className
        )}
        isProductCard={true}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/products/${product.id}`}>
          <div className="aspect-square bg-muted rounded-t-lg overflow-hidden relative">
            <Image
              src={product.images?.[0]?.url || "/assets/placeholder-image.jpeg"}
              alt={product.images?.[0]?.alt || product.name}
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
                {showWishlist && (
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={handleWishlist}
                    className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
                  >
                    <Heart className="h-4 w-4 text-red-500" />
                  </Button>
                )}
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
                  onClick={handleQuickView}
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
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {product.category?.name || "Uncategorized"}
              </Badge>
              {product.featured && (
                <Badge variant="destructive" className="text-xs">
                  Featured
                </Badge>
              )}
            </div>

            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-2">
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
            <div className="flex items-center justify-between">
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={isAdding || product.status !== "active"}
                className="flex-1"
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
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card
      className={cn("group cursor-pointer h-full flex flex-col", className)}
      isProductCard={true}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square bg-muted rounded-t-lg overflow-hidden relative">
          <Image
            src={product.images?.[0]?.url || "/assets/placeholder-image.jpeg"}
            alt={product.images?.[0]?.alt || product.name}
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
              {showWishlist && (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleWishlist}
                  className="h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg"
                >
                  <Heart className="h-4 w-4 text-red-500" />
                </Button>
              )}
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
                onClick={handleQuickView}
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
          <Badge variant="secondary" className="text-xs">
            {product.category?.name || "Uncategorized"}
          </Badge>

          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2">
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
          <div className="flex items-center justify-between">
            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isAdding || product.status !== "active"}
              className="flex-1"
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
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
