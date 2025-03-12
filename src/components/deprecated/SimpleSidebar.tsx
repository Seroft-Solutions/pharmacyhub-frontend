"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { 
  Menu,
  FileText, 
  Medal, 
  BookOpen, 
  GraduationCap,
  ChevronDown,
  ChevronRight 
} from "lucide-react";
import ModernMinimalistLogo from "@/shared/ui/logo/ModernMinimalistLogo";
import { usePermissions } from "@/features/rbac/hooks";
import { useIsMobile } from "@/features/ui/hooks";

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

function NavItem({ 
  item, 
  depth = 0, 
  pathname,
  onExpandToggle,
  isExpanded
}: { 
  item: any, 
  depth?: number, 
  pathname: string | null,
  onExpandToggle?: () => void,
  isExpanded?: boolean
}) {
  const router = useRouter();
  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
  const Icon = item.icon;
  const hasSubItems = item.subItems && item.subItems.length > 0;

  return (
    <div className="mb-1">
      <div
        className={cn(
          "flex items-center justify-between px-4 py-2 rounded-lg transition-colors w-full cursor-pointer",
          isActive
            ? "bg-blue-50 text-blue-600"
            : "text-gray-700 hover:bg-gray-100"
        )}
        onClick={() => {
          if (hasSubItems && onExpandToggle) {
            onExpandToggle();
          } else {
            router.push(item.href);
          }
        }}
      >
        <div className="flex items-center space-x-3">
          <Icon className="h-5 w-5 flex-shrink-0" />
          <span>{item.label}</span>
        </div>
        {hasSubItems && (
          isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
        )}
      </div>
      
      {/* Render sub-items if expanded */}
      {hasSubItems && isExpanded && (
        <div className="pl-8 mt-1 space-y-1 border-l-2 border-gray-100 ml-6">
          {item.subItems.map((subItem: any) => (
            <div
              key={subItem.href}
              className={cn(
                "flex items-center px-4 py-2 rounded-lg transition-colors w-full cursor-pointer",
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
  );
}

function NavItems() {
  const pathname = usePathname();
  const { hasAccess } = usePermissions();
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  // Filter menu items based on permissions and roles
  const filteredMenuItems = examMenuItems.filter(item => 
    hasAccess({
      permissions: item.permissions,
      roles: item.roles,
      requireAll: false
    })
  );

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <nav className="space-y-1">
      {filteredMenuItems.map((item, index) => (
        <NavItem 
          key={item.href} 
          item={item} 
          pathname={pathname}
          onExpandToggle={() => toggleExpanded(index)}
          isExpanded={expandedItems[index]}
        />
      ))}
    </nav>
  );
}

export function SimpleSidebar() {
  const isMobile = useIsMobile();

  // On desktop: render full sidebar without logo
  if (!isMobile) {
    return (
      <aside className="w-64 bg-white rounded-lg shadow-sm h-fit sticky top-24 overflow-y-auto max-h-[calc(100vh-6rem)]">
        <div className="p-4">
          <div className="font-semibold text-sm mb-4 px-4 text-gray-500 uppercase tracking-wider">
            Exams
          </div>
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
          <div className="font-semibold text-sm mb-4 px-4 text-gray-500 uppercase tracking-wider">
            Exams
          </div>
          <NavItems />
        </div>
      </SheetContent>
    </Sheet>
  );
}
