"use client";

import React from 'react';
import { 
  FileText, 
  Medal, 
  BookOpen, 
  GraduationCap,
  Home,
  FileQuestion,
  BookMarked,
  Settings,
  Users,
  FileChart,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarProvider,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenuBadge
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { usePathname, useRouter } from "next/navigation";
import { usePermissions } from "@/features/rbac/hooks";
import { useIsMobile } from "@/features/ui/hooks";
import ModernMinimalistLogo from "@/shared/ui/logo/ModernMinimalistLogo";

export interface SidebarItemType {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permissions?: string[];
  roles?: string[];
  badge?: string | number;
  subItems?: SidebarItemType[];
}

const defaultItems: SidebarItemType[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["USER", "ADMIN", "STUDENT"],
  },
  {
    id: "exams",
    label: "Exams",
    href: "/exam/dashboard",
    icon: GraduationCap,
    roles: ["USER", "STUDENT"],
    subItems: [
      {
        id: "past-papers",
        label: "Past Papers",
        href: "/exam/past-papers",
        icon: FileText,
        permissions: ["view_past_papers"],
      },
      {
        id: "model-papers",
        label: "Model Papers",
        href: "/exam/model-papers",
        icon: Medal,
        permissions: ["view_model_papers"],
      },
      {
        id: "subject-papers",
        label: "Subject Papers",
        href: "/exam/subject-papers",
        icon: BookOpen,
        permissions: ["view_subject_papers"],
      },
      {
        id: "practice-exams",
        label: "Practice Exams",
        href: "/exam/practice",
        icon: FileQuestion,
        permissions: ["view_practice_exams"],
        badge: "New",
      }
    ]
  },
  {
    id: "progress",
    label: "Progress Tracking",
    href: "/progress",
    icon: FileChart,
    roles: ["USER", "STUDENT"],
  },
  {
    id: "settings",
    label: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["USER", "ADMIN", "STUDENT"],
  },
  {
    id: "admin",
    label: "Administration",
    href: "/admin",
    icon: Users,
    roles: ["ADMIN"],
    subItems: [
      {
        id: "user-management",
        label: "User Management",
        href: "/admin/users",
        icon: Users,
        permissions: ["manage_users"],
      },
      {
        id: "notifications",
        label: "Notifications",
        href: "/admin/notifications",
        icon: Bell,
        permissions: ["manage_notifications"],
      }
    ]
  }
];

function AppSidebarMenu({ items = defaultItems }: { items?: SidebarItemType[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { hasAccess } = usePermissions();
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});

  // Initialize expanded state based on current URL
  React.useEffect(() => {
    const newExpandedState: Record<string, boolean> = {};
    
    items.forEach(item => {
      if (item.subItems) {
        const isActive = item.subItems.some(subItem => 
          pathname === subItem.href || pathname?.startsWith(`${subItem.href}/`)
        );
        if (isActive) {
          newExpandedState[item.id] = true;
        }
      }
    });
    
    setExpandedItems(prev => ({...prev, ...newExpandedState}));
  }, [pathname, items]);

  // Filter items based on permissions and roles
  const filteredItems = React.useMemo(() => {
    return items.filter(item => 
      hasAccess({
        permissions: item.permissions,
        roles: item.roles,
        requireAll: false
      })
    ).map(item => ({
      ...item,
      subItems: item.subItems?.filter(subItem => 
        hasAccess({
          permissions: subItem.permissions,
          roles: subItem.roles, 
          requireAll: false
        })
      )
    }));
  }, [items, hasAccess]);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <SidebarMenu>
      {filteredItems.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const Icon = item.icon;
        const isExpanded = expandedItems[item.id];

        return (
          <SidebarMenuItem key={item.id}>
            {hasSubItems ? (
              <Collapsible
                open={isExpanded}
                onOpenChange={() => toggleExpanded(item.id)}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    isActive={isActive}
                    className="flex items-center justify-between w-full"
                  >
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </div>
                    {isExpanded ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-auto h-4 w-4"
                      >
                        <path d="m18 15-6-6-6 6" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-auto h-4 w-4"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.subItems?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.id}>
                        <SidebarMenuSubButton
                          onClick={() => router.push(subItem.href)}
                          isActive={pathname === subItem.href || pathname?.startsWith(`${subItem.href}/`)}
                        >
                          <subItem.icon className="h-4 w-4 mr-2" />
                          <span>{subItem.label}</span>
                        </SidebarMenuSubButton>
                        {subItem.badge && (
                          <div className="ml-auto flex h-5 items-center gap-0.5">
                            <span className="rounded-full bg-primary/10 px-2 text-xs font-semibold text-primary">
                              {subItem.badge}
                            </span>
                          </div>
                        )}
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <>
                <SidebarMenuButton
                  onClick={() => router.push(item.href)}
                  isActive={isActive}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </SidebarMenuButton>
                {item.badge && (
                  <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                )}
              </>
            )}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

interface AppSidebarProps {
  className?: string;
  items?: SidebarItemType[];
  collapsible?: 'offcanvas' | 'icon' | 'none';
  variant?: 'sidebar' | 'floating' | 'inset';
  side?: 'left' | 'right';
}

export function AppSidebar({
  className,
  items = defaultItems,
  collapsible = 'icon',
  variant = 'sidebar',
  side = 'left'
}: AppSidebarProps) {
  const isMobile = useIsMobile();

  const sidebarContent = (
    <>
      <SidebarHeader className="flex items-center p-4">
        <div className="font-semibold text-base">Pharmacy Hub</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <AppSidebarMenu items={items} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Pharmacy Hub
      </SidebarFooter>
    </>
  );

  // For mobile, render the sidebar in a sheet
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side={side} className="p-0 w-72">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  // For desktop, render the full sidebar
  return (
    <SidebarProvider>
      <Sidebar 
        className={cn("border-r", className)}
        collapsible={collapsible}
        variant={variant}
        side={side}
      >
        {sidebarContent}
      </Sidebar>
    </SidebarProvider>
  );
}
