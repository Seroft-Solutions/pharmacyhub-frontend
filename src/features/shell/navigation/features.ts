import { 
  Home, 
  GraduationCap, 
  FileText, 
  Medal, 
  BookOpen,
  FileQuestion,
  Settings,
  Users,
  FilePieChart,
  Bell,
  Clock,
  BookMarked,
  LayoutDashboard,
  HelpCircle
} from "lucide-react";
import type { FeatureNavigation } from "../types/navigationTypes";

/**
 * Core features navigation configuration
 */
export const CORE_FEATURES: FeatureNavigation[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    rootPath: "/dashboard",
    order: 0,
    items: [
      {
        id: "dashboard-home",
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        order: 0
      }
    ]
  },
  {
    id: "help",
    name: "Help & Support",
    rootPath: "/help",
    order: 90,
    // Help center should only be available to logged in users
    permissions: ["view_help_center"],
    items: [
      {
        id: "help-center",
        label: "Help Center",
        href: "/help",
        icon: HelpCircle,
        permissions: ["view_help_center"],
        order: 0
      }
    ]
  },
  {
    id: "settings",
    name: "Settings",
    rootPath: "/settings",
    order: 100,
    // Settings should only be available to logged in users
    permissions: ["view_settings"],
    items: [
      {
        id: "settings",
        label: "Settings",
        href: "/settings",
        icon: Settings,
        permissions: ["view_settings"],
        order: 0
      }
    ]
  }
];

/**
 * Exams feature navigation configuration
 */
export const EXAMS_FEATURE: FeatureNavigation = {
  id: "exams",
  name: "Exam Preparation",
  rootPath: "/exam",
  order: 10,
  items: [
    {
      id: "past-papers",
      label: "Past Papers",
      href: "/exam/past-papers",
      icon: FileText,
      permissions: [],
      order: 10
    },
    {
      id: "model-papers",
      label: "Model Papers",
      href: "/exam/model-papers",
      icon: Medal,
      permissions: [],
      order: 20
    },
    {
      id: "subject-papers",
      label: "Subject Papers",
      href: "/exam/subject-papers",
      icon: BookOpen,
      permissions: [],
      order: 30
    }
  ]
};

/**
 * Admin feature navigation configuration
 */
export const ADMIN_FEATURE: FeatureNavigation = {
  id: "admin",
  name: "Administration",
  rootPath: "/admin",
  // Restrict to ADMIN role only
  roles: ["ADMIN", "SUPER_ADMIN"],
  order: 80,
  items: [
    {
      id: "admin",
      label: "Administration",
      href: "/admin",
      icon: Users,
      roles: ["ADMIN", "SUPER_ADMIN"],
      order: 0,
      subItems: [
        {
          id: "user-management",
          label: "User Management",
          href: "/admin/users",
          icon: Users,
          roles: ["ADMIN", "SUPER_ADMIN"],
          permissions: ["manage_users"]
        },
        {
          id: "exam-management",
          label: "Exam Management",
          href: "/admin/exams",
          icon: FileText,
          roles: ["ADMIN", "SUPER_ADMIN"],
          permissions: ["manage_exams"]
        },
        {
          id: "notifications",
          label: "Notifications",
          href: "/admin/notifications",
          icon: Bell,
          roles: ["ADMIN", "SUPER_ADMIN"],
          permissions: ["manage_notifications"]
        }
      ]
    }
  ]
};

/**
 * Default features for the application
 */
export const DEFAULT_FEATURES: FeatureNavigation[] = [
  ...CORE_FEATURES,
  ADMIN_FEATURE,
  {
    id: "exam-preparation",
    name: "Exam Preparation",
    rootPath: "/exam",
    order: 10,
    items: [
      {
        id: "past-papers",
        label: "Past Papers",
        href: "/exam/past-papers",
        icon: FileText,
        permissions: [],
        order: 10
      },
      {
        id: "model-papers",
        label: "Model Papers",
        href: "/exam/model-papers",
        icon: Medal,
        permissions: [],
        order: 20
      },
      {
        id: "subject-papers",
        label: "Subject Papers",
        href: "/exam/subject-papers",
        icon: BookOpen,
        permissions: [],
        order: 30
      }
    ]
  }
];

// Export admin features
export * from './adminFeatures';