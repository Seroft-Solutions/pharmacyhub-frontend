"use client";

import React, { useState, useEffect } from "react";
import { forceAdminMode } from "../../store/roleStore";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useSession } from "@/features/core/app-auth/hooks";
import { useIsMobile } from "@/features/ui/hooks";
import ModernMinimalistLogo from "@/shared/ui/logo/ModernMinimalistLogo";
import { DEV_CONFIG } from "@/features/core/app-auth/constants/config";
import { logger } from '@/shared/lib/logger';

// Import Zustand stores
import { useNavigationStore } from '../../store/navigationStore';

// Import sidebar components
import { AppTopbar } from "../topbar/AppTopbar";
import { ContentArea } from "./ContentArea";
import { AppSidebar } from "../sidebar/AppSidebar";
import { AppManager } from "../AppManager";

// Import types
import { FeatureNavigation } from "../../types/navigationTypes";

// Import default features
import { DEFAULT_FEATURES } from "../../navigation/features";

interface AppLayoutProps {
  children: React.ReactNode;
  features?: FeatureNavigation[];
  requireAuth?: boolean;
  appName?: string;
  logoComponent?: React.ReactNode;
  showFeatureGroups?: boolean;
  showSidebar?: boolean;
  defaultRole?: 'user' | 'admin' | 'super_admin';
  forceAdminMode?: boolean;
}

/**
 * AppLayout component - Main layout component for the application
 * 
 * This component provides a consistent layout with sidebar, topbar, and content area.
 * It can be used by any feature in the application with support for unified navigation.
 * 
 * Completely rebuilt to use Zustand for state management with no context providers
 */
export function AppLayout({
  children,
  features = DEFAULT_FEATURES,
  requireAuth = true,
  appName = "Pharmacy Hub",
  logoComponent = <ModernMinimalistLogo />,
  showFeatureGroups = false,
  showSidebar = true,
  defaultRole,
  forceAdminMode: forceAdmin = false
}: AppLayoutProps) {
  // Always initialize state variables and hooks at the top level
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();
  
  // Apply requireAuth setting, with development mode bypass if configured
  const actualRequireAuth = process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth 
    ? false 
    : requireAuth;
    
  // Authentication state
  const { user, isAuthenticated, isLoadingUser } = useSession({ required: actualRequireAuth });
  
  // Use Zustand for navigation state
  const { registerFeature } = useNavigationStore();
  
  // Register features (only once on mount)
  useEffect(() => {
    if (features && features.length > 0) {
      logger.debug('[AppLayout] Registering initial features', {
        count: features.length,
        featureIds: features.map(f => f.id)
      });
      
      features.forEach(feature => {
        registerFeature(feature);
      });
    }
  }, [features, registerFeature]);
  
  // Handle component mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Handle role setup using Zustand
  useEffect(() => {
    if (typeof window !== 'undefined' && forceAdmin) {
      forceAdminMode();
    }
  }, [forceAdmin]);
  
  // Show loading indicator while authentication is being determined
  if (!isMounted || (actualRequireAuth && (isLoadingUser || !isAuthenticated))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary/70">Loading...</div>
      </div>
    );
  }
  
  // The actual layout - using Zustand for state management
  return (
    <SidebarProvider defaultOpen={true} className="bg-background w-full min-h-screen">
      {/* AppManager handles synchronization between auth and role state */}
      <AppManager />
      
      <div className="min-h-screen flex w-full h-full">
        {showSidebar && (
          <AppSidebar variant="sidebar" collapsible="icon" className="flex-shrink-0" />
        )}
        
        <SidebarInset className="flex flex-col flex-1 w-full h-full">
          <AppTopbar 
            appName={appName} 
            logoComponent={logoComponent} 
            showRoleSwitcher={showSidebar}
          />
          
          <ContentArea>
            {children}
          </ContentArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}