import { LucideIcon } from "lucide-react";

/**
 * Represents an individual item in the exam sidebar menu
 */
export interface ExamMenuItemType {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  type: 'main' | 'submenu';
  permissions?: string[];
  roles?: string[];
  subItems?: ExamMenuItemType[];
  badge?: string | number;
  color?: string;
}

/**
 * Props for the ExamSidebar component
 */
export interface ExamSidebarProps {
  className?: string;
  items?: ExamMenuItemType[];
  collapsible?: 'offcanvas' | 'icon' | 'none';
  variant?: 'sidebar' | 'floating' | 'inset';
  side?: 'left' | 'right';
}

/**
 * Props for the ExamSidebarMenu component
 */
export interface ExamSidebarMenuProps {
  items: ExamMenuItemType[];
}

/**
 * Props for the ExamSidebarItem component
 */
export interface ExamSidebarItemProps {
  item: ExamMenuItemType;
  depth?: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}
