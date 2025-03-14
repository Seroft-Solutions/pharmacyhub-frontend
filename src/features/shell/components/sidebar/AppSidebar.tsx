"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
  useSidebar
} from "@/components/ui/sidebar";
import {
  Pill,
  LayoutDashboard,
  GraduationCap,
  FileText,
  Medal,
  BookOpen,
  FileQuestion,
  ClipboardList,
  ChevronRight,
  BarChart,
  Package,
  Users,
  Settings,
  HelpCircle,
  FileBarChart
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks";
import { RoleSwitcher } from './RoleSwitcher';
import { useRole } from '../../Hooks/useRole';
import { useNavigation } from '../../navigation';

interface AppSidebarProps {
  className?: string;
  collapsible?: 'offcanvas' | 'icon' | 'none';
  variant?: 'sidebar' | 'floating' | 'inset';
  side?: 'left' | 'right';
}

/**
 * AppSidebar component - The main application sidebar with role switching support
 * and direct rendering of exam preparation menu items
 */
export function AppSidebar({
                             className,
                             collapsible = 'icon',
                             variant = 'sidebar',
                             side = 'left',
                           }: AppSidebarProps) {
  const { state } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const { features } = useNavigation();
  const { hasRole } = useAuth();
  // Check for both ADMIN and SUPER_ADMIN roles
  const isAdmin = hasRole('ADMIN') || hasRole('SUPER_ADMIN');
  const { role, setRole, isAdmin: roleIsAdmin, isSuperAdmin } = useRole();

  // State for expandable menu sections
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({
    examPreparation: true,
    practiceExams: false,
    examTools: false,
    inventory: false,
    users: false,
    settings: false
  });

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Main menu item
  const MenuItem = ({
                      id,
                      icon: Icon,
                      label,
                      href,
                      isActive,
                      hasChildren,
                      badge,
                      onClick
                    }: {
    id: string;
    icon: React.ElementType;
    label: string;
    href?: string;
    isActive?: boolean;
    hasChildren?: boolean;
    badge?: string;
    onClick?: () => void;
  }) => (
    <div
      className={cn(
        "flex items-center justify-between py-1.5 px-3 rounded-md cursor-pointer mb-0.5 transition-colors",
        isActive ? "text-primary font-medium" : "hover:bg-muted"
      )}
      onClick={onClick || (href ? () => router.push(href) : undefined)}
    >
      <div className="flex items-center gap-2">
        <Icon className={cn(
          "h-4 w-4",
          isActive ? "text-primary" : "text-muted-foreground"
        )} />
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex items-center">
        {badge && (
          <span className="rounded-full px-1.5 py-0.5 text-xs font-medium bg-primary/10 text-primary mr-1">
            {badge}
          </span>
        )}
        {hasChildren && (
          <ChevronRight className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform",
            expandedItems[id] ? "rotate-90" : ""
          )} />
        )}
      </div>
    </div>
  );

  // Submenu container with vertical line
  const SubMenuContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="relative ml-4 pl-3">
      {/* Vertical line */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-border"></div>
      {children}
    </div>
  );

  // Submenu item
  const SubMenuItem = ({
                         id,
                         icon: Icon,
                         label,
                         href,
                         isActive,
                         badge
                       }: {
    id: string;
    icon: React.ElementType;
    label: string;
    href: string;
    isActive?: boolean;
    badge?: string;
  }) => (
    <div
      className="py-1.5 pr-3 rounded-md cursor-pointer mb-0.5 transition-colors flex items-center justify-between"
      onClick={() => router.push(href)}
    >
      <div className="flex items-center gap-2">
        <Icon className={cn(
          "h-3.5 w-3.5",
          isActive ? "text-primary" : "text-muted-foreground"
        )} />
        <span className={cn(
          "text-sm",
          isActive ? "text-primary font-medium" : ""
        )}>
          {label}
        </span>
      </div>
      {badge && (
        <span className="rounded-full px-1.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
          {badge}
        </span>
      )}
    </div>
  );

  // Function to render exam preparation menu for user role
  const renderExamPreparationMenu = () => {
    return (
      <>
        {/* Exam Preparation with nested items */}
        <MenuItem
          id="examPreparation"
          icon={GraduationCap}
          label="Exam Preparation"
          isActive={pathname.startsWith("/exam")}
          hasChildren={true}
          onClick={() => toggleExpanded("examPreparation")}
        />

        {expandedItems.examPreparation && (
          <SubMenuContainer>
            <SubMenuItem
              id="studyProgress"
              icon={BarChart}
              label="Your Progress"
              href="/exam/dashboard"
              isActive={pathname === "/exam/dashboard"}
            />

            <SubMenuItem
              id="pastPapers"
              icon={FileText}
              label="Past Papers"
              href="/exam/past-papers"
              isActive={pathname === "/exam/past-papers"}
            />

            <SubMenuItem
              id="modelPapers"
              icon={Medal}
              label="Model Papers"
              href="/exam/model-papers"
              isActive={pathname === "/exam/model-papers"}
            />

            <SubMenuItem
              id="subjectPapers"
              icon={BookOpen}
              label="Subject Papers"
              href="/exam/subject-papers"
              isActive={pathname === "/exam/subject-papers"}
            />

            <SubMenuItem
              id="practiceExams"
              icon={FileQuestion}
              label="Practice Exams"
              href="/exam/practice"
              isActive={pathname.startsWith("/exam/practice")}
              badge="New"
            />

            <SubMenuItem
              id="examTools"
              icon={ClipboardList}
              label="Exam Tools"
              href="/exam/tools"
              isActive={pathname.startsWith("/exam/tools")}
            />
          </SubMenuContainer>
        )}
      </>
    );
  };

  // Function to render admin menu items
  const renderAdminMenu = () => {
    return (
      <>
        <MenuItem
          id="dashboard"
          icon={LayoutDashboard}
          label="Dashboard"
          href="/admin/dashboard"
          isActive={pathname === "/admin/dashboard"}
        />

        <MenuItem
          id="examManagement"
          icon={FileBarChart}
          label="Exam Management"
          href="/admin/exams"
          isActive={pathname.startsWith("/admin/exams")}
        />

        <MenuItem
          id="inventory"
          icon={Package}
          label="Inventory"
          hasChildren={true}
          isActive={pathname.startsWith("/admin/inventory")}
          onClick={() => toggleExpanded("inventory")}
        />

        {expandedItems.inventory && (
          <SubMenuContainer>
            <SubMenuItem
              id="products"
              icon={Package}
              label="Products"
              href="/admin/inventory/products"
              isActive={pathname === "/admin/inventory/products"}
            />

            <SubMenuItem
              id="categories"
              icon={Package}
              label="Categories"
              href="/admin/inventory/categories"
              isActive={pathname === "/admin/inventory/categories"}
            />
          </SubMenuContainer>
        )}

        <MenuItem
          id="users"
          icon={Users}
          label="User Management"
          hasChildren={true}
          isActive={pathname.startsWith("/admin/users")}
          onClick={() => toggleExpanded("users")}
        />

        {expandedItems.users && (
          <SubMenuContainer>
            <SubMenuItem
              id="usersList"
              icon={Users}
              label="All Users"
              href="/admin/users/list"
              isActive={pathname === "/admin/users/list"}
            />

            <SubMenuItem
              id="permissions"
              icon={ShieldCheck}
              label="Permissions"
              href="/admin/users/permissions"
              isActive={pathname === "/admin/users/permissions"}
            />
          </SubMenuContainer>
        )}

        <MenuItem
          id="settings"
          icon={Settings}
          label="Settings"
          hasChildren={true}
          isActive={pathname.startsWith("/admin/settings")}
          onClick={() => toggleExpanded("settings")}
        />

        {expandedItems.settings && (
          <SubMenuContainer>
            <SubMenuItem
              id="general"
              icon={Settings}
              label="General"
              href="/admin/settings/general"
              isActive={pathname === "/admin/settings/general"}
            />

            <SubMenuItem
              id="appearance"
              icon={Settings}
              label="Appearance"
              href="/admin/settings/appearance"
              isActive={pathname === "/admin/settings/appearance"}
            />
          </SubMenuContainer>
        )}

        <MenuItem
          id="help"
          icon={HelpCircle}
          label="Help & Support"
          href="/admin/help"
          isActive={pathname === "/admin/help"}
        />
      </>
    );
  };

  return (
    <Sidebar
      className={cn("border-r", className)}
      collapsible={collapsible}
      variant={variant}
      side={side}
    >
      <SidebarHeader className="flex flex-col">
        <div className="flex items-center p-3 border-b">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="bg-primary h-7 w-7 rounded-md flex items-center justify-center text-primary-foreground">
              <Pill className="h-4 w-4" />
            </div>
            <span className="font-semibold text-sm">Pharmacy Hub</span>
          </Link>
        </div>

        {/* Role Switcher - Only shown if user has admin permissions */}
        {isAdmin && (
          <RoleSwitcher
            role={role}
            onRoleChange={setRole}
          />
        )}
      </SidebarHeader>

      <SidebarContent className="py-2 px-2">
        {/* Show different navigation based on selected role */}
        {roleIsAdmin || isSuperAdmin ? (
          // Admin Navigation
          renderAdminMenu()
        ) : (
          // User Navigation
          <>
            {/* Dashboard */}
            <MenuItem
              id="dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
              href="/dashboard"
              isActive={pathname === "/dashboard"}
            />

            {/* Exam Preparation Menu */}
            {renderExamPreparationMenu()}
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3 text-xs text-muted-foreground border-t">
        <div className="flex items-center justify-between">
          <span className="text-xs">© {new Date().getFullYear()} Pharmacy Hub</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">v1.0.0</span>
        </div>
      </SidebarFooter>
      <SidebarRail className="bg-muted hover:bg-primary/10 transition-colors duration-300" />
    </Sidebar>
  );
}

// Add missing import
import { ShieldCheck } from 'lucide-react';
