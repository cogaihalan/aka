"use client";

import { memo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Truck, Shield, RotateCcw, X } from "lucide-react";
import { Product } from "@/lib/api/types";
import {
  ProductImageGallery,
  ProductInfo,
} from "@/components/product/product-detail";

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickViewModal = memo(function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  if (!product) return null;

  // Transform product data to match the expected interface
  const enhancedProduct = {
    ...product,
    rating: 4.5, // Default rating for quick view
    reviewCount: 128, // Default review count
    features: [
      "High-quality materials",
      "Durable construction",
      "Modern design",
      "Easy to use",
      "Long-lasting performance",
    ],
    inStock: product.inventory.available > 0,
    stockCount: product.inventory.available,
    sizes:
      product.variants?.map((v) => v.attributes.size).filter(Boolean) || [],
    colors:
      product.variants?.map((v) => v.attributes.color).filter(Boolean) || [],
  };

  // Prepare images for the gallery
  const galleryImages =
    product.images?.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt || product.name,
      order: img.order || 0,
      isPrimary: img.isPrimary || false,
    })) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-auto overflow-auto max-h-[90vh] p-0 sm:w-[90%] sm:max-w-7xl">
        <DialogHeader className="px-4 py-2 flex-shrink-0 sticky top-0 bg-background z-20 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg lg:text-2xl font-bold">
              {product.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-sm hover:bg-accent hover:text-accent-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-6 px-4 lg:px-0 pb-4 pt-0 lg:flex-row overflow-auto">
          {/* Product Gallery - Fixed and Sticky */}
          <div className="lg:w-1/2 lg:h-full lg:pl-4 overflow-hidden">
            <ProductImageGallery
              images={galleryImages}
              productName={product.name}
              className="h-full"
            />
          </div>

          {/* Product Info - Scrollable */}
          <div className="lg:w-1/2 overflow-y-auto lg:pr-4 overflow-x-hidden">
            <ProductInfo product={enhancedProduct} />

            {/* Additional Quick View Features */}
            <div className="mt-6 space-y-4">
              {/* View Full Details Link */}
              <div className="pt-4">
                <Link href={`/products/${product.id}`}>
                  <Button variant="outline" className="w-full">
                    View Full Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
