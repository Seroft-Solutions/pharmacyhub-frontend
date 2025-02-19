import { LucideIcon } from "lucide-react";
import { Permission, Role } from "./auth";

export interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permissions?: Permission[];
  roles?: Role[];
  category?: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}