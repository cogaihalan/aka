import { Product } from "@/lib/api";

interface ProductDetailService {
  getProductById(id: number): Promise<Product | null>;
  getRelatedProducts(productId: number, limit?: number): Promise<Product[]>;
}

class ProductDetailService implements ProductDetailService {
  async getProductById(id: number): Promise<Product | null> {
    // TODO: Implement API call to get product by ID
    throw new Error("API implementation needed");
  }

  async getRelatedProducts(
    productId: number,
    limit: number = 4
  ): Promise<Product[]> {
    // TODO: Implement API call to get related products
    throw new Error("API implementation needed");
  }
}

export const productDetailService = new ProductDetailService();
