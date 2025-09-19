"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, X, Truck, CreditCard, Shield } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

interface CartSummaryProps {
  className?: string;
  showPromoCode?: boolean;
  showShippingInfo?: boolean;
  showSecurityBadges?: boolean;
  onCheckout?: () => void;
  onContinueShopping?: () => void;
}

export function CartSummary({
  className,
  showPromoCode = true,
  showShippingInfo = true,
  showSecurityBadges = true,
  onCheckout,
  onContinueShopping,
}: CartSummaryProps) {
  const {
    items,
    getSubtotal,
    getShipping,
    getTax,
    getTotal,
    getTotalItems,
    clearCart,
  } = useCartStore();

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal();
  const itemCount = getTotalItems();

  const handleApplyPromo = () => {
    // Mock promo code logic - replace with real implementation
    const validPromoCodes: Record<string, number> = {
      SAVE10: 0.1,
      WELCOME: 0.15,
      FREESHIP: 0,
    };

    if (promoCode.toUpperCase() in validPromoCodes) {
      const discount = validPromoCodes[promoCode.toUpperCase()];
      setAppliedPromo(promoCode.toUpperCase());
      setPromoDiscount(discount);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    setPromoCode("");
  };

  const finalTotal =
    appliedPromo === "FREESHIP"
      ? total - shipping
      : total * (1 - promoDiscount);

  if (items.length === 0) {
    return (
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Your cart is empty</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("sticky top-4", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Order Summary
          <Badge variant="secondary">
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Order Details */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {shipping > 0 ? (
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
          ) : (
            <div className="flex justify-between text-sm text-green-600">
              <span className="flex items-center gap-1">
                <Truck className="w-4 h-4" />
                Free Shipping
              </span>
              <span>Free</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          {appliedPromo && (
            <div className="flex justify-between text-sm text-green-600">
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4" />
                Promo ({appliedPromo})
              </span>
              <span>
                -$
                {appliedPromo === "FREESHIP"
                  ? shipping.toFixed(2)
                  : (subtotal * promoDiscount).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>

        {/* Promo Code Section */}
        {showPromoCode && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Promo Code</label>
            {appliedPromo ? (
              <div className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-md">
                <span className="text-sm text-green-700">{appliedPromo}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemovePromo}
                  className="h-6 w-6 p-0 text-green-700 hover:text-green-800"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={handleApplyPromo}
                  disabled={!promoCode.trim()}
                >
                  Apply
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            className="w-full"
            size="lg"
            onClick={onCheckout}
            disabled={items.length === 0}
          >
            Proceed to Checkout
          </Button>

          {onContinueShopping && (
            <Button
              variant="outline"
              className="w-full"
              onClick={onContinueShopping}
            >
              Continue Shopping
            </Button>
          )}
        </div>

        {/* Shipping Information */}
        {showShippingInfo && (
          <div className="pt-4 border-t">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>
                  {shipping > 0
                    ? `Free shipping on orders over $50`
                    : "Free shipping applied"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        )}

        {/* Security Badges */}
        {showSecurityBadges && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CreditCard className="w-3 h-3" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>SSL Encrypted</span>
              </div>
            </div>
          </div>
        )}

        {/* Clear Cart Button (for development/testing) */}
        {process.env.NODE_ENV === "development" && (
          <div className="pt-4 border-t">
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => clearCart()}
            >
              Clear Cart (Dev Only)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
