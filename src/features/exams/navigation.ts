import { 
  GraduationCap, 
  FileText, 
  Medal, 
  BookOpen, 
  FileQuestion,
  BookMarked,
  ClipboardCheck,
  BarChart3,
  Clock,
  Layers,
  Upload,
  Settings,
  ListIcon,
  FileUp
} from "lucide-react";
import { FeatureNavigation } from "@/features/shell";

/**
 * Exams feature navigation configuration
 */
export const EXAMS_NAVIGATION: FeatureNavigation = {
  id: "exams",
  name: "Exam Preparation",
  rootPath: "/exam",
  order: 10,
  items: [
    {
      id: "admin-exams",
      label: "Admin: Exams",
      href: "/admin/exams",
      icon: Settings,
      roles: ["ADMIN", "INSTRUCTOR"],
      order: -10,
      subItems: [
        {
          id: "manage-papers",
          label: "Paper Management",
          href: "/admin/exams/manage",
          icon: ListIcon,
          roles: ["ADMIN", "INSTRUCTOR"]
        }
      ]
    },
    {
      id: "exam-dashboard",
      label: "Exam Dashboard",
      href: "/exam/dashboard",
      icon: GraduationCap,
      order: 0
    },
    {
      id: "past-papers",
      label: "Past Papers",
      href: "/exam/past-papers",
      icon: FileText,
      permissions: ["view_past_papers"],
      order: 10
    },
    {
      id: "model-papers",
      label: "Model Papers",
      href: "/exam/model-papers",
      icon: Medal,
      permissions: ["view_model_papers"],
      order: 20
    },
    {
      id: "subject-papers",
      label: "Subject Papers",
      href: "/exam/subject-papers",
      icon: BookOpen,
      permissions: ["view_subject_papers"],
      order: 30
    },
    {
      id: "practice-exams",
      label: "Practice Exams",
      href: "/exam/practice",
      icon: FileQuestion,
      permissions: ["view_practice_exams"],
      badge: "New",
      order: 40,
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
    },
    {
      id: "exam-results",
      label: "My Results",
      href: "/exam/results",
      icon: ClipboardCheck,
      order: 50
    },
    {
      id: "exam-progress",
      label: "Progress Stats",
      href: "/exam/progress",
      icon: BarChart3,
      order: 60
    },
    {
      id: "summary",
      label: "Overview",
      href: "/summary",
      icon: Layers,
      order: 70
    }
  ]
};