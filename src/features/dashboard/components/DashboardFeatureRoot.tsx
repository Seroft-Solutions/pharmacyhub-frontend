"use client";

import React, { useEffect } from "react";
import { useNavigation, NavigationProvider } from "@/features/shell";
import { DASHBOARD_NAVIGATION } from "../navigation";

interface DashboardFeatureRootProps {
  children: React.ReactNode;
}

/**
 * Inner component that uses the navigation context
 */
function DashboardNavRegistration({ children }: { children: React.ReactNode }) {
  const { registerFeature, unregisterFeature } = useNavigation();
  
  // Register dashboard navigation when component mounts
  useEffect(() => {
    registerFeature(DASHBOARD_NAVIGATION);
    
    // Unregister when component unmounts
    return () => {
      unregisterFeature(DASHBOARD_NAVIGATION.id);
    };
  }, [registerFeature, unregisterFeature]);
  
  return <>{children}</>;
}

/**
 * DashboardFeatureRoot - Root component for the Dashboard feature
 * 
 * This component registers the Dashboard feature navigation with the shell
 * navigation system when mounted and unregisters it when unmounted.
 */
export function DashboardFeatureRoot({ children }: DashboardFeatureRootProps) {
  // Directly pass the children without wrapping in NavigationProvider
  // The AppLayout component will provide the NavigationProvider
  return <>{children}</>;
}
