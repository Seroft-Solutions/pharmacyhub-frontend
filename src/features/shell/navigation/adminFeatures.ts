import { 
  FileText,
  DollarSign,
  LayoutDashboard,
  CreditCard
} from "lucide-react";
import type { FeatureNavigation } from "../types/navigationTypes";

/**
 * Admin feature navigation configuration
 * Provides a comprehensive set of admin navigation items
 */
export const ADMIN_FEATURES: FeatureNavigation[] = [
  {
    id: "admin-dashboard",
    name: "Admin Dashboard",
    rootPath: "/admin/dashboard",
    roles: ["ADMIN", "SUPER_ADMIN"],
    order: 0,
    items: [
      {
        id: "admin-dashboard",
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
        roles: ["ADMIN", "SUPER_ADMIN"],
        order: 0
      }
    ]
  },
  {
    id: "admin-exams",
    name: "Exam Management",
    rootPath: "/admin/exams",
    roles: ["ADMIN", "SUPER_ADMIN"],
    order: 10,
    items: [
      {
        id: "admin-exams",
        label: "Exam Management",
        href: "/admin/exams",
        icon: FileText,
        roles: ["ADMIN", "SUPER_ADMIN"],
        order: 0
      }
    ]
  },
  {
    id: "admin-payments",
    name: "Payment Approvals",
    rootPath: "/admin/payments",
    roles: ["ADMIN", "SUPER_ADMIN"],
    order: 20,
    items: [
      {
        id: "admin-payments",
        label: "Payment Approvals",
        href: "/admin/payments/approvals",
        icon: CreditCard,
        roles: ["ADMIN", "SUPER_ADMIN"],
        permissions: ["MANAGE_PAYMENTS"],
        order: 0,
        badge: "New"
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
  rootPath: "/admin/dashboard",
  roles: ["ADMIN", "SUPER_ADMIN"],
  order: 0,
  items: ADMIN_FEATURES.flatMap(feature => feature.items)
};