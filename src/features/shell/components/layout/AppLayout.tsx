"use client";

import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/features/auth/hooks";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AppSidebar } from "../sidebar/AppSidebar";
import { AppTopbar } from "../topbar/AppTopbar";
import { ContentArea } from "./ContentArea";
import { useIsMobile } from "@/features/ui/hooks";
import { NavigationProvider, DEFAULT_FEATURES, FeatureNavigation } from "../../navigation";
import ModernMinimalistLogo from "@/shared/ui/logo/ModernMinimalistLogo";

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
  const { isAuthenticated, isLoadingUser } = useSession({ required: requireAuth });
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();
  
  // This ensures we only render the authenticated content after the component mounts on the client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show loading indicator while authentication status is being determined
  if (!isMounted || (requireAuth && (isLoadingUser || !isAuthenticated))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <NavigationProvider initialFeatures={features}>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="min-h-screen bg-background flex flex-col">
          <AppTopbar appName={appName} logoComponent={logoComponent} />
          
          <div className="flex flex-1 overflow-hidden">
            {/* Hide sidebar on mobile - it's shown in the Sheet component */}
            <div className="hidden md:block">
              <AppSidebar showFeatureGroups={showFeatureGroups} />
            </div>

            <ContentArea>
              {children}
            </ContentArea>
          </div>
        </div>
      </SidebarProvider>
    </NavigationProvider>
  );
}
