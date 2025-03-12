"use client";

import React from 'react';
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarMenu as UISidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { usePermissions } from "@/features/rbac/hooks";
import { SidebarItemType, SidebarMenuProps } from "./types";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * SidebarMenu component for rendering the application sidebar menu items
 */
export function SidebarMenu({ items }: SidebarMenuProps) {
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
    <UISidebarMenu>
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
                      <ChevronUp className="ml-auto h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-auto h-4 w-4" />
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
    </UISidebarMenu>
  );
}
