"use client";

import React, { useEffect, useState } from 'react';
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
  HelpCircle,
  Shield,
  DollarSign,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarCloseButton } from "./SidebarCloseButton";
import { SidebarContactSection } from "./SidebarContactSection";
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
  SidebarMenuAction,
  useSidebar
} from "@/components/ui/sidebar";

// Import our custom sheet component with no close button
import { Sheet, SheetContentNoClose } from "./SheetNoClose";

// Import navigation data
import { useNavigationStore } from '../../store/navigationStore';
import { useSidebarStore } from '../../store/sidebarStore';
import { useAuth } from '@/features/core/auth/hooks';
import { useMobileStore, selectIsMobile } from '@/features/core/mobile-support';

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
  const isMobile = useMobileStore(selectIsMobile);
  const { collapsed, setCollapsed, setOpenMobile } = useSidebar();

  // Logo animation state
  const [logoTransition, setLogoTransition] = useState(false);

  // Add transition effect for logo
  useEffect(() => {
    // Add a short delay to make the transition visible
    setLogoTransition(true);
    const timer = setTimeout(() => {
      setLogoTransition(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [collapsed]);

  // Auto-adjust sidebar variant for mobile
  const responsiveVariant = isMobile ? "floating" : variant;
  const responsiveCollapsible = isMobile ? "offcanvas" : collapsible;

  // Ensure mobile sidebar is properly sized
  useEffect(() => {
    if (isMobile) {
      // Update CSS variable to control sidebar width in mobile view
      document.documentElement.style.setProperty('--sidebar-width-mobile', '85vw');
    } else {
      // Reset to default value when not in mobile
      document.documentElement.style.removeProperty('--sidebar-width-mobile');
    }

    return () => {
      // Clean up when component unmounts
      document.documentElement.style.removeProperty('--sidebar-width-mobile');
    };
  }, [isMobile]);

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
      label: "Payments Management",
      href: "/admin/payments",
      icon: CreditCard,
      isActive: pathname?.startsWith("/admin/payments"),
      subItems: [
        {
          id: "admin-payments-approvals",
          label: "Approvals",
          href: "/admin/payments/approvals",
          icon: DollarSign,
          isActive: pathname === "/admin/payments/approvals" || pathname?.startsWith("/admin/payments/approvals/")
        },
        {
          id: "admin-payments-pending",
          label: "Pending",
          href: "/admin/payments/pending",
          icon: History,
          isActive: pathname === "/admin/payments/pending" || pathname?.startsWith("/admin/payments/pending/")
        }
      ]
    },
    {
      id: "admin-session-monitoring",
      label: "Session Monitoring",
      href: "/admin/session-monitoring",
      icon: Shield,
      isActive: pathname === "/admin/session-monitoring" || pathname?.startsWith("/admin/session-monitoring/")
    }
  ] : [];

  // Mobile specific click handler to close sidebar after navigation
  const handleItemClick = (href: string) => {
    router.push(href);
    // In mobile, automatically close the sidebar after navigation
    if (isMobile) {
      // Add a small delay to allow rendering to complete
      setTimeout(() => {
        // Properly close the sidebar in mobile view
        // Use the context method directly
        setOpenMobile(false);
      }, 50); // Reduced timing for better response
    }
  };

  return (
    <Sidebar
      className={cn("border-r flex flex-col", className)}
      variant={responsiveVariant}
      collapsible={responsiveCollapsible}
    >
      <SidebarHeader className="flex flex-col relative"> {/* Added relative positioning for absolute positioned children */}
        {/* Add back button for mobile */}
        {isMobile && <SidebarCloseButton className="text-muted-foreground" />}

        <div className="flex items-center p-3 border-b">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="bg-primary h-7 w-7 rounded-md flex items-center justify-center text-primary-foreground">
              <Pill className="h-4 w-4" />
            </div>
            <span className="font-semibold text-sm">Pharmacy Hub</span>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2 px-2 flex-1 flex flex-col">
        {/* Dashboard Section */}
        <SidebarMenu>
          {dashboardItems.map(item => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => handleItemClick(item.href)}
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
                          onClick={() => handleItemClick(item.href)}
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
              {adminItems.map(item => {
                const hasSubItems = item.subItems && item.subItems.length > 0;
                const isExpanded = hasSubItems && expandedItems[item.id];

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => {
                        if (hasSubItems) {
                          toggleItem(item.id);
                        } else {
                          handleItemClick(item.href);
                        }
                      }}
                      isActive={item.isActive}
                      tooltip={item.label}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>

                      {hasSubItems && (
                        <SidebarMenuAction className="ml-auto">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </SidebarMenuAction>
                      )}
                    </SidebarMenuButton>

                    {hasSubItems && isExpanded && (
                      <SidebarMenuSub>
                        {item.subItems!.map(subItem => (
                          <SidebarMenuSubItem key={subItem.id}>
                            <SidebarMenuSubButton
                              onClick={() => handleItemClick(subItem.href)}
                              isActive={subItem.isActive}
                            >
                              <subItem.icon className="mr-2 h-4 w-4" />
                              <span>{subItem.label}</span>
                              {subItem.badge && (
                                <span className="ml-auto bg-primary text-primary-foreground text-xs rounded px-1 py-0.5">
                                  {subItem.badge}
                                </span>
                              )}
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </div>
        )}

        <SidebarContactSection />
      </SidebarContent>

      <SidebarFooter className="p-3 text-xs text-muted-foreground border-t">
        {!collapsed && (
          <div className="flex items-center justify-between">
            <span className="text-xs">© {new Date().getFullYear()} Pharmacy Hub</span>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;