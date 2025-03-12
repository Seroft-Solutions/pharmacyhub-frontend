"use client";

import React, { useMemo, useState } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  Medal, 
  BookOpen, 
  GraduationCap,
  ChevronDown,
  ChevronRight 
} from "lucide-react";
import { usePermissions } from "@/features/rbac/hooks";

// Define exam menu items with icons and permissions
const examMenuItems = [
  {
    label: "Exams Preparation",
    href: "/exam/dashboard",
    icon: GraduationCap,
    type: 'main',
    roles: ['USER', 'STUDENT'],
    subItems: [
      {
        label: "Past Papers",
        href: "/exam/past-papers",
        icon: FileText,
        type: 'submenu',
        permissions: ['view_past_papers']
      },
      {
        label: "Model Papers",
        href: "/exam/model-papers",
        icon: Medal,
        type: 'submenu', 
        permissions: ['view_model_papers']
      },
      {
        label: "Subject Papers",
        href: "/exam/subject-papers",
        icon: BookOpen,
        type: 'submenu',
        permissions: ['view_subject_papers']
      }
    ]
  }
];

export function SimpleExamsSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { hasAccess } = usePermissions();
  const [openMainItem, setOpenMainItem] = useState<number | null>(0); // Default first item open

  // Memoize menu items with access filtering
  const filteredMenuItems = useMemo(() => {
    return examMenuItems.filter(item => 
      hasAccess({
        permissions: item.permissions,
        roles: item.roles,
        requireAll: false
      })
    );
  }, [hasAccess]);

  return (
    <aside className="w-64 bg-white rounded-lg shadow-sm h-fit sticky top-24 overflow-y-auto max-h-[calc(100vh-6rem)]">
      <div className="p-4">
        <div className="font-semibold text-sm mb-4 px-2 text-gray-500 uppercase tracking-wider">
          Exams
        </div>
        <div className="space-y-1">
          {filteredMenuItems.map((item, index) => (
            <div key={item.href} className="mb-2">
              {/* Main Item */}
              <div
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer",
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => {
                  if (item.subItems && item.subItems.length > 0) {
                    setOpenMainItem(openMainItem === index ? null : index);
                  }
                  
                  if (item.type === 'main') {
                    router.push(item.href);
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.subItems && item.subItems.length > 0 && (
                  openMainItem === index 
                    ? <ChevronDown className="h-4 w-4" /> 
                    : <ChevronRight className="h-4 w-4" />
                )}
              </div>

              {/* Sub Items */}
              {item.subItems && openMainItem === index && (
                <div className="pl-6 mt-1 space-y-1 ml-2">
                  {item.subItems.map((subItem) => (
                    <div
                      key={subItem.href}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md text-sm cursor-pointer",
                        pathname === subItem.href
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => router.push(subItem.href)}
                    >
                      <subItem.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                      <span>{subItem.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
