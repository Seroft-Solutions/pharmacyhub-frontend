"use client";

import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useSession } from "@/features/auth/hooks";
import { useIsMobile } from "@/features/ui/hooks";
import ModernMinimalistLogo from "@/shared/ui/logo/ModernMinimalistLogo";
import { DEV_CONFIG } from "@/features/auth/constants/config";

import { AppTopbar } from "../topbar/AppTopbar";
import { ContentArea } from "./ContentArea";
import { AppSidebar } from "../sidebar/AppSidebar";
import { NavigationProvider, DEFAULT_FEATURES } from "../../navigation";
import { RoleProvider, useRole } from "../sidebar/useRole";
import { FeatureNavigation } from "../../types";

interface AppLayoutProps {
  children: React.ReactNode;
  features?: FeatureNavigation[];
  requireAuth?: boolean;
  appName?: string;
  logoComponent?: React.ReactNode;
  showFeatureGroups?: boolean;
}

/**
 * AppLayout component - Main layout component for the application
 * 
 * This component provides a consistent layout with sidebar, topbar, and content area.
 * It can be used by any feature in the application with support for unified navigation.
 */
export function AppLayout({
  children,
  features = DEFAULT_FEATURES,
  requireAuth = true,
  appName = "Pharmacy Hub",
  logoComponent = <ModernMinimalistLogo />,
  showFeatureGroups = false
}: AppLayoutProps) {
  // Apply requireAuth setting, but bypass in development mode if configured
  const actualRequireAuth = process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth 
    ? false 
    : requireAuth;
    
  const { isAuthenticated, isLoadingUser } = useSession({ required: actualRequireAuth });
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();
  
  // This ensures we only render the authenticated content after the component mounts on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading indicator while authentication status is being determined
  // Skip this check in development mode if we're bypassing auth
  if (!isMounted || (actualRequireAuth && (isLoadingUser || !isAuthenticated))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
      </div>
    );
  }

  return (
    <NavigationProvider initialFeatures={features}>
      <RoleProvider>
        <SidebarProvider defaultOpen={true} className="bg-background w-full min-h-screen">
          <div className="min-h-screen flex w-full h-full">
            <AppSidebar variant="sidebar" collapsible="icon" className="flex-shrink-0" />
            <SidebarInset className="flex flex-col flex-1 w-full h-full">
              <AppTopbar appName={appName} logoComponent={logoComponent} />
              <ContentArea>
                {children}
              </ContentArea>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </RoleProvider>
    </NavigationProvider>
  );
}
