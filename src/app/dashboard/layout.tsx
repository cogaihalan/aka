import KBar from "@/components/kbar";
import AppSidebar from "@/components/layout/app-sidebar";
import Header from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardAccess } from "@/components/auth/role-guard";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "AKA Ecom Admin Dashboard",
  description: "AKA Ecom Admin Dashboard with Next.js and Shadcn",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  let defaultOpen = false;

  // Only read cookies in non-static contexts
  if (
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PHASE !== "phase-production-build"
  ) {
    try {
      const cookieStore = await cookies();
      defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
    } catch (error) {
      console.warn("Failed to read sidebar cookie:", error);
    }
  }
  return (
    <DashboardAccess
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground">
              You need admin privileges to access the dashboard.
            </p>
          </div>
        </div>
      }
    >
      <KBar>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <Header />
            {/* page main content */}
            {children}
            {/* page main content ends */}
          </SidebarInset>
        </SidebarProvider>
      </KBar>
    </DashboardAccess>
  );
}
