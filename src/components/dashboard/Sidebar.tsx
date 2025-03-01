"use client";

import React, { useMemo } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/features/rbac/hooks";
import { Menu, LucideIcon, Home, Settings, Users, Package, FileText, GraduationCap } from "lucide-react";
import { FaPhone, FaTachometerAlt, FaUsers } from "react-icons/fa";
import { Handshake } from "lucide-react";
import { Permission, Role } from "@/features/auth/types";
import ModernMinimalistLogo from "@/shared/ui/logo/ModernMinimalistLogo";
import { useIsMobile } from "@/features/ui/hooks";
import { menuItems } from "@/features/shared/config/menuItems";

// Enhanced MenuItem type to support more flexible permissions and roles
interface EnhancedMenuItem {
  label: string;
  href: string;
  icon: LucideIcon | React.ComponentType<{className?: string}>;
  permissions?: Permission[];
  roles?: Role[];
  subItems?: EnhancedMenuItem[];
  isExternal?: boolean;
}

// Mapping of predefined menu items with enhanced configurations
const enhancedMenuItems: EnhancedMenuItem[] = [
  { 
    label: "Dashboard", 
    href: "/dashboard", 
    icon: FaTachometerAlt,
    roles: ["USER", "ADMIN", "SUPER_ADMIN"]
  },
  { 
    label: "Exam Practice", 
    href: "/exam", 
    icon: GraduationCap,
    roles: ["USER", "STUDENT"]
  },
  { 
    label: "Licensing", 
    href: "/licensing", 
    icon: Handshake,
    subItems: [
      { 
        label: "Pharmacists", 
        href: "/licensing/pharmacist", 
        icon: FaUsers,
        permissions: ["manage_pharmacists"]
      },
      { 
        label: "Pharmacy Managers", 
        href: "/licensing/pharmacy-manager", 
        icon: FaPhone,
        permissions: ["manage_pharmacy_managers"]
      },
      { 
        label: "Proprietors", 
        href: "/licensing/proprietor", 
        icon: Handshake,
        permissions: ["manage_proprietors"]
      },
      { 
        label: "Salesmen", 
        href: "/licensing/salesman", 
        icon: FaPhone,
        permissions: ["manage_salesmen"]
      }
    ]
  },
  { 
    label: "Inventory", 
    href: "/dashboard/inventory", 
    icon: Package,
    permissions: ["manage_inventory", "view_products"]
  },
  { 
    label: "Reports", 
    href: "/dashboard/reports", 
    icon: FileText,
    permissions: ["view_reports"]
  },
  { 
    label: "Settings", 
    href: "/dashboard/settings", 
    icon: Settings,
    roles: ["ADMIN", "SUPER_ADMIN", "MANAGER"]
  },
];

// Recursive NavItem component to handle nested menu items
function NavItem({ 
  item, 
  depth = 0, 
  canAccess, 
  pathname 
}: { 
  item: EnhancedMenuItem, 
  depth?: number, 
  canAccess: (options: {permissions?: Permission[], roles?: Role[], requireAll?: boolean}) => boolean,
  pathname: string | null
}) {
  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
  const Icon = item.icon;

  // Check if the item should be rendered based on permissions/roles
  if (!canAccess({
    permissions: item.permissions,
    roles: item.roles,
    requireAll: false
  })) {
    return null;
  }

  // External link handling
  if (item.isExternal) {
    return (
      <a 
        href={item.href} 
        target="_blank" 
        rel="noopener noreferrer"
        className={cn(
          "flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors w-full",
          isActive
            ? "bg-blue-50 text-blue-600"
            : "text-gray-700 hover:bg-gray-100",
          `pl-${depth * 4}`
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{item.label}</span>
      </a>
    );
  }

  // Render as Link or as an expandable section
  return (
    <div>
      <Link
        href={item.href}
        className={cn(
          "flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors w-full",
          isActive
            ? "bg-blue-50 text-blue-600"
            : "text-gray-700 hover:bg-gray-100",
          `pl-${depth * 4}`
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{item.label}</span>
      </Link>
      
      {/* Render sub-items if they exist */}
      {item.subItems && (
        <div className="pl-4">
          {item.subItems.map((subItem) => (
            <NavItem 
              key={subItem.href} 
              item={subItem} 
              depth={depth + 1} 
              canAccess={canAccess}
              pathname={pathname}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NavItems() {
  const pathname = usePathname();
  const { canAccess } = usePermissions();

  // Memoized menu items to prevent unnecessary re-renders
  const filteredMenuItems = useMemo(() => {
    return enhancedMenuItems.filter(item => 
      canAccess({
        permissions: item.permissions,
        roles: item.roles,
        requireAll: false
      })
    );
  }, [canAccess]);

  return (
    <nav className="space-y-1">
      {filteredMenuItems.map((item) => (
        <NavItem 
          key={item.href} 
          item={item} 
          canAccess={canAccess}
          pathname={pathname}
        />
      ))}
    </nav>
  );
}

export function Sidebar() {
  const isMobile = useIsMobile();

  // On desktop: render full sidebar without logo
  if (!isMobile) {
    return (
      <aside className="w-64 bg-white rounded-lg shadow-sm h-fit sticky top-24 overflow-y-auto max-h-[calc(100vh-6rem)]">
        <div className="p-4">
          <NavItems />
        </div>
      </aside>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="default" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px] overflow-y-auto">
        <SheetHeader className="px-1">
          <SheetTitle>
            <ModernMinimalistLogo />
          </SheetTitle>
        </SheetHeader>
        <div className="mt-8 px-1">
          <NavItems />
        </div>
      </SheetContent>
    </Sheet>
  );
}