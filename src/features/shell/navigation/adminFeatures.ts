import { 
  Users, 
  Settings,
  FileText,
  Bell,
  Package,
  BarChart,
  ShoppingCart,
  DollarSign,
  LayoutDashboard
} from "lucide-react";
import { FeatureNavigation } from "./types";

/**
 * Admin feature navigation configuration
 * Provides a comprehensive set of admin navigation items
 */
export const ADMIN_FEATURES: FeatureNavigation[] = [
  {
    id: "admin-dashboard",
    name: "Admin Dashboard",
    rootPath: "/admin",
    roles: ["ADMIN"],
    order: 0,
    items: [
      {
        id: "admin-dashboard",
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        roles: ["ADMIN"],
        order: 0
      }
    ]
  },
  {
    id: "admin-exams",
    name: "Exam Management",
    rootPath: "/admin/exams",
    roles: ["ADMIN"],
    order: 10,
    items: [
      {
        id: "admin-exams",
        label: "Exam Management",
        href: "/admin/exams",
        icon: FileText,
        roles: ["ADMIN"],
        order: 0
      }
    ]
  },
  {
    id: "admin-users",
    name: "User Management",
    rootPath: "/admin/users",
    roles: ["ADMIN"],
    order: 20,
    items: [
      {
        id: "admin-users",
        label: "User Management",
        href: "/admin/users",
        icon: Users,
        roles: ["ADMIN"],
        permissions: ["manage_users"],
        order: 0
      }
    ]
  },
  {
    id: "admin-inventory",
    name: "Inventory",
    rootPath: "/admin/inventory",
    roles: ["ADMIN"],
    order: 30,
    items: [
      {
        id: "admin-inventory",
        label: "Inventory",
        href: "/admin/inventory",
        icon: Package,
        roles: ["ADMIN"],
        order: 0,
        subItems: [
          {
            id: "admin-products",
            label: "Products",
            href: "/admin/inventory/products",
            icon: ShoppingCart,
            roles: ["ADMIN"]
          },
          {
            id: "admin-stock",
            label: "Stock Management",
            href: "/admin/inventory/stock",
            icon: Package,
            roles: ["ADMIN"]
          }
        ]
      }
    ]
  },
  {
    id: "admin-reports",
    name: "Reports",
    rootPath: "/admin/reports",
    roles: ["ADMIN"],
    order: 40,
    items: [
      {
        id: "admin-reports",
        label: "Reports",
        href: "/admin/reports",
        icon: BarChart,
        roles: ["ADMIN"],
        order: 0,
        subItems: [
          {
            id: "admin-sales-reports",
            label: "Sales Reports",
            href: "/admin/reports/sales",
            icon: DollarSign,
            roles: ["ADMIN"]
          },
          {
            id: "admin-user-activity",
            label: "User Activity",
            href: "/admin/reports/activity",
            icon: Users,
            roles: ["ADMIN"]
          }
        ]
      }
    ]
  },
  {
    id: "admin-settings",
    name: "Admin Settings",
    rootPath: "/admin/settings",
    roles: ["ADMIN"],
    order: 50,
    items: [
      {
        id: "admin-settings",
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        roles: ["ADMIN"],
        order: 0
      }
    ]
  },
  {
    id: "admin-notifications",
    name: "Notifications",
    rootPath: "/admin/notifications",
    roles: ["ADMIN"],
    order: 60,
    items: [
      {
        id: "admin-notifications",
        label: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
        roles: ["ADMIN"],
        order: 0
      }
    ]
  }
];

/**
 * Combined admin navigation for admin panel
 */
export const ADMIN_NAVIGATION: FeatureNavigation = {
  id: "admin",
  name: "Administration",
  rootPath: "/admin",
  roles: ["ADMIN"],
  order: 0,
  items: ADMIN_FEATURES.flatMap(feature => feature.items)
};
