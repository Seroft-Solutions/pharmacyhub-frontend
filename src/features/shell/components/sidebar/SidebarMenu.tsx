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
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigation } from '../../navigation';
import { NavItem } from '../../navigation/types';

interface SidebarMenuProps {
  items?: NavItem[];
  featureId?: string;
}

/**
 * SidebarMenu component for rendering the application sidebar menu items
 * 
 * This uses the navigation context to get items if no items are provided.
 * If featureId is provided, it will only show items for that feature.
 */
export function SidebarMenu({ items, featureId }: SidebarMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { hasAccess } = usePermissions();
  const navigation = useNavigation();
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});
  
  // Get items from navigation context if not provided
  const menuItems = items || (featureId 
    ? navigation.getFeatureItems(featureId)
    : navigation.getAllItems());

  // Initialize expanded state based on current URL
  React.useEffect(() => {
    const newExpandedState: Record<string, boolean> = {};
    
    menuItems.forEach(item => {
      if (item.subItems) {
        // Always expand exam items and any active navigation
        const isActive = item.href === pathname || 
          pathname?.startsWith(`${item.href}/`) ||
          item.subItems.some(subItem => 
            subItem.href === pathname || pathname?.startsWith(`${subItem.href}/`)
          ) ||
          item.id === "exams";
          
        if (isActive) {
          newExpandedState[item.id] = true;
        }
      }
    });
    
    setExpandedItems(prev => ({...prev, ...newExpandedState}));
  }, [pathname, menuItems]);

  // Filter items based on permissions and roles
  const filteredItems = React.useMemo(() => {
    return menuItems.filter(item => 
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
    }))
    // Sort by order if specified
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [menuItems, hasAccess]);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <UISidebarMenu>
      {filteredItems.map((item) => {
        const isActive = item.href === pathname || pathname?.startsWith(`${item.href}/`);
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
                    tooltip={item.label}
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
                          tooltip={subItem.label}
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
                        
                        {/* Handle nested sub-items (third level) */}
                        {subItem.subItems && subItem.subItems.length > 0 && (
                          <SidebarMenuSub>
                            {subItem.subItems.map((nestedItem) => (
                              <SidebarMenuSubItem key={nestedItem.id}>
                                <SidebarMenuSubButton
                                  onClick={() => router.push(nestedItem.href)}
                                  isActive={pathname === nestedItem.href || pathname?.startsWith(`${nestedItem.href}/`)}
                                  tooltip={nestedItem.label}
                                  size="sm"
                                >
                                  <nestedItem.icon className="h-3.5 w-3.5 mr-1.5" />
                                  <span>{nestedItem.label}</span>
                                </SidebarMenuSubButton>
                                {nestedItem.badge && (
                                  <div className="ml-auto flex h-4 items-center gap-0.5">
                                    <span className="rounded-full bg-primary/10 px-1.5 text-xs font-semibold text-primary">
                                      {nestedItem.badge}
                                    </span>
                                  </div>
                                )}
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
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
                  tooltip={item.label}
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
