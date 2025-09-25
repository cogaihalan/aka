import { NavItem } from "@/types";

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard/overview",
    icon: "dashboard",
    isActive: false,
    shortcut: ["d", "d"],
    items: [],
  },
  {
    title: "Products",
    url: "/dashboard/product",
    icon: "product",
    shortcut: ["p", "p"],
    isActive: false,
    items: [],
  },
  {
    title: "Categories",
    url: "/dashboard/categories",
    icon: "folder",
    shortcut: ["c", "c"],
    isActive: false,
    items: [],
  },
  {
    title: "Kanban",
    url: "/dashboard/kanban",
    icon: "kanban",
    shortcut: ["k", "k"],
    isActive: false,
    items: [],
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: "users",
    shortcut: ["u", "u"],
    isActive: false,
    items: [],
  },
];

// Storefront navigation items
export const storefrontNavItems = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Categories", href: "/categories" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

