import { apiClient } from "@/lib/api/client-mock";
import type {
  Cart,
  Product,
} from "@/lib/api/types";

export class StorefrontCartService {
  private basePath = "/storefront/cart";

  // Get current cart
  async getCart(): Promise<Cart> {
    const response = await apiClient.get<Cart>(this.basePath);
    return response.data!;
  }

  // Add item to cart
  async addItem(data: {
    productId: number;
    variantId?: number;
    quantity: number;
  }): Promise<Cart> {
    const response = await apiClient.post<Cart>(`${this.basePath}/items`, data);
    return response.data!;
  }

  // Update cart item quantity
  async updateItemQuantity(itemId: string, quantity: number): Promise<Cart> {
    const response = await apiClient.patch<Cart>(
      `${this.basePath}/items/${itemId}`,
      { quantity }
    );
    return response.data!;
  }

  // Remove item from cart
  async removeItem(itemId: string): Promise<Cart> {
    const response = await apiClient.delete<Cart>(
      `${this.basePath}/items/${itemId}`
    );
    return response.data!;
  }

  // Clear entire cart
  async clearCart(): Promise<Cart> {
    const response = await apiClient.delete<Cart>(this.basePath);
    return response.data!;
  }

  // Get cart count
  async getCartCount(): Promise<number> {
    const response = await apiClient.get<{ count: number }>(
      `${this.basePath}/count`
    );
    return response.data!.count;
  }

  // Apply coupon code
  async applyCoupon(code: string): Promise<{
    success: boolean;
    message: string;
    discount?: number;
  }> {
    const response = await apiClient.post(`${this.basePath}/coupons`, { code });
    return response.data!;
  }

  // Remove coupon code
  async removeCoupon(code: string): Promise<Cart> {
    const response = await apiClient.delete<Cart>(
      `${this.basePath}/coupons/${code}`
    );
    return response.data!;
  }

  // Get available coupons
  async getAvailableCoupons(): Promise<
    Array<{
      code: string;
      description: string;
      discount: number;
      type: "percentage" | "fixed";
      minimumAmount?: number;
      expiresAt?: string;
    }>
  > {
    const response = await apiClient.get(`${this.basePath}/coupons/available`);
    return response.data!;
  }

  // Update shipping address
  async updateShippingAddress(address: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  }): Promise<Cart> {
    const response = await apiClient.patch<Cart>(
      `${this.basePath}/shipping-address`,
      address
    );
    return response.data!;
  }

  // Update billing address
  async updateBillingAddress(address: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  }): Promise<Cart> {
    const response = await apiClient.patch<Cart>(
      `${this.basePath}/billing-address`,
      address
    );
    return response.data!;
  }

  // Get shipping options
  async getShippingOptions(): Promise<
    Array<{
      id: string;
      name: string;
      description: string;
      cost: number;
      estimatedDays: string;
      carrier?: string;
    }>
  > {
    const response = await apiClient.get(`${this.basePath}/shipping-options`);
    return response.data!;
  }

  // Update shipping method
  async updateShippingMethod(shippingMethodId: string): Promise<Cart> {
    const response = await apiClient.patch<Cart>(
      `${this.basePath}/shipping-method`,
      { shippingMethodId }
    );
    return response.data!;
  }

  // Get payment methods
  async getPaymentMethods(): Promise<
    Array<{
      id: string;
      name: string;
      description: string;
      icon?: string;
      isDefault: boolean;
    }>
  > {
    const response = await apiClient.get(`${this.basePath}/payment-methods`);
    return response.data!;
  }

  // Update payment method
  async updatePaymentMethod(paymentMethodId: string): Promise<Cart> {
    const response = await apiClient.patch<Cart>(
      `${this.basePath}/payment-method`,
      { paymentMethodId }
    );
    return response.data!;
  }

  // Calculate shipping
  async calculateShipping(address: {
    country: string;
    state: string;
    postalCode: string;
  }): Promise<
    Array<{
      method: string;
      cost: number;
      estimatedDays: string;
    }>
  > {
    const response = await apiClient.post(
      `${this.basePath}/calculate-shipping`,
      address
    );
    return response.data!;
  }

  // Calculate taxes
  async calculateTaxes(): Promise<{
    tax: number;
    breakdown: Array<{
      name: string;
      rate: number;
      amount: number;
    }>;
  }> {
    const response = await apiClient.post(`${this.basePath}/calculate-taxes`);
    return response.data!;
  }

  // Get cart summary
  async getCartSummary(): Promise<{
    itemCount: number;
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
    currency: string;
  }> {
    const response = await apiClient.get(`${this.basePath}/summary`);
    return response.data!;
  }

  // Validate cart
  async validateCart(): Promise<{
    valid: boolean;
    errors: Array<{
      type: string;
      message: string;
      itemId?: string;
    }>;
    warnings: Array<{
      type: string;
      message: string;
      itemId?: string;
    }>;
  }> {
    const response = await apiClient.post(`${this.basePath}/validate`);
    return response.data!;
  }

  // Save cart for later
  async saveForLater(): Promise<{ savedCartId: string }> {
    const response = await apiClient.post(`${this.basePath}/save`);
    return response.data!;
  }

  // Restore saved cart
  async restoreSavedCart(savedCartId: string): Promise<Cart> {
    const response = await apiClient.post<Cart>(`${this.basePath}/restore`, {
      savedCartId,
    });
    return response.data!;
  }

  // Get saved carts
  async getSavedCarts(): Promise<
    Array<{
      id: string;
      name: string;
      itemCount: number;
      total: number;
      savedAt: string;
    }>
  > {
    const response = await apiClient.get(`${this.basePath}/saved`);
    return response.data!;
  }

  // Merge carts (when user logs in)
  async mergeCarts(guestCartId?: string): Promise<Cart> {
    const response = await apiClient.post<Cart>(`${this.basePath}/merge`, {
      guestCartId,
    });
    return response.data!;
  }

  // Cart abandonment tracking
  async trackAbandonment(): Promise<void> {
    await apiClient.post(`${this.basePath}/track-abandonment`);
  }

  // Get cart recommendations
  async getCartRecommendations(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
      `${this.basePath}/recommendations`
    );
    return response.data!;
  }

  // Bulk operations
  async bulkAddItems(
    items: Array<{
      productId: number;
      variantId?: number;
      quantity: number;
    }>
  ): Promise<Cart> {
    const response = await apiClient.post<Cart>(`${this.basePath}/items/bulk`, {
      items,
    });
    return response.data!;
  }

  async bulkUpdateItems(
    updates: Array<{
      itemId: string;
      quantity: number;
    }>
  ): Promise<Cart> {
    const response = await apiClient.patch<Cart>(
      `${this.basePath}/items/bulk`,
      { updates }
    );
    return response.data!;
  }

  // Cart sharing
  async shareCart(): Promise<{ shareUrl: string; expiresAt: string }> {
    const response = await apiClient.post(`${this.basePath}/share`);
    return response.data!;
  }

  async getSharedCart(shareToken: string): Promise<Cart> {
    const response = await apiClient.get<Cart>(
      `${this.basePath}/shared/${shareToken}`
    );
    return response.data!;
  }

  // Cart notes
  async addCartNote(note: string): Promise<Cart> {
    const response = await apiClient.patch<Cart>(`${this.basePath}/note`, {
      note,
    });
    return response.data!;
  }

  async removeCartNote(): Promise<Cart> {
    const response = await apiClient.delete<Cart>(`${this.basePath}/note`);
    return response.data!;
  }

  // Cart expiration
  async extendCartExpiration(): Promise<Cart> {
    const response = await apiClient.patch<Cart>(`${this.basePath}/extend`);
    return response.data!;
  }

  // Get cart analytics
  async getCartAnalytics(): Promise<{
    viewCount: number;
    addToCartCount: number;
    removeFromCartCount: number;
    lastActivity: string;
  }> {
    const response = await apiClient.get(`${this.basePath}/analytics`);
    return response.data!;
  }
}

// Export singleton instance
export const storefrontCartService = new StorefrontCartService();
