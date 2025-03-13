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
import { FeatureNavigation } from "../Models/navigationTypes";

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
    items: [
      {
        id: "help-center",
        label: "Help Center",
        href: "/help",
        icon: HelpCircle,
        order: 0
      }
    ]
  },
  {
    id: "settings",
    name: "Settings",
    rootPath: "/settings",
    order: 100,
    items: [
      {
        id: "settings",
        label: "Settings",
        href: "/settings",
        icon: Settings,
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
      id: "exams",
      label: "Exams",
      href: "/exam/dashboard",
      icon: GraduationCap,
      order: 0,
      subItems: [
        {
          id: "past-papers",
          label: "Past Papers",
          href: "/exam/past-papers",
          icon: FileText,
          permissions: ["view_past_papers"]
        },
        {
          id: "model-papers",
          label: "Model Papers",
          href: "/exam/model-papers",
          icon: Medal,
          permissions: ["view_model_papers"]
        },
        {
          id: "subject-papers",
          label: "Subject Papers",
          href: "/exam/subject-papers",
          icon: BookOpen,
          permissions: ["view_subject_papers"]
        },
        {
          id: "practice-exams",
          label: "Practice Exams",
          href: "/exam/practice",
          icon: FileQuestion,
          permissions: ["view_practice_exams"],
          badge: "New",
          subItems: [
            {
              id: "timed-exams", 
              label: "Timed Exams",
              href: "/exam/practice/timed",
              icon: Clock,
              permissions: ["view_practice_exams"]
            },
            {
              id: "topic-exams",
              label: "Topic Based",
              href: "/exam/practice/topics",
              icon: BookMarked,
              permissions: ["view_practice_exams"]
            }
          ]
        }
      ]
    }
  ]
};

/**
 * Progress tracking feature navigation configuration
 */
export const PROGRESS_FEATURE: FeatureNavigation = {
  id: "progress",
  name: "Progress",
  rootPath: "/progress",
  order: 20,
  items: [
    {
      id: "progress-tracking",
      label: "Progress Tracking",
      href: "/progress",
      icon: FilePieChart,
      order: 0
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
  roles: ["ADMIN"],
  order: 80,
  items: [
    {
      id: "admin",
      label: "Administration",
      href: "/admin",
      icon: Users,
      roles: ["ADMIN"],
      order: 0,
      subItems: [
        {
          id: "user-management",
          label: "User Management",
          href: "/admin/users",
          icon: Users,
          permissions: ["manage_users"]
        },
        {
          id: "exam-management",
          label: "Exam Management",
          href: "/admin/exams",
          icon: FileText,
          permissions: ["manage_exams"]
        },
        {
          id: "notifications",
          label: "Notifications",
          href: "/admin/notifications",
          icon: Bell,
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
  EXAMS_FEATURE,
  PROGRESS_FEATURE,
  ADMIN_FEATURE
];

// Export admin features
export * from './adminFeatures';
