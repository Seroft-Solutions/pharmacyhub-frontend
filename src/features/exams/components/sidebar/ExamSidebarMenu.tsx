"use client";

import React, { useMemo, useState } from 'react';
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/features/rbac/hooks";
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
 */
export function ExamSidebarMenu({ items }: ExamSidebarMenuProps) {
  const { hasAccess } = usePermissions();

  // Filter items based on permissions and roles
  const filteredItems = useMemo(() => {
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
