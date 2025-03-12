import { 
  LayoutDashboard, 
  Settings, 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Package, 
  Bell,
  Calendar
} from "lucide-react";
import { FeatureNavigation } from "@/features/shell";

/**
 * Dashboard feature navigation configuration
 */
export const DASHBOARD_NAVIGATION: FeatureNavigation = {
  id: "dashboard",
  name: "Dashboard",
  rootPath: "/dashboard",
  order: 0,
  items: [
    {
      id: "dashboard-overview",
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      order: 0
    },
    {
      id: "dashboard-analytics",
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
      order: 10
    },
    {
      id: "dashboard-orders",
      label: "Orders",
      href: "/dashboard/orders",
      icon: ShoppingCart,
      badge: "12",
      order: 20
    },
    {
      id: "dashboard-inventory",
      label: "Inventory",
      href: "/dashboard/inventory",
      icon: Package,
      order: 30,
      subItems: [
        {
          id: "inventory-products",
          label: "Products",
          href: "/dashboard/inventory/products",
          icon: Package
        },
        {
          id: "inventory-categories",
          label: "Categories",
          href: "/dashboard/inventory/categories",
          icon: Package
        }
      ]
    },
    {
      id: "dashboard-calendar",
      label: "Calendar",
      href: "/dashboard/calendar",
      icon: Calendar,
      order: 40
    },
    {
      id: "dashboard-users",
      label: "Users",
      href: "/dashboard/users",
      icon: Users,
      order: 50
    },
    {
      id: "dashboard-notifications",
      label: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
      badge: "5",
      order: 60
    },
    {
      id: "dashboard-settings",
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      order: 70
    }
  ]
};
