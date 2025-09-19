"use client";

import { cn } from "@/lib/utils";

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fadeIn" | "slideUp" | "scaleIn" | "none";
  delay?: number;
}

export function AnimatedContainer({
  children,
  className,
  animation = "fadeIn",
  delay = 0,
}: AnimatedContainerProps) {
  const animationClasses = {
    fadeIn: "animate-fade-in",
    slideUp: "animate-slide-up",
    scaleIn: "animate-scale-in",
    none: "",
  };

  return (
    <div
      className={cn(
        animationClasses[animation],
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface AnimatedGridProps {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
}

export function AnimatedGrid({
  children,
  className,
  stagger = true,
}: AnimatedGridProps) {
  return (
    <div
      className={cn(
        "transition-all duration-300 ease-out",
        stagger && "animate-stagger-children",
        className
      )}
    >
      {children}
    </div>
  );
}

interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export function AnimatedList({ 
  children, 
  className,
  loading = false 
}: AnimatedListProps) {
  return (
    <div
      className={cn(
        "transition-opacity duration-200 ease-out",
        loading ? "opacity-50" : "opacity-100",
        className
      )}
    >
      {children}
    </div>
  );
}

// Loading state component
interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

export function LoadingOverlay({ 
  isLoading, 
  children, 
  className 
}: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}
