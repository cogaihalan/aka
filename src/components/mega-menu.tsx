"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/logo";
import {
  useMegaMenu,
  useAppLoading,
} from "@/components/providers/app-provider";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export function MegaMenu() {
  const { isLoading, error } = useAppLoading();
  const { megaMenuData } = useMegaMenu();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState<string | null>(
    "Company"
  );
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
        setActiveMobileMenu(null);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMenuEnter = (menu: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setActiveMenu(menu);
  };

  const handleMenuLeave = () => {
    const timeout = setTimeout(() => {
      setActiveMenu(null);
    }, 100); // Small delay to allow moving to dropdown
    setHoverTimeout(timeout);
  };

  const handleDropdownEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleDropdownLeave = () => {
    setActiveMenu(null);
  };

  const toggleMobileMenu = (menu: string) => {
    setActiveMobileMenu(activeMobileMenu === menu ? null : menu);
  };

  // Loading state
  if (error || isLoading || !megaMenuData) {
    return <MegaMenuSkeleton />;
  }

  return (
    <nav className="relative border-b border-border">
      <div className="max-w-7xl mx-auto px-0 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-8">
              {megaMenuData?.items.map(({ id, title, href, categories }) => (
                <div
                  key={id}
                  className="relative"
                  onMouseEnter={() => handleMenuEnter(id)}
                  onMouseLeave={handleMenuLeave}
                >
                  <button
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1 relative",
                      activeMenu === id
                        ? "text-primary bg-muted shadow-sm scale-105"
                        : "text-foreground hover:text-primary hover:bg-muted hover:scale-105"
                    )}
                  >
                    <Link onClick={() => handleMenuLeave()} href={href}>
                      {title}
                    </Link>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        activeMenu === id ? "rotate-180" : ""
                      )}
                    />
                  </button>

                  {activeMenu === id && (
                    <div
                      className="absolute top-full left-0 w-max max-w-xl z-50"
                      onMouseEnter={handleDropdownEnter}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div className="h-2 w-full" />
                      <div className="bg-popover border border-border rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95 duration-200 backdrop-blur-sm">
                        <div className="p-4">
                          <div className="grid grid-cols-3 gap-6">
                            {categories.map((category) => (
                              <div key={category.id} className="space-y-3">
                                <h3 className="font-semibold text-primary text-sm uppercase tracking-wide">
                                  {category.title}
                                </h3>
                                <ul className="space-y-2">
                                  {category.items.map((item) => (
                                    <li key={item.id}>
                                      <Link
                                        href={item.href}
                                        className="text-sm text-muted-foreground hover:text-primary transition-all duration-150 block py-2 rounded-md hover:translate-x-1"
                                      >
                                        {item.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="px-4">
                    <Logo />
                  </div>

                  {/* Mobile Menu Content */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4 space-y-2">
                      {megaMenuData?.items.map(
                        ({ id, title, href, categories }) => (
                          <div key={id} className="space-y-1">
                            <button
                              onClick={() => toggleMobileMenu(id)}
                              className={cn(
                                "w-full flex items-center justify-between p-3 rounded-lg text-left font-medium transition-colors duration-200",
                                activeMobileMenu === id
                                  ? "text-primary"
                                  : "text-foreground hover:text-primary"
                              )}
                            >
                              <Link
                                onClick={() => handleMenuLeave()}
                                href={href}
                              >
                                {title}
                              </Link>
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 transition-transform duration-200",
                                  activeMobileMenu === id ? "rotate-180" : ""
                                )}
                              />
                            </button>

                            {activeMobileMenu === id && (
                              <div className="pl-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
                                {categories.map((category) => (
                                  <div key={category.id} className="space-y-2">
                                    <h4 className="font-semibold text-primary text-sm uppercase tracking-wide">
                                      {category.title}
                                    </h4>
                                    <ul className="space-y-1 pl-2">
                                      {category.items.map((item) => (
                                        <li key={item.id}>
                                          <Link
                                            href={item.href}
                                            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150 block py-1"
                                          >
                                            {item.label}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

function MegaMenuSkeleton() {
  return (
    <nav className="relative border-b border-border">
      <div className="max-w-7xl mx-auto px-0 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Menu Skeleton */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-4" />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile menu button skeleton */}
          <div className="md:hidden">
            <Skeleton className="h-10 w-10" />
          </div>
        </div>
      </div>
    </nav>
  );
}
