"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart, Trash2 } from "lucide-react";

const wishlistItems = [
  { id: 1, name: "Premium Product 1", price: 99.99, rating: 4.5, image: "" },
  { id: 2, name: "Premium Product 2", price: 149.99, rating: 4.8, image: "" },
  { id: 3, name: "Premium Product 3", price: 79.99, rating: 4.2, image: "" },
];

export default function WishlistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Wishlist</h1>
        <p className="text-muted-foreground">Your saved items and favorites</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-6">
            Save items you love to your wishlist
          </p>
          <Button>Start Shopping</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="group">
              <div className="aspect-square bg-muted rounded-t-lg relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.floor(item.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">${item.price}</span>
                  <Button size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
