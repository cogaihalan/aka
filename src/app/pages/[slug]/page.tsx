import { Metadata } from "next";
import { notFound } from "next/navigation";
import { pagesService } from "@/lib/api";
import { PageRenderer } from "@/components/pages/page-renderer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const page = await pagesService.getPageBySlug(slug);
    return {
      title: page.metaTitle || page.title,
      description: page.metaDescription || `Read ${page.title} on AKA Store`,
      keywords: page.keywords,
    };
  } catch {
    return {
      title: "Page Not Found - AKA Store",
      description: "The requested page could not be found",
    };
  }
}

export default async function CustomPage({ params }: PageProps) {
  const { slug } = await params;
  
  try {
    const page = await pagesService.getPageBySlug(slug);
    
    if (page.status !== "published") {
      notFound();
    }

    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <PageRenderer page={page} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching page:", error);
    notFound();
  }
}
