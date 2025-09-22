import { Product } from "@/lib/api";
import { MOCK_PRODUCTS } from "@/constants/mock-products";

export interface ProductDetailService {
  getProductById(id: number): Promise<Product | null>;
  getRelatedProducts(productId: number, limit?: number): Promise<Product[]>;
}

class MockProductDetailService implements ProductDetailService {
  async getProductById(id: number): Promise<Product | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!product) return null;

    // Convert MockProduct to Product type
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      sku: product.sku,
      category: product.category,
      brand: product.brand,
      tags: product.tags,
      images: product.images,
      variants: product.variants,
      inventory: product.inventory,
      seo: product.seo,
      status: product.status,
      featured: product.featured,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async getRelatedProducts(
    productId: number,
    limit: number = 4
  ): Promise<Product[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 150));

    const currentProduct = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!currentProduct) return [];

    // Get products from the same category, excluding current product
    const relatedProducts = MOCK_PRODUCTS.filter(
      (p) =>
        p.id !== productId &&
        p.category.id === currentProduct.category.id &&
        p.status === "active"
    ).slice(0, limit);

    // If not enough products in same category, fill with featured products
    if (relatedProducts.length < limit) {
      const featuredProducts = MOCK_PRODUCTS.filter(
        (p) =>
          p.id !== productId &&
          p.featured &&
          p.status === "active" &&
          !relatedProducts.some((rp) => rp.id === p.id)
      ).slice(0, limit - relatedProducts.length);

      relatedProducts.push(...featuredProducts);
    }

    // Convert to Product type
    return relatedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      sku: product.sku,
      category: product.category,
      brand: product.brand,
      tags: product.tags,
      images: product.images,
      variants: product.variants,
      inventory: product.inventory,
      seo: product.seo,
      status: product.status,
      featured: product.featured,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));
  }
}

export const productDetailService = new MockProductDetailService();
