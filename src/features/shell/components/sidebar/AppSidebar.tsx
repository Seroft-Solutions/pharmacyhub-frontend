"use client";

import React from 'react';
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
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/features/ui/hooks";
import { SidebarMenu } from "./SidebarMenu";
import { useNavigation } from '../../navigation';

interface AppSidebarProps {
  className?: string;
  collapsible?: 'offcanvas' | 'icon' | 'none';
  variant?: 'sidebar' | 'floating' | 'inset';
  side?: 'left' | 'right';
  showFeatureGroups?: boolean;
}

/**
 * AppSidebar component - The main application sidebar
 * 
 * This component provides a fully featured sidebar for navigating the application,
 * with support for nested items, badges, permissions, and responsive design.
 * It uses the NavigationContext to get navigation items from all registered features.
 */
export function AppSidebar({
  className,
  collapsible = 'icon',
  variant = 'sidebar',
  side = 'left',
  showFeatureGroups = true
}: AppSidebarProps) {
  const isMobile = useIsMobile();
  const { features, getAllItems } = useNavigation();

  const sidebarContent = (
    <>
      <SidebarHeader className="flex items-center p-4">
        <div className="font-semibold text-base">Pharmacy Hub</div>
      </SidebarHeader>
      <SidebarContent>
        {showFeatureGroups ? (
          // Show items grouped by feature
          features
            .filter(feature => feature.items.length > 0)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(feature => (
              <SidebarGroup key={feature.id}>
                <SidebarGroupLabel>{feature.name}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu featureId={feature.id} />
                </SidebarGroupContent>
              </SidebarGroup>
            ))
        ) : (
          // Show all items without feature grouping
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
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
    <Sidebar 
      className={cn("border-r", className)}
      collapsible={collapsible}
      variant={variant}
      side={side}
    >
      {sidebarContent}
    </Sidebar>
  );
}
