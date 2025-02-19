"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { useMemo } from "react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  inventory: "Inventory",
  users: "Users",
  reports: "Reports",
  settings: "Settings",
  profile: "Profile",
  "manage-users": "Manage Users",
  "manage-inventory": "Manage Inventory",
  analytics: "Analytics",
  "system-settings": "System Settings",
};

export function Breadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Remove trailing slash and split path
    const pathParts = pathname.replace(/\/$/, "").split("/").filter(Boolean);
    
    // Generate breadcrumb items
    const items: BreadcrumbItem[] = [];
    let currentPath = "";

    pathParts.forEach((part) => {
      currentPath += `/${part}`;
      items.push({
        label: routeLabels[part] || part.replace(/-/g, " "),
        href: currentPath,
      });
    });

    return items;
  }, [pathname]);

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center text-sm">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/dashboard"
            className="text-gray-500 hover:text-blue-600 transition-colors flex items-center"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-900 font-medium">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}