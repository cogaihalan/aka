"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/logo";

const menuData = {
  Products: {
    categories: [
      {
        title: "Electronics",
        items: [
          "Smartphones",
          "Laptops",
          "Headphones",
          "Cameras",
          "Smart Watches",
        ],
      },
      {
        title: "Fashion",
        items: [
          "Men’s Clothing",
          "Women’s Clothing",
          "Shoes",
          "Accessories",
          "Jewelry",
        ],
      },
      {
        title: "Home & Garden",
        items: ["Furniture", "Decor", "Kitchen", "Garden Tools", "Lighting"],
      },
    ],
  },
  Services: {
    categories: [
      {
        title: "Support",
        items: [
          "Customer Service",
          "Technical Support",
          "Installation",
          "Warranty",
          "Returns",
        ],
      },
      {
        title: "Business",
        items: [
          "Enterprise Solutions",
          "Bulk Orders",
          "Custom Services",
          "Consulting",
        ],
      },
    ],
  },
  Company: {
    categories: [
      {
        title: "About Us",
        items: ["Our Story", "Team", "Careers", "Press", "Awards"],
      },
      {
        title: "Resources",
        items: ["Blog", "Help Center", "Documentation", "Community", "Events"],
      },
    ],
  },
};

export function MegaMenu() {
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

  return (
    <nav className="relative border-b border-border">
      <div className="max-w-7xl mx-auto px-0 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-8">
              {Object.keys(menuData).map((menu) => (
                <div
                  key={menu}
                  className="relative"
                  onMouseEnter={() => handleMenuEnter(menu)}
                  onMouseLeave={handleMenuLeave}
                >
                  <button
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1 relative",
                      activeMenu === menu
                        ? "text-primary bg-muted shadow-sm scale-105"
                        : "text-foreground hover:text-primary hover:bg-muted hover:scale-105"
                    )}
                  >
                    {menu}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        activeMenu === menu ? "rotate-180" : ""
                      )}
                    />
                  </button>

                  {activeMenu === menu && (
                    <div
                      className="absolute top-full left-0 w-max max-w-xl z-50"
                      onMouseEnter={handleDropdownEnter}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div className="h-2 w-full" />
                      <div className="bg-popover border border-border rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95 duration-200 backdrop-blur-sm">
                        <div className="p-4">
                          <div className="grid grid-cols-3 gap-6">
                            {menuData[
                              menu as keyof typeof menuData
                            ].categories.map((category, idx) => (
                              <div key={idx} className="space-y-3">
                                <h3 className="font-semibold text-primary text-sm uppercase tracking-wide">
                                  {category.title}
                                </h3>
                                <ul className="space-y-2">
                                  {category.items.map((item, itemIdx) => (
                                    <li key={itemIdx}>
                                      <a
                                        href="#"
                                        className="text-sm text-muted-foreground hover:text-primary transition-all duration-150 block py-2 rounded-md hover:translate-x-1"
                                      >
                                        {item}
                                      </a>
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
                      {Object.keys(menuData).map((menu) => (
                        <div key={menu} className="space-y-1">
                          <button
                            onClick={() => toggleMobileMenu(menu)}
                            className={cn(
                              "w-full flex items-center justify-between p-3 rounded-lg text-left font-medium transition-colors duration-200",
                              activeMobileMenu === menu
                                ? "text-primary-foreground"
                                : "text-foreground hover:text-primary-foreground"
                            )}
                          >
                            {menu}
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                activeMobileMenu === menu ? "rotate-180" : ""
                              )}
                            />
                          </button>

                          {activeMobileMenu === menu && (
                            <div className="pl-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
                              {menuData[
                                menu as keyof typeof menuData
                              ].categories.map((category, idx) => (
                                <div key={idx} className="space-y-2">
                                  <h4 className="font-semibold text-primary text-sm uppercase tracking-wide">
                                    {category.title}
                                  </h4>
                                  <ul className="space-y-1 pl-2">
                                    {category.items.map((item, itemIdx) => (
                                      <li key={itemIdx}>
                                        <a
                                          href="#"
                                          className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150 block py-1"
                                        >
                                          {item}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
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
