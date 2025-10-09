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
    title: "Users",
    url: "/dashboard/users",
    icon: "users",
    shortcut: ["u", "u"],
    isActive: false,
    items: [],
  },
  {
    title: "Orders",
    url: "/dashboard/orders",
    icon: "package",
    shortcut: ["o", "o"],
    isActive: false,
    items: [],
  },
  {
    title: "Discounts",
    url: "/dashboard/discounts",
    icon: "percent",
    shortcut: ["d", "i"],
    isActive: false,
    items: [],
  },
  {
    title: "Courses",
    url: "/dashboard/courses",
    icon: "media",
    shortcut: ["c", "o"],
    isActive: false,
    items: [],
  },
  {
    title: "Pages",
    url: "/dashboard/pages",
    icon: "page",
    shortcut: ["p", "a"],
    isActive: false,
    items: [],
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: "settings",
    shortcut: ["s", "s"],
    isActive: false,
    items: [
      {
        title: "Site Settings",
        url: "/dashboard/settings",
        shortcut: ["s", "i"],
      },
      {
        title: "Mega Menu",
        url: "/dashboard/mega-menu",
        shortcut: ["s", "m"],
      },
    ],
  },
];
