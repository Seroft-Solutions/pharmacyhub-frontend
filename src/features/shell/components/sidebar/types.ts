import { LucideIcon } from "lucide-react";

/**
 * Represents an individual item in the application sidebar menu
 */
export interface NavItemType {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  permissions?: string[];
  roles?: string[];
  badge?: string | number;
  subItems?: NavItemType[];
}

/**
 * Props for the AppSidebar component
 */
export interface AppSidebarProps {
  className?: string;
  items?: NavItemType[];
  collapsible?: 'offcanvas' | 'icon' | 'none';
  variant?: 'sidebar' | 'floating' | 'inset';
  side?: 'left' | 'right';
}

/**
 * Props for the SidebarMenu component
 */
export interface SidebarMenuProps {
  items: NavItemType[];
}
