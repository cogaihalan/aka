import { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  animation?: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scaleIn";
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

export function AnimatedContainer({
  children,
  className,
  animation = "fadeIn",
  delay = 0,
  duration = 500,
  threshold = 0.1,
  triggerOnce = true,
}: AnimatedContainerProps) {
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold,
    triggerOnce,
  });

  const getAnimationClasses = () => {
    const baseClasses = "transition-all ease-out";
    
    switch (animation) {
      case "fadeIn":
        return cn(
          baseClasses,
          hasIntersected ? "opacity-100" : "opacity-0"
        );
      case "slideUp":
        return cn(
          baseClasses,
          hasIntersected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        );
      case "slideLeft":
        return cn(
          baseClasses,
          hasIntersected ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        );
      case "slideRight":
        return cn(
          baseClasses,
          hasIntersected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
        );
      case "scaleIn":
        return cn(
          baseClasses,
          hasIntersected ? "opacity-100 scale-100" : "opacity-0 scale-95"
        );
      default:
        return baseClasses;
    }
  };

  return (
    <div
      ref={ref}     
      className={cn(getAnimationClasses(), className)}
      style={{
        transitionDelay: hasIntersected ? `${delay}ms` : "0ms",
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}