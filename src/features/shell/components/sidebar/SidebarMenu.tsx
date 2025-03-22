"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LucideIcon, ChevronDown, ChevronRight } from 'lucide-react';
import {
  SidebarMenu as SMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from '@/components/ui/sidebar';
import { useSidebarStore } from '../../store/sidebarStore';
import { useAuth } from '@/features/core/auth/hooks';

interface NavMenuItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  isActive?: boolean;
  permissions?: string[];
  roles?: string[];
  subItems?: NavMenuItem[];
}

interface SidebarMenuProps {
  items: NavMenuItem[];
  title?: string;
  className?: string;
}

/**
 * SidebarMenu - Renders a section of navigation items in the sidebar
 * 
 * Handles collapsible sections, permissions, and active state
 */
export function SidebarMenu({ items, title, className }: SidebarMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { expandedItems, toggleItem } = useSidebarStore();
  const { hasPermission, hasRole } = useAuth();
  
  // Filter items by permission/role
  const filteredItems = items.filter(item => {
    // Check permissions if specified
    if (item.permissions && item.permissions.length > 0) {
      const hasPermissions = item.permissions.some(permission => 
        hasPermission(permission)
      );
      if (!hasPermissions) return false;
    }
    
    // Check roles if specified
    if (item.roles && item.roles.length > 0) {
      const hasRoles = item.roles.some(role => 
        hasRole(role)
      );
      if (!hasRoles) return false;
    }
    
    return true;
  });
  
  // No items to display after filtering
  if (filteredItems.length === 0) {
    return null;
  }
  
  return (
    <div className={className}>
      {title && (
        <h3 className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase">
          {title}
        </h3>
      )}
      
      <SMenu>
        {filteredItems.map(item => {
          const isActive = item.isActive || pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isExpanded = hasSubItems && expandedItems[item.id];
          
          return (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => {
                  if (hasSubItems) {
                    toggleItem(item.id);
                  } else {
                    router.push(item.href);
                  }
                }}
                isActive={isActive}
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
                  {item.subItems!.map(subItem => {
                    const isSubActive = 
                      subItem.isActive || 
                      pathname === subItem.href || 
                      pathname?.startsWith(`${subItem.href}/`);
                      
                    return (
                      <SidebarMenuSubItem key={subItem.id}>
                        <SidebarMenuSubButton
                          onClick={() => router.push(subItem.href)}
                          isActive={isSubActive}
                        >
                          <subItem.icon className="mr-2 h-4 w-4" />
                          <span>{subItem.label}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          );
        })}
      </SMenu>
    </div>
  );
}

export default SidebarMenu;