"use client";

import { ReactNode, Suspense } from "react";
import StorefrontHeader from "@/components/layout/storefront-header";
import StorefrontFooter from "@/components/layout/storefront-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";

interface StorefrontLayoutProps {
  children: ReactNode;
}

// Loading component for better UX
function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="h-8 w-32 bg-muted animate-pulse rounded"></div>
          <div className="hidden md:flex items-center space-x-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-4 w-16 bg-muted animate-pulse rounded"
              ></div>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-8 w-8 bg-muted animate-pulse rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function StorefrontLayout({ children }: StorefrontLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<HeaderSkeleton />}>
        <StorefrontHeader />
      </Suspense>
      <main className="flex-1 w-full px-4">
        <Breadcrumbs />
        {children}
      </main>
      <StorefrontFooter />
    </div>
  );
}
