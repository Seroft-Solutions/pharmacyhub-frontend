import { 
  FileText, 
  Medal, 
  BookOpen, 
  GraduationCap,
  Home,
  FileQuestion,
  Settings,
  Users,
  FilePieChart, // Changed from FileChart to FilePieChart
  Bell,
  BookMarked
} from "lucide-react";
import { NavItemType } from "./types";

/**
 * Default navigation items for the application sidebar
 */
export const DEFAULT_SIDEBAR_ITEMS: NavItemType[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["USER", "ADMIN", "STUDENT"],
  },
  {
    id: "exams",
    label: "Exams",
    href: "/exam/dashboard",
    icon: GraduationCap,
    roles: ["USER", "STUDENT"],
    subItems: [
      {
        id: "past-papers",
        label: "Past Papers",
        href: "/exam/past-papers",
        icon: FileText,
        permissions: ["view_past_papers"],
      },
      {
        id: "model-papers",
        label: "Model Papers",
        href: "/exam/model-papers",
        icon: Medal,
        permissions: ["view_model_papers"],
      },
      {
        id: "subject-papers",
        label: "Subject Papers",
        href: "/exam/subject-papers",
        icon: BookOpen,
        permissions: ["view_subject_papers"],
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
            icon: BookMarked,
            permissions: ["view_practice_exams"],
          }
        ]
      }
    ]
  },
  {
    id: "progress",
    label: "Progress Tracking",
    href: "/progress",
    icon: FilePieChart, // Changed from FileChart to FilePieChart
    roles: ["USER", "STUDENT"],
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["USER", "ADMIN", "STUDENT"],
  },
  {
    id: "admin",
    label: "Administration",
    href: "/admin",
    icon: Users,
    roles: ["ADMIN"],
    subItems: [
      {
        id: "user-management",
        label: "User Management",
        href: "/admin/users",
        icon: Users,
        permissions: ["manage_users"],
      },
      {
        id: "notifications",
        label: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
        permissions: ["manage_notifications"],
      }
    ]
  }
];
