"use client";

import { useState, useEffect } from "react";
import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Product, Category, CreateProductRequest } from "@/types/product";
import { adminCategoryService } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  // Basic Information
  name: z.string().min(2, "Product name must be at least 2 characters."),
  slug: z.string().optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  shortDescription: z.string().optional(),
  sku: z.string().min(1, "SKU is required."),
  barcode: z.string().optional(),

  // Categorization
  categoryIds: z.array(z.number()).min(1, "At least one category is required."),
  primaryCategoryId: z.number().min(1, "Primary category is required."),
  brandId: z.number().optional(),
  tags: z.array(z.string()).optional(),

  // Pricing
  basePrice: z.number().min(0, "Price must be positive."),
  compareAtPrice: z.number().optional(),
  cost: z.number().optional(),

  // Inventory
  quantity: z.number().min(0, "Quantity must be non-negative."),
  trackQuantity: z.boolean().default(true),
  allowBackorder: z.boolean().default(false),
  minQuantity: z.number().min(1, "Minimum quantity must be at least 1."),
  lowStockThreshold: z
    .number()
    .min(0, "Low stock threshold must be non-negative."),

  // Status
  status: z.enum(["active", "inactive", "draft", "archived"]).default("active"),
  visibility: z
    .enum(["catalog", "search", "catalog_search", "not_visible"])
    .default("catalog_search"),
  productType: z
    .enum([
      "simple",
      "configurable",
      "grouped",
      "bundle",
      "virtual",
      "downloadable",
    ])
    .default("simple"),

  // Media
  images: z.array(z.any()).optional(),

  // Marketing
  featured: z.boolean().default(false),
});

export default function ProductForm({
  initialData,
  pageTitle,
  onSubmit,
  isLoading = false,
}: {
  initialData: Product | null;
  pageTitle: string;
  onSubmit: (data: CreateProductRequest) => Promise<void>;
  isLoading?: boolean;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const defaultValues = {
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    shortDescription: initialData?.shortDescription || "",
    sku: initialData?.sku || "",
    barcode: initialData?.barcode || "",
    categoryIds: initialData?.categories?.map((c) => c.id) || [],
    primaryCategoryId: initialData?.primaryCategory?.id || 0,
    brandId: initialData?.brand?.id || undefined,
    tags: initialData?.tags || [],
    basePrice: initialData?.pricing?.basePrice || 0,
    compareAtPrice: initialData?.pricing?.compareAtPrice || undefined,
    cost: initialData?.pricing?.cost || undefined,
    quantity: initialData?.inventory?.quantity || 0,
    trackQuantity: initialData?.inventory?.trackQuantity ?? true,
    allowBackorder: initialData?.inventory?.allowBackorder ?? false,
    minQuantity: initialData?.inventory?.minQuantity || 1,
    lowStockThreshold: initialData?.inventory?.lowStockThreshold || 10,
    status: initialData?.status || "active",
    visibility: initialData?.visibility || "catalog_search",
    productType: initialData?.productType || "simple",
    images: [],
    featured: initialData?.featured ?? false,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues,
  });

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await adminCategoryService.getCategories({
          limit: 1000,
        });
        setCategories(response.categories);

        // If we have initial data with a primary category, find and set it
        if (initialData?.primaryCategory) {
          const matchingCategory = response.categories.find(
            (cat) => cat.id === initialData.primaryCategory?.id
          );
          if (matchingCategory) {
            form.setValue("primaryCategoryId", matchingCategory.id);
          }
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, [initialData, form]);

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    const productData: CreateProductRequest = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      shortDescription: values.shortDescription,
      sku: values.sku,
      barcode: values.barcode,
      categoryIds: values.categoryIds,
      primaryCategoryId: values.primaryCategoryId,
      brandId: values.brandId,
      tags: values.tags,
      pricing: {
        basePrice: values.basePrice,
        compareAtPrice: values.compareAtPrice,
        cost: values.cost,
      },
      inventory: {
        quantity: values.quantity,
        reserved: 0,
        available: values.quantity,
        trackQuantity: values.trackQuantity,
        allowBackorder: values.allowBackorder,
        allowPreorder: false,
        minQuantity: values.minQuantity,
        lowStockThreshold: values.lowStockThreshold,
        stockStatus: values.quantity > 0 ? "in_stock" : "out_of_stock",
      },
      shipping: {
        weightUnit: "kg",
        freeShipping: false,
      },
      featured: values.featured,
      status: values.status,
      visibility: values.visibility,
      productType: values.productType,
    };

    await onSubmit(productData);
  };

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={4}
                        maxSize={4 * 1024 * 1024}
                        // disabled={loading}
                        // progresses={progresses}
                        // pass the onUpload function here for direct upload
                        // onUpload={uploadFiles}
                        // disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU *</FormLabel>
                    <FormControl>
                      <Input placeholder="PRODUCT-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="product-slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Barcode</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="primaryCategoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Category *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString() || ""}
                      disabled={isLoadingCategories}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingCategories
                                ? "Loading categories..."
                                : categories.length === 0
                                  ? "No categories available. Create categories first."
                                  : "Select a category"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {"  ".repeat(category.level)}
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="configurable">
                          Configurable
                        </SelectItem>
                        <SelectItem value="grouped">Grouped</SelectItem>
                        <SelectItem value="bundle">Bundle</SelectItem>
                        <SelectItem value="virtual">Virtual</SelectItem>
                        <SelectItem value="downloadable">
                          Downloadable
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief product description"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="resize-none"
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pricing Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pricing</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="basePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="compareAtPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compare at Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseFloat(e.target.value) || undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              parseFloat(e.target.value) || undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Inventory Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Inventory</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lowStockThreshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Low Stock Threshold</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="10"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Status and Marketing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Status & Marketing</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibility</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="catalog">Catalog Only</SelectItem>
                          <SelectItem value="search">Search Only</SelectItem>
                          <SelectItem value="catalog_search">
                            Catalog & Search
                          </SelectItem>
                          <SelectItem value="not_visible">
                            Not Visible
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
