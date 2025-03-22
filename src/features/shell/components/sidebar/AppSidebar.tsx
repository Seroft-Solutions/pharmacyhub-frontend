"use client";

import React, { useEffect } from 'react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  FileText, 
  Medal, 
  BookOpen, 
  LayoutDashboard,
  Pill,
  ChevronDown,
  ChevronRight,
  BarChart4,
  Users,
  Settings,
  CreditCard,
  BoxIcon,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuAction
} from "@/components/ui/sidebar";

// Import navigation data
import { useNavigationStore } from '../../store/navigationStore';
import { useSidebarStore } from '../../store/sidebarStore';
import { useAuth } from '@/features/core/auth/hooks';

// Import admin features
import { ADMIN_FEATURES } from '../../navigation/adminFeatures';

interface AppSidebarProps {
  className?: string;
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}

/**
 * AppSidebar - New implementation using shadcn/ui sidebar components
 * 
 * Properly integrates with the navigation system and authentication
 * Supports admin and user views
 */
export function AppSidebar({ 
  className,
  variant = "sidebar",
  collapsible = "icon"
}: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { expandedItems, toggleItem } = useSidebarStore();
  const { user } = useAuth();
  
  const isAdmin = user?.roles?.includes('ADMIN') || user?.roles?.includes('SUPER_ADMIN');
  
  // Track the state of the expanded exam section
  useEffect(() => {
    // Ensure the exams section is expanded by default
    if (!expandedItems.exams) {
      toggleItem('exams');
    }
  }, [expandedItems.exams, toggleItem]);

  // Group navigation items
  const dashboardItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: isAdmin ? "/admin/dashboard" : "/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard" || pathname === "/admin/dashboard"
    }
  ];
  
  // Exam items for user navigation
  const examItems = [
    {
      id: "past-papers",
      label: "Past Papers",
      href: "/exam/past-papers",
      icon: FileText,
      isActive: pathname === "/exam/past-papers" || pathname?.startsWith("/exam/past-papers/")
    },
    {
      id: "model-papers",
      label: "Model Papers",
      href: "/exam/model-papers",
      icon: Medal,
      isActive: pathname === "/exam/model-papers" || pathname?.startsWith("/exam/model-papers/")
    },
    {
      id: "subject-papers",
      label: "Subject Papers",
      href: "/exam/subject-papers",
      icon: BookOpen,
      isActive: pathname === "/exam/subject-papers" || pathname?.startsWith("/exam/subject-papers/")
    }
  ];
  
  // Admin specific items
  const adminItems = isAdmin ? [
    {
      id: "admin-exams",
      label: "Exam Management",
      href: "/admin/exams",
      icon: FileText,
      isActive: pathname === "/admin/exams" || pathname?.startsWith("/admin/exams/")
    },
    {
      id: "admin-payments",
      label: "Payment Approvals",
      href: "/admin/payments/approvals",
      icon: CreditCard,
      isActive: pathname === "/admin/payments/approvals" || pathname?.startsWith("/admin/payments/approvals/")
    }
  ] : [];
  
  // Other menu sections (only for non-admin view)
  const otherItems = !isAdmin ? [
    {
      id: "settings",
      label: "Settings",
      href: "/settings",
      icon: Settings,
      isActive: pathname === "/settings" || pathname?.startsWith("/settings/")
    },
    {
      id: "help",
      label: "Help & Support",
      href: "/help",
      icon: HelpCircle,
      isActive: pathname === "/help" || pathname?.startsWith("/help/")
    }
  ] : [];
  
  return (
    <Sidebar 
      className={cn("border-r", className)}
      variant={variant}
      collapsible={collapsible}
    >
      <SidebarHeader className="flex flex-col">
        <div className="flex items-center p-3 border-b">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="bg-primary h-7 w-7 rounded-md flex items-center justify-center text-primary-foreground">
              <Pill className="h-4 w-4" />
            </div>
            <span className="font-semibold text-sm">Pharmacy Hub</span>
          </Link>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="py-2 px-2">
        {/* Dashboard Section */}
        <SidebarMenu>
          {dashboardItems.map(item => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => router.push(item.href)}
                isActive={item.isActive}
                tooltip={item.label}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        {/* Exams Section (Collapsible) */}
        {!isAdmin && (
          <div className="mt-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => toggleItem('exams')}
                  tooltip="Exam Preparation"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  <span>Exam Preparation</span>
                  
                  <SidebarMenuAction className="ml-auto">
                    {expandedItems.exams ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </SidebarMenuAction>
                </SidebarMenuButton>
                
                {expandedItems.exams && (
                  <SidebarMenuSub>
                    {examItems.map(item => (
                      <SidebarMenuSubItem key={item.id}>
                        <SidebarMenuSubButton
                          onClick={() => router.push(item.href)}
                          isActive={item.isActive}
                        >
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.label}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        )}
        
        {/* Admin Items - Only for admin users */}
        {isAdmin && adminItems.length > 0 && (
          <div className="mt-4">
            <SidebarMenu>
              {adminItems.map(item => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => router.push(item.href)}
                    isActive={item.isActive}
                    tooltip={item.label}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        )}
        
        {/* Other sections - Only for non-admin users */}
        {!isAdmin && otherItems.length > 0 && (
          <div className="mt-4">
            <SidebarMenu>
              {otherItems.map(item => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => router.push(item.href)}
                    isActive={item.isActive}
                    tooltip={item.label}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>
        )}
      </SidebarContent>
      
      <SidebarFooter className="p-3 text-xs text-muted-foreground border-t">
        <div className="flex items-center justify-between">
          <span className="text-xs">© {new Date().getFullYear()} Pharmacy Hub</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;