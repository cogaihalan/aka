"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import StorefrontLayout from "@/components/layout/storefront-layout";

interface ConditionalLayoutProps {
  children: ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Check if the current route is a dashboard route
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // If it's a dashboard route, render children without storefront layout
  if (isDashboardRoute) {
    return <>{children}</>;
  }

  // For all other routes, use the storefront layout
  return <StorefrontLayout>{children}</StorefrontLayout>;
}
