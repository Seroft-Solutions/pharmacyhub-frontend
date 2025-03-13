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
import { Pill } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks";

import { SidebarMenu } from "./SidebarMenu";
import { RoleSwitcher } from './RoleSwitcher';
import { useNavigation } from '../../navigation';
import { useRole } from './useRole';

interface AppSidebarProps {
  className?: string;
  collapsible?: 'offcanvas' | 'icon' | 'none';
  variant?: 'sidebar' | 'floating' | 'inset';
  side?: 'left' | 'right';
}

/**
 * AppSidebar component - The main application sidebar with role switching support
 */
export function AppSidebar({
  className,
  collapsible = 'icon',
  variant = 'sidebar',
  side = 'left',
}: AppSidebarProps) {
  const { state } = useSidebar();
  const pathname = usePathname();
  const { features } = useNavigation();
  const { role, setRole } = useRole();
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN');

  // Determine which features to show based on role
  const visibleFeatures = features.filter(feature => {
    if (role === 'admin') {
      // In admin mode, show admin and core features
      return feature.id === 'admin' || 
        feature.id === 'dashboard' || 
        feature.id === 'settings' || 
        feature.id === 'help';
    } else {
      // In user mode, show all non-admin features
      return feature.id !== 'admin';
    }
  });

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
        {/* Render navigation based on selected role */}
        {visibleFeatures.map(feature => (
          <React.Fragment key={feature.id}>
            <SidebarMenu 
              featureId={feature.id} 
            />
          </React.Fragment>
        ))}
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
