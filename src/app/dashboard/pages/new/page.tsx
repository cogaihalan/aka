import { Metadata } from "next";
import PageEditorForm from "@/features/pages/components/page-editor-form";
import PageContainer from "@/components/layout/page-container";

export const metadata: Metadata = {
  title: "Create New Page - AKA Store Admin",
  description: "Create a new custom page for your store",
};

export default function NewPage() {
  return (
    <PageContainer scrollable={false}>
      <PageEditorForm
        pageTitle="Create New Page"
      />
    </PageContainer>
  );
}
