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
          <SidebarMenuItem key={item.id} className="relative">
            {hasSubItems ? (
              <Collapsible
                open={isExpanded}
                onOpenChange={() => toggleExpanded(item.id)}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    isActive={isActive}
                    className="flex items-center justify-between w-full group transition-all"
                    tooltip={item.label}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-md ${isActive ? 'bg-primary/10' : 'bg-transparent group-hover:bg-muted'} transition-all`}>
                        <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                      </div>
                      <span className={`${isActive ? 'font-medium' : ''}`}>{item.label}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="ml-auto h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
                    )}
                    {item.badge && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs rounded-md bg-primary/10 text-primary font-medium">
                        {item.badge}
                      </span>
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="ml-4 mt-1 pl-2 border-l-2 border-sidebar-border">
                    {item.subItems?.map((subItem) => {
                      const isSubActive = pathname === subItem.href || pathname?.startsWith(`${subItem.href}/`);
                      return (
                        <SidebarMenuSubItem key={subItem.id}>
                          <SidebarMenuSubButton
                            onClick={() => router.push(subItem.href)}
                            isActive={isSubActive}
                            tooltip={subItem.label}
                            className="group transition-all"
                          >
                            <div className={`p-1 rounded-md ${isSubActive ? 'bg-primary/10' : 'bg-transparent group-hover:bg-muted'} transition-all`}>
                              <subItem.icon className={`h-3.5 w-3.5 ${isSubActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                            </div>
                            <span className={`${isSubActive ? 'font-medium' : ''}`}>{subItem.label}</span>
                          </SidebarMenuSubButton>
                          {subItem.badge && (
                            <div className="ml-auto flex h-5 items-center gap-0.5">
                              <span className="rounded-full bg-primary/10 px-1.5 text-xs font-semibold text-primary">
                                {subItem.badge}
                              </span>
                            </div>
                          )}
                          
                          {/* Handle nested sub-items (third level) */}
                          {subItem.subItems && subItem.subItems.length > 0 && (
                            <SidebarMenuSub className="mt-1 ml-2 pl-2 border-l-2 border-sidebar-border/70">
                              {subItem.subItems.map((nestedItem) => {
                                const isNestedActive = pathname === nestedItem.href || pathname?.startsWith(`${nestedItem.href}/`);
                                return (
                                  <SidebarMenuSubItem key={nestedItem.id}>
                                    <SidebarMenuSubButton
                                      onClick={() => router.push(nestedItem.href)}
                                      isActive={isNestedActive}
                                      tooltip={nestedItem.label}
                                      size="sm"
                                      className="group transition-all"
                                    >
                                      <div className={`p-0.5 rounded-md ${isNestedActive ? 'bg-primary/10' : 'bg-transparent group-hover:bg-muted'} transition-all`}>
                                        <nestedItem.icon className={`h-3 w-3 ${isNestedActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                                      </div>
                                      <span className={`${isNestedActive ? 'font-medium' : ''}`}>{nestedItem.label}</span>
                                    </SidebarMenuSubButton>
                                    {nestedItem.badge && (
                                      <div className="ml-auto flex h-4 items-center gap-0.5">
                                        <span className="rounded-full bg-primary/10 px-1 text-xs font-semibold text-primary">
                                          {nestedItem.badge}
                                        </span>
                                      </div>
                                    )}
                                  </SidebarMenuSubItem>
                                );
                              })}
                            </SidebarMenuSub>
                          )}
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <>
                <SidebarMenuButton
                  onClick={() => router.push(item.href)}
                  isActive={isActive}
                  tooltip={item.label}
                  className="group transition-all"
                >
                  <div className={`p-1 rounded-md ${isActive ? 'bg-primary/10' : 'bg-transparent group-hover:bg-muted'} transition-all`}>
                    <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                  </div>
                  <span className={`${isActive ? 'font-medium' : ''}`}>{item.label}</span>
                </SidebarMenuButton>
                {item.badge && (
                  <SidebarMenuBadge>
                    <span className="px-1.5 py-0.5 text-xs rounded-md bg-primary/10 text-primary font-medium">
                      {item.badge}
                    </span>
                  </SidebarMenuBadge>
                )}
              </>
            )}
          </SidebarMenuItem>
        );
      })}
    </UISidebarMenu>
  );
}
