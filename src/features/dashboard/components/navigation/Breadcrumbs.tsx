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
  // Exam routes
  exam: "Exams",
  "past-papers": "Past Papers",
  "model-papers": "Model Papers",
  "subject-papers": "Subject Papers",
  practice: "Practice Exams",
  // Payment routes
  payments: "Payments",
  manual: "Manual Payment",
  pending: "Pending Payments",
  history: "Payment History",
  success: "Payment Success",
  cancel: "Payment Cancelled",
};

export function Breadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Remove trailing slash and split path
    const pathParts = pathname.replace(/\/$/, "").split("/").filter(Boolean);
    
    // Generate breadcrumb items
    const items: BreadcrumbItem[] = [];
    let currentPath = "";

    // Special case handling for parameterized routes
    const isNumeric = (str: string): boolean => /^\d+$/.test(str);
    const isManualPaymentRoute = pathname.includes('/payments/manual/');
    const isPendingPaymentRoute = pathname.includes('/payments/pending');

    pathParts.forEach((part, index) => {
      // Skip numeric IDs for specific routes but maintain the path
      const isIdParameter = isNumeric(part) && (
        // Known routes with ID parameters
        (pathParts[index - 1] === "manual") || 
        (pathParts[index - 1] === "exam") ||
        (pathParts[index - 1] === "paper")
      );
      
      currentPath += `/${part}`;
      
      // Skip adding breadcrumb item for numeric IDs
      if (!isIdParameter) {
        items.push({
          label: routeLabels[part] || part.replace(/-/g, " "),
          href: currentPath,
        });
      }
    });

    // Special case: add the manual payment breadcrumb if we're on that route but skipped the ID
    if (isManualPaymentRoute && !items.some(item => item.label === "Manual Payment")) {
      // Find the payments breadcrumb index
      const paymentsIndex = items.findIndex(item => item.label === "Payments");
      if (paymentsIndex !== -1) {
        // Insert manual payment after payments
        items.splice(paymentsIndex + 1, 0, {
          label: "Manual Payment",
          href: pathname, // Use current path
        });
      }
    }

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