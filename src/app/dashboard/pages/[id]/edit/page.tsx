import { Metadata } from "next";
import { notFound } from "next/navigation";
import { pagesService } from "@/lib/api";
import PageEditorForm from "@/features/pages/components/page-editor-form";
import PageContainer from "@/components/layout/page-container";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditPageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const page = await pagesService.getPage(id);
    return {
      title: `Edit ${page.title} - AKA Store Admin`,
      description: `Edit the ${page.title} page content and settings`,
    };
  } catch {
    return {
      title: "Edit Page - AKA Store Admin",
      description: "Edit page content and settings",
    };
  }
}

export default async function EditPage({ params }: EditPageProps) {
  const { id } = await params;
  
  try {
    const page = await pagesService.getPage(id);
    
    return (
      <PageContainer scrollable={false}>
        <PageEditorForm
          initialData={page}
          pageTitle={`Edit ${page.title}`}
          pageId={id}
        />
      </PageContainer>
    );
  } catch (error) {
    console.error("Error fetching page:", error);
    notFound();
  }
}
