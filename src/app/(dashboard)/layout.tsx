"use client";

import { usePermissions } from "@/hooks/usePermissions";
import { useSession } from "@/hooks/useSession";
import { Permission, Role } from "@/types/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, Home, Settings, Users, Package, FileText, Bell } from "lucide-react";
import { UserMenu } from "@/components/dashboard/UserMenu";
import { Breadcrumbs } from "@/components/dashboard/Breadcrumbs";
import { Button } from "@/shared/ui/button";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permissions?: Permission[];
  roles?: Role[];
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { 
    label: "Inventory", 
    href: "/dashboard/inventory", 
    icon: Package,
    permissions: ["manage_inventory", "view_products"]
  },
  { 
    label: "Users", 
    href: "/dashboard/users", 
    icon: Users,
    roles: ["ADMIN", "SUPER_ADMIN"]
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

function MenuItem({ item }: { item: MenuItem }) {
  const pathname = usePathname();
  const { canAccess } = usePermissions();
  const isActive = pathname === item.href;

  if (!canAccess({
    permissions: item.permissions,
    roles: item.roles,
    requireAll: false
  })) {
    return null;
  }

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? "bg-blue-50 text-blue-600"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{item.label}</span>
    </Link>
  );
}

function Notifications() {
  const { hasPermission } = usePermissions();
  
  if (!hasPermission("view_reports")) return null;

  return (
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
    </Button>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only call useSession to enforce authentication
  useSession({ required: true });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="font-bold text-xl text-blue-600">
                PharmacyHub
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Notifications />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 bg-white rounded-lg shadow-sm h-fit sticky top-24">
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => (
                <MenuItem key={item.href} item={item} />
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            <Breadcrumbs />
            <div className="bg-white rounded-lg shadow-sm p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}