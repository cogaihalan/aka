"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CustomPage, EditorJSOutput } from "@/types/page";
import { pagesService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorJSEditor } from "@/components/editor/editorjs-editor";
import { PageRenderer } from "@/components/pages/page-renderer";
import { Save, Eye, ArrowLeft } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  status: z.enum(["published", "draft"]).default("draft"),
  isHomepage: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface PageEditorFormProps {
  initialData?: CustomPage;
  pageTitle: string;
  pageId?: string;
  isLoading?: boolean;
}

export default function PageEditorForm({
  initialData,
  pageTitle,
  pageId,
  isLoading = false,
}: PageEditorFormProps) {
  const [content, setContent] = useState<EditorJSOutput | undefined>(initialData?.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      keywords: initialData?.keywords?.join(", ") || "",
      status: initialData?.status || "draft",
      isHomepage: initialData?.isHomepage || false,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSaving(true);
      
      const pageData = {
        ...data,
        keywords: data.keywords ? data.keywords.split(",").map(k => k.trim()).filter(Boolean) : [],
        content: content || {
          time: Date.now(),
          blocks: [],
          version: "2.28.2"
        },
      };

      if (pageId) {
        await pagesService.updatePage(pageId, { ...pageData, id: pageId });
        toast.success("Page updated successfully");
        router.push("/dashboard/pages");
      } else {
        const newPage = await pagesService.createPage(pageData);
        toast.success("Page created successfully");
        router.push(`/dashboard/pages/${newPage.id}/edit`);
      }
    } catch (error) {
      toast.error("Failed to save page");
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (newContent: EditorJSOutput) => {
    setContent(newContent);
  };

  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{pageTitle}</h1>
            <p className="text-muted-foreground">
              {pageId ? "Edit your page content" : "Create a new page"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handlePreview}
            className="flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>{isPreviewMode ? "Edit" : "Preview"}</span>
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSaving || isLoading}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : "Save"}</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Content</CardTitle>
            </CardHeader>
            <CardContent>
              {isPreviewMode && content ? (
                <div className="min-h-[400px] p-4 border rounded-lg">
                  <PageRenderer 
                    page={{
                      id: pageId || "preview",
                      title: form.getValues("title"),
                      slug: form.getValues("slug"),
                      content: content,
                      metaTitle: form.getValues("metaTitle"),
                      metaDescription: form.getValues("metaDescription"),
                      keywords: form.getValues("keywords") ? form.getValues("keywords")!.split(",").map(k => k.trim()).filter(Boolean) : [],
                      status: form.getValues("status"),
                      isHomepage: form.getValues("isHomepage"),
                      parentId: undefined,
                      sortOrder: 0,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      authorId: "preview",
                      authorName: "Preview User"
                    }}
                    showMeta={false}
                  />
                </div>
              ) : (
                <EditorJSEditor
                  data={content}
                  onChange={handleContentChange}
                  placeholder="Start writing your page content..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="metaTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Title</FormLabel>
                    <FormControl>
                      <Input placeholder="SEO title for search engines" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="SEO description for search engines" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl>
                      <Input placeholder="keyword1, keyword2, keyword3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter page title" {...field} />
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
                    <FormLabel>URL Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="page-url-slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value === "published"}
                        onCheckedChange={(checked) => field.onChange(checked ? "published" : "draft")}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Published</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
                <FormField
                  control={form.control}
                  name="isHomepage"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Set as Homepage</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
