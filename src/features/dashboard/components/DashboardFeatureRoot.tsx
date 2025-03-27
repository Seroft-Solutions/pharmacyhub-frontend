"use client";

import React, { useEffect } from "react";
import { useNavigationStore } from "@/features/shell";
import { DASHBOARD_NAVIGATION } from "../navigation";

interface DashboardFeatureRootProps {
  children: React.ReactNode;
}

/**
 * Inner component that uses the navigation store
 */
function DashboardNavRegistration({ children }: { children: React.ReactNode }) {
  // Get actions from navigation store
  const registerFeature = useNavigationStore(state => state.registerFeature);
  const unregisterFeature = useNavigationStore(state => state.unregisterFeature);
  
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
  // Register dashboard navigation using the inner component
  return <DashboardNavRegistration>{children}</DashboardNavRegistration>;
}
