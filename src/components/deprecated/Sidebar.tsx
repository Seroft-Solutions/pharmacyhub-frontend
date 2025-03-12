"use client";

import React from 'react';
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
import { 
  Menu, 
  LucideIcon, 
  GraduationCap 
} from "lucide-react";
import ModernMinimalistLogo from "@/shared/ui/logo/ModernMinimalistLogo";
import { useIsMobile } from "@/features/ui/hooks";

// Simplified menu items
const menuItems = [
  { 
    label: "Exam Preparation", 
    href: "/exam/dashboard", 
    icon: GraduationCap,
    subItems: [
      { 
        label: "Past Papers", 
        href: "/exam/past-papers", 
        icon: GraduationCap
      },
      { 
        label: "Model Papers", 
        href: "/exam/model-papers", 
        icon: GraduationCap
      },
      { 
        label: "Subject Papers", 
        href: "/exam/subject-papers", 
        icon: GraduationCap
      }
    ]
  }
];

function NavItem({ 
  item, 
  depth = 0, 
  pathname 
}: { 
  item: any, 
  depth?: number, 
  pathname: string | null
}) {
  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
  const Icon = item.icon;

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

  return (
    <nav className="space-y-1">
      {menuItems.map((item) => (
        <NavItem 
          key={item.href} 
          item={item} 
          pathname={pathname}
        />
      ))}
    </nav>
  );
}

export function Sidebar() {
  const isMobile = useIsMobile();

  // On desktop: render full sidebar without logo
  if (!isMobile) { add-
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