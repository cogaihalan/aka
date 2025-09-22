"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { adminCategoryService } from "@/lib/api";
import type {
  CategoryWithProducts,
  Product,
} from "@/lib/api/types";
import { toast } from "sonner";
import { Plus, Search, Package, X, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CategoryProductsProps {
  category: CategoryWithProducts;
  onBack?: () => void;
}

export function CategoryProducts({ category, onBack }: CategoryProductsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [uncategorizedProducts, setUncategorizedProducts] = useState<Product[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  // Filter products based on search term
  const filteredProducts = category.products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProduct = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleRemoveProducts = async () => {
    if (selectedProducts.length === 0) return;

    try {
      setIsLoading(true);
      await adminCategoryService.removeProductsFromCategory(
        category.id,
        selectedProducts
      );
      toast.success(
        `${selectedProducts.length} products removed from category`
      );
      setSelectedProducts([]);
      // Refresh the page or update the data
      window.location.reload();
    } catch (error) {
      console.error("Error removing products:", error);
      toast.error("Failed to remove products from category");
    } finally {
      setIsLoading(false);
    }
  };

  const loadUncategorizedProducts = async () => {
    try {
      setIsLoading(true);
      const result = await adminCategoryService.getUncategorizedProducts();
      setUncategorizedProducts(result.products);
    } catch (error) {
      console.error("Error loading uncategorized products:", error);
      toast.error("Failed to load uncategorized products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProducts = async (productIds: number[]) => {
    try {
      setIsLoading(true);
      await adminCategoryService.assignProductsToCategory(
        category.id,
        productIds
      );
      toast.success(`${productIds.length} products added to category`);
      setIsAddDialogOpen(false);
      // Refresh the page or update the data
      window.location.reload();
    } catch (error) {
      console.error("Error adding products:", error);
      toast.error("Failed to add products to category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          <div>
            <h1 className="text-2xl font-bold">{category.name}</h1>
            <p className="text-muted-foreground">
              Manage products in this category ({category.totalProducts}{" "}
              products)
            </p>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={loadUncategorizedProducts}>
              <Plus className="mr-2 h-4 w-4" />
              Add Products
            </Button>
          </DialogTrigger>
          <AddProductsDialog
            products={uncategorizedProducts}
            onAdd={handleAddProducts}
            isLoading={isLoading}
          />
        </Dialog>
      </div>

      {/* Search and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              {selectedProducts.length > 0 && (
                <Badge variant="secondary">
                  {selectedProducts.length} selected
                </Badge>
              )}
            </div>
            {selectedProducts.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveProducts}
                disabled={isLoading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Selected
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Products Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        filteredProducts.length > 0 &&
                        selectedProducts.length === filteredProducts.length
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={(checked) =>
                          handleSelectProduct(product.id, checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {product.images?.[0] && (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm">{product.sku}</code>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ${product.price.toFixed(2)}
                      </div>
                      {product.compareAtPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          ${product.compareAtPrice.toFixed(2)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === "active" ? "default" : "secondary"
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/products/${product.id}`}>
                          <Package className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">No products found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms."
                  : "Add some products to this category."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface AddProductsDialogProps {
  products: Product[];
  onAdd: (productIds: number[]) => void;
  isLoading: boolean;
}

function AddProductsDialog({
  products,
  onAdd,
  isLoading,
}: AddProductsDialogProps) {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProduct = (productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleAdd = () => {
    onAdd(selectedProducts);
    setSelectedProducts([]);
    setSearchTerm("");
  };

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle>Add Products to Category</DialogTitle>
        <DialogDescription>
          Select products to add to this category
        </DialogDescription>
      </DialogHeader>

      <div className="flex-1 overflow-hidden flex flex-col space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products List */}
        <div className="flex-1 overflow-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      filteredProducts.length > 0 &&
                      selectedProducts.length === filteredProducts.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) =>
                        handleSelectProduct(product.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {product.images?.[0] && (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm">{product.sku}</code>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      ${product.price.toFixed(2)}
                    </div>
                    {product.compareAtPrice && (
                      <div className="text-sm text-muted-foreground line-through">
                        ${product.compareAtPrice.toFixed(2)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "active" ? "default" : "secondary"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => {
            setSelectedProducts([]);
            setSearchTerm("");
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          disabled={selectedProducts.length === 0 || isLoading}
        >
          {isLoading ? "Adding..." : `Add ${selectedProducts.length} Products`}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
