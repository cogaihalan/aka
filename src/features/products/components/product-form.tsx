"use client";

import { useState, useEffect } from "react";
import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Product,
  Category,
  Brand,
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types/product";
import { adminCategoryService, adminProductService } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Plus, Trash2, Upload, X } from "lucide-react";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Enhanced form schema with all product fields
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
  specialPrice: z.number().optional(),
  specialPriceFrom: z.string().optional(),
  specialPriceTo: z.string().optional(),
  currency: z.string().default("USD"),

  // Inventory
  quantity: z.number().min(0, "Quantity must be non-negative."),
  trackQuantity: z.boolean().default(true),
  allowBackorder: z.boolean().default(false),
  allowPreorder: z.boolean().default(false),
  minQuantity: z.number().min(1, "Minimum quantity must be at least 1."),
  maxQuantity: z.number().optional(),
  lowStockThreshold: z
    .number()
    .min(0, "Low stock threshold must be non-negative."),

  // Shipping
  weight: z.number().optional(),
  weightUnit: z.enum(["kg", "lb", "g", "oz"]).default("kg"),
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  dimensionUnit: z.enum(["cm", "in", "mm"]).default("cm"),
  shippingClass: z.string().optional(),
  freeShipping: z.boolean().default(false),
  shippingCost: z.number().optional(),

  // SEO
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).optional(),
  canonicalUrl: z.string().optional(),

  // Marketing
  featured: z.boolean().default(false),
  newFrom: z.string().optional(),
  newTo: z.string().optional(),

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

  // Variants
  variants: z
    .array(
      z.object({
        name: z.string(),
        sku: z.string(),
        price: z.number(),
        compareAtPrice: z.number().optional(),
        cost: z.number().optional(),
        weight: z.number().optional(),
        attributes: z.record(z.string()),
        quantity: z.number().min(0),
        isDefault: z.boolean().default(false),
      })
    )
    .optional(),

  // Attributes
  attributes: z
    .array(
      z.object({
        attributeCode: z.string(),
        value: z.string(),
      })
    )
    .optional(),

  // Custom Attributes
  customAttributes: z.record(z.any()).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ProductFormProps {
  initialData?: Product | null;
  pageTitle: string;
  productId: string;
  isLoading?: boolean;
}

export default function ProductForm({
  initialData,
  pageTitle,
  productId,
  isLoading = false,
}: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const defaultValues: FormData = {
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
    specialPrice: initialData?.pricing?.specialPrice || undefined,
    specialPriceFrom: initialData?.pricing?.specialPriceFrom || "",
    specialPriceTo: initialData?.pricing?.specialPriceTo || "",
    currency: initialData?.pricing?.currency || "USD",
    quantity: initialData?.inventory?.quantity || 0,
    trackQuantity: initialData?.inventory?.trackQuantity ?? true,
    allowBackorder: initialData?.inventory?.allowBackorder ?? false,
    allowPreorder: initialData?.inventory?.allowPreorder ?? false,
    minQuantity: initialData?.inventory?.minQuantity || 1,
    maxQuantity: initialData?.inventory?.maxQuantity || undefined,
    lowStockThreshold: initialData?.inventory?.lowStockThreshold || 10,
    weight: initialData?.shipping?.weight || undefined,
    weightUnit: initialData?.shipping?.weightUnit || "kg",
    length: initialData?.shipping?.dimensions?.length || undefined,
    width: initialData?.shipping?.dimensions?.width || undefined,
    height: initialData?.shipping?.dimensions?.height || undefined,
    dimensionUnit: initialData?.shipping?.dimensions?.unit || "cm",
    shippingClass: initialData?.shipping?.shippingClass || "",
    freeShipping: initialData?.shipping?.freeShipping ?? false,
    shippingCost: initialData?.shipping?.shippingCost || undefined,
    seoTitle: initialData?.seo?.title || "",
    seoDescription: initialData?.seo?.description || "",
    seoKeywords: initialData?.seo?.keywords || [],
    canonicalUrl: initialData?.seo?.canonicalUrl || "",
    featured: initialData?.featured ?? false,
    newFrom: initialData?.newFrom || "",
    newTo: initialData?.newTo || "",
    status: initialData?.status || "active",
    visibility: initialData?.visibility || "catalog_search",
    productType: initialData?.productType || "simple",
    images: [],
    variants: [],
    attributes: [],
    customAttributes: {},
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  // Load categories and brands
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);

        // Load categories
        const categoriesResponse = await adminCategoryService.getCategories({
          limit: 1000,
        });
        const categories = Array.isArray(categoriesResponse) ? categoriesResponse : categoriesResponse.categories;
        setCategories(categories);

        // Load brands (you'll need to implement this service)
        // const brandsResponse = await adminBrandService.getBrands();
        // setBrands(brandsResponse.brands);

        // Set initial tags
        if (initialData?.tags) {
          setSelectedTags(initialData.tags);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [initialData]);

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      const updatedTags = [...selectedTags, newTag.trim()];
      setSelectedTags(updatedTags);
      form.setValue("tags", updatedTags);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(updatedTags);
    form.setValue("tags", updatedTags);
  };

  const handleFormSubmit = async (values: FormData) => {
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
        specialPrice: values.specialPrice,
        specialPriceFrom: values.specialPriceFrom,
        specialPriceTo: values.specialPriceTo,
      },
      inventory: {
        quantity: values.quantity,
        reserved: 0,
        available: values.quantity,
        trackQuantity: values.trackQuantity,
        allowBackorder: values.allowBackorder,
        allowPreorder: values.allowPreorder,
        minQuantity: values.minQuantity,
        maxQuantity: values.maxQuantity,
        lowStockThreshold: values.lowStockThreshold,
        stockStatus: values.quantity > 0 ? "in_stock" : "out_of_stock",
      },
      shipping: {
        weight: values.weight,
        weightUnit: values.weightUnit,
        dimensions:
          values.length && values.width && values.height
            ? {
                length: values.length,
                width: values.width,
                height: values.height,
                unit: values.dimensionUnit,
              }
            : undefined,
        shippingClass: values.shippingClass,
        freeShipping: values.freeShipping,
        shippingCost: values.shippingCost,
      },
      seo: {
        title: values.seoTitle,
        description: values.seoDescription,
        keywords: values.seoKeywords,
        canonicalUrl: values.canonicalUrl,
      },
      featured: values.featured,
      newFrom: values.newFrom,
      newTo: values.newTo,
      status: values.status,
      visibility: values.visibility,
      productType: values.productType,
      attributes: values.attributes?.map((attr) => ({
        attributeId: 0, // This would be set based on the attribute code
        attributeCode: attr.attributeCode,
        value: attr.value,
      })),
      customAttributes: values.customAttributes,
    };

    try {
      if (productId === "new") {
        await adminProductService.createProduct(productData);
        // Handle success (redirect, show toast, etc.)
        console.log("Product created successfully");
      } else {
        const updateData: UpdateProductRequest = {
          ...productData,
          id: Number(productId),
          version: initialData?.version || 1,
        };
        await adminProductService.updateProduct(Number(productId), updateData);
        // Handle success (redirect, show toast, etc.)
        console.log("Product updated successfully");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      // Handle error (show toast, etc.)
    }
  };

  if (isLoadingData) {
    return <div>Loading...</div>;
  }

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
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="variants">Variants</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6">
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
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="product-slug" {...field} />
                        </FormControl>
                        <FormDescription>
                          URL-friendly version of the name
                        </FormDescription>
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
                          placeholder="Detailed product description"
                          className="resize-none"
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="categoryIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categories *</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              const categoryId = parseInt(value);
                              const currentIds = field.value || [];
                              if (!currentIds.includes(categoryId)) {
                                field.onChange([...currentIds, categoryId]);
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select categories" />
                            </SelectTrigger>
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
                        </FormControl>
                        <FormDescription>
                          Selected: {field.value?.length || 0} categories
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primaryCategoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Category *</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                            value={field.value?.toString() || ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select primary category" />
                            </SelectTrigger>
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="brandId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          value={field.value?.toString() || ""}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent>
                            {brands.map((brand) => (
                              <SelectItem
                                key={brand.id}
                                value={brand.id.toString()}
                              >
                                {brand.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags */}
                <div className="space-y-2">
                  <FormLabel>Tags</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddTag())
                      }
                    />
                    <Button type="button" onClick={handleAddTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Product Type and Status */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="productType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
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
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="catalog">
                                Catalog Only
                              </SelectItem>
                              <SelectItem value="search">
                                Search Only
                              </SelectItem>
                              <SelectItem value="catalog_search">
                                Catalog & Search
                              </SelectItem>
                              <SelectItem value="not_visible">
                                Not Visible
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Marketing Options */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Featured Product
                          </FormLabel>
                          <FormDescription>
                            Display this product prominently on the homepage
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Pricing Tab */}
              <TabsContent value="pricing" className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                        <FormDescription>
                          Original price to show as crossed out
                        </FormDescription>
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
                        <FormDescription>
                          Internal cost for profit calculation
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Price</FormLabel>
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
                        <FormDescription>
                          Sale price for promotional periods
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="specialPriceFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Price From</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specialPriceTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Price To</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Inventory Tab */}
              <TabsContent value="inventory" className="space-y-6">
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

                  <FormField
                    control={form.control}
                    name="maxQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="100"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                parseInt(e.target.value) || undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="trackQuantity"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Track Quantity
                          </FormLabel>
                          <FormDescription>
                            Monitor inventory levels for this product
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allowBackorder"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Allow Backorder
                          </FormLabel>
                          <FormDescription>
                            Allow customers to purchase when out of stock
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allowPreorder"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Allow Preorder
                          </FormLabel>
                          <FormDescription>
                            Allow customers to purchase before release
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Shipping Tab */}
              <TabsContent value="shipping" className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight</FormLabel>
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
                    name="weightUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight Unit</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">Kilograms (kg)</SelectItem>
                              <SelectItem value="lb">Pounds (lb)</SelectItem>
                              <SelectItem value="g">Grams (g)</SelectItem>
                              <SelectItem value="oz">Ounces (oz)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length</FormLabel>
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
                    name="width"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Width</FormLabel>
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
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height</FormLabel>
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
                    name="dimensionUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dimension Unit</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cm">
                                Centimeters (cm)
                              </SelectItem>
                              <SelectItem value="in">Inches (in)</SelectItem>
                              <SelectItem value="mm">
                                Millimeters (mm)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="freeShipping"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Free Shipping
                          </FormLabel>
                          <FormDescription>
                            This product qualifies for free shipping
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* SEO Tab */}
              <TabsContent value="seo" className="space-y-6">
                <FormField
                  control={form.control}
                  name="seoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Title</FormLabel>
                      <FormControl>
                        <Input placeholder="SEO optimized title" {...field} />
                      </FormControl>
                      <FormDescription>
                        Title for search engines (leave empty to use product
                        name)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seoDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="SEO optimized description"
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Description for search engines (leave empty to use
                        product description)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="canonicalUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canonical URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="/products/product-slug"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Preferred URL for this product
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Variants Tab */}
              <TabsContent value="variants" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Product Variants</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      appendVariant({
                        name: "",
                        sku: "",
                        price: 0,
                        attributes: {},
                        quantity: 0,
                        isDefault: false,
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variant
                  </Button>
                </div>

                {variantFields.map((field, index) => (
                  <Card key={field.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Variant {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`variants.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Variant Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Red, Large"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`variants.${index}.sku`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SKU</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="PRODUCT-001-RED-L"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`variants.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
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
                        name={`variants.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
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
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>

            <Separator />

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
