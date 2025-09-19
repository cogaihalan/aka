"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Star, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import { useCart } from "@/hooks/use-cart";

interface ProductDetailPageProps {
  productId: string;
}

export default function ProductDetailPage({
  productId,
}: ProductDetailPageProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const {
    addToCart: handleAddToCart,
    isAdding,
    error,
  } = useAddToCart({
    onSuccess: (product, quantity) => {
      console.log(`Added ${quantity} x ${product.name} to cart`);
    },
    onError: (error) => {
      console.error("Add to cart error:", error);
    },
  });

  const { isInCart, getItemQuantity } = useCart();
  const isInCartState = isInCart(parseInt(productId));
  const cartQuantity = getItemQuantity(parseInt(productId));

  // Mock product data - in real app, fetch based on productId
  const product = {
    id: parseInt(productId),
    name: "Premium Product",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviewCount: 124,
    description:
      "This is a premium quality product with exceptional features and design. Perfect for those who appreciate quality and style.",
    features: [
      "High-quality materials",
      "Durable construction",
      "Modern design",
      "Easy to use",
      "Long-lasting performance",
    ],
    images: ["", "", "", ""], // Mock image URLs
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White", "Blue", "Red"],
    inStock: true,
    stockCount: 15,
  };

  const onAddToCart = () => {
    // Convert to Product type for the cart
    const productForCart = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      compareAtPrice: product.originalPrice,
      sku: `PROD-${product.id}`,
      category: {
        id: 1,
        name: "Electronics",
        slug: "electronics",
        level: 1,
        path: "/electronics",
        seo: { title: "Electronics", description: "Electronics category" },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      brand: undefined,
      tags: [],
      images: [],
      variants: [],
      inventory: {
        quantity: product.stockCount,
        reserved: 0,
        available: product.stockCount,
        trackQuantity: true,
        allowBackorder: false,
        lowStockThreshold: 5,
      },
      seo: { title: product.name, description: product.description },
      status: product.inStock ? ("active" as const) : ("inactive" as const),
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    handleAddToCart(productForCart, undefined, quantity);
  };

  const handleBuyNow = () => {
    onAddToCart();
    // Navigate to checkout
    window.location.href = "/checkout";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="aspect-square bg-muted rounded-lg"></div>
        <div className="grid grid-cols-4 gap-2">
          {product.images.map((_, index) => (
            <div
              key={index}
              className="aspect-square bg-muted rounded-md"
            ></div>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <Badge variant="secondary" className="mb-2">
            Electronics
          </Badge>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
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
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl font-bold">${product.price}</span>
            <span className="text-lg text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
            <Badge variant="destructive">
              Save ${(product.originalPrice - product.price).toFixed(2)}
            </Badge>
          </div>

          <p className="text-muted-foreground">{product.description}</p>
        </div>

        <Separator />

        {/* Product Options */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Size</label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {product.sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Color</label>
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                {product.colors.map((color) => (
                  <SelectItem key={color} value={color}>
                    {color}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Quantity</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={onAddToCart}
              disabled={isAdding || !product.inStock}
            >
              {isInCartState ? `In Cart (${cartQuantity})` : "Add to Cart"}
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={handleBuyNow}
            disabled={isAdding || !product.inStock}
          >
            Buy Now
          </Button>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        {/* Stock Status */}
        <div className="text-sm">
          {product.inStock ? (
            <span className="text-green-600">
              ✓ In Stock ({product.stockCount} available)
            </span>
          ) : (
            <span className="text-red-600">✗ Out of Stock</span>
          )}
        </div>

        {/* Features */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Key Features</h3>
            <ul className="space-y-1">
              {product.features.map((feature, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Shipping Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />
            <span>Free shipping on orders over $50</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>2-year warranty</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-primary" />
            <span>30-day returns</span>
          </div>
        </div>
      </div>
    </div>
  );
}
