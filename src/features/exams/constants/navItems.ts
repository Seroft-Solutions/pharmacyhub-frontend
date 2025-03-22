import { 
  FileText, 
  Medal, 
  BookOpen, 
  GraduationCap,
  FileQuestion,
  BookMarked
} from "lucide-react";
import { NavItemType } from "@/features/shell";

/**
 * Navigation items specific to the Exams feature
 */
export const EXAM_NAV_ITEMS: NavItemType[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: GraduationCap,
    roles: ["USER", "STUDENT"],
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
      }
    ]
  }
];
