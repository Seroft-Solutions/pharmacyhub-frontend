"use client";

import React, { useMemo, useState } from 'react';
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Import from the new centralized RBAC system
import { useFeatureAccess } from "@/features/rbac/hooks";
import { useExamFeatureAccess, permissionToOperation } from "@/features/exams/rbac";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar";
import { ExamMenuItemType, ExamSidebarMenuProps } from "./types";

/**
 * Renders a single item in the exam sidebar
 */
function ExamSidebarItem({
  item,
  depth = 0,
}: {
  item: ExamMenuItemType;
  depth?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
  const [isExpanded, setIsExpanded] = useState(isActive);
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const Icon = item.icon;

  const handleClick = () => {
    if (hasSubItems) {
      setIsExpanded(!isExpanded);
    }
    if (!hasSubItems || depth === 0) {
      router.push(item.href);
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        onClick={handleClick}
        isActive={isActive}
        className={cn(
          "flex items-center justify-between",
          item.color && `text-${item.color}-600 hover:text-${item.color}-700`
        )}
      >
        <div className="flex items-center space-x-2">
          <Icon className="h-4 w-4" />
          <span>{item.label}</span>
        </div>
        {hasSubItems && (
          isExpanded ? 
            <ChevronDown className="h-4 w-4 ml-auto" /> : 
            <ChevronRight className="h-4 w-4 ml-auto" />
        )}
      </SidebarMenuButton>

      {item.badge && (
        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
      )}

      {/* Render sub-items if expanded */}
      {hasSubItems && isExpanded && (
        <SidebarMenuSub>
          {item.subItems.map((subItem) => (
            <SidebarMenuSubItem key={subItem.id}>
              <SidebarMenuSubButton
                onClick={() => router.push(subItem.href)}
                isActive={pathname === subItem.href}
                className={cn(
                  subItem.color && `text-${subItem.color}-600 hover:text-${subItem.color}-700`
                )}
              >
                <subItem.icon className="h-4 w-4 mr-2" />
                {subItem.label}
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}

/**
 * ExamSidebarMenu component for rendering the exam sidebar menu items
 * Updated to use the centralized RBAC system
 */
export function ExamSidebarMenu({ items }: ExamSidebarMenuProps) {
  // Use centralized feature-based RBAC
  const { hasRole, hasAnyRole } = useFeatureAccess();
  const { checkExamOperation } = useExamFeatureAccess();

  // Filter items based on roles and mapped permissions
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Check roles
      const hasRequiredRoles = item.roles 
        ? hasAnyRole(item.roles)
        : true;
        
      // Check permissions by mapping to operations
      const hasRequiredPermissions = item.permissions
        ? item.permissions.every(permission => {
            // Convert old permission string to operation
            const operation = permissionToOperation(permission);
            return operation ? checkExamOperation(operation) : true;
          })
        : true;
        
      return hasRequiredRoles && hasRequiredPermissions;
    }).map(item => ({
      ...item,
      subItems: item.subItems?.filter(subItem => {
        // Similar check for sub-items
        const hasRequiredRoles = subItem.roles 
          ? hasAnyRole(subItem.roles)
          : true;
          
        const hasRequiredPermissions = subItem.permissions
          ? subItem.permissions.every(permission => {
              const operation = permissionToOperation(permission);
              return operation ? checkExamOperation(operation) : true;
            })
          : true;
          
        return hasRequiredRoles && hasRequiredPermissions;
      })
    }));
  }, [items, hasAnyRole, checkExamOperation]);

  return (
    <SidebarMenu>
      {filteredItems.map((item) => (
        <ExamSidebarItem 
          key={item.id} 
          item={item} 
        />
      ))}
    </SidebarMenu>
  );
}
