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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Product } from "@/constants/mock-api";
import { Category } from "@/lib/api/types";
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
  image: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  categoryIds: z.array(z.number()).optional(),
  price: z.number(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

export default function ProductFormWithCategories({
  initialData,
  pageTitle,
}: {
  initialData: Product | null;
  pageTitle: string;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const defaultValues = {
    name: initialData?.name || "",
    categoryIds: initialData?.category ? [1] : [], // Default to first category for now
    price: initialData?.price || 0,
    description: initialData?.description || "",
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

        // If we have initial data with a category, find and select it
        if (initialData?.category) {
          const matchingCategory = response.categories.find(
            (cat) => cat.name === initialData.category
          );
          if (matchingCategory) {
            setSelectedCategories([matchingCategory]);
            form.setValue("categoryIds", [matchingCategory.id]);
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

  const handleCategorySelect = (categoryId: number) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (category && !selectedCategories.find((cat) => cat.id === categoryId)) {
      const newSelected = [...selectedCategories, category];
      setSelectedCategories(newSelected);
      form.setValue(
        "categoryIds",
        newSelected.map((cat) => cat.id)
      );
    }
  };

  const handleCategoryRemove = (categoryId: number) => {
    const newSelected = selectedCategories.filter(
      (cat) => cat.id !== categoryId
    );
    setSelectedCategories(newSelected);
    form.setValue(
      "categoryIds",
      newSelected.map((cat) => cat.id)
    );
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Form submission logic would be implemented here
    console.log("Form values:", values);
    console.log("Selected categories:", selectedCategories);
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={field.value}
                      onChange={field.onChange}
                      onRemove={() => field.onChange(undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter price"
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
            </div>

            <FormField
              control={form.control}
              name="categoryIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {/* Category Selection */}
                      <Select
                        onValueChange={(value) =>
                          handleCategorySelect(parseInt(value))
                        }
                        disabled={isLoadingCategories}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingCategories
                                ? "Loading categories..."
                                : categories.length === 0
                                  ? "No categories available. Create categories first."
                                  : "Select a category to add"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {categories
                            .filter(
                              (cat) =>
                                !selectedCategories.find(
                                  (selected) => selected.id === cat.id
                                )
                            )
                            .map((category) => (
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

                      {/* Selected Categories Display */}
                      {selectedCategories.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            Selected Categories:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedCategories.map((category) => (
                              <Badge
                                key={category.id}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {category.name}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCategoryRemove(category.id)
                                  }
                                  className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit">Save Product</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
