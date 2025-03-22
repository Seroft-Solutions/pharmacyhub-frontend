"use client";

import React, { useEffect, useState } from "react";
import { AppLayout } from "@/features/shell";
import { ADMIN_NAVIGATION, ADMIN_FEATURES } from "@/features/shell/navigation/adminFeatures";
import { forceAdminMode } from "@/features/shell/store/roleStore";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/core/auth/hooks";
import { logger } from '@/shared/lib/logger';

/**
 * This layout component wraps all admin routes.
 * It uses the AppLayout from the shell feature for consistent navigation
 * and provides the admin navigation items.
 * 
 * The layout automatically detects if the user has admin role and shows the admin sidebar.
 * If the user is not an admin, they are redirected to the dashboard.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { hasRole, isAuthenticated, isLoading, user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Force admin mode and check for admin access
  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined') return;
    
    // Wait for auth to load
    if (isLoading) return;
    
    setIsInitialized(true);
    
    // If user is not authenticated, the AppLayout will handle redirection
    if (!isAuthenticated) return;
    
    logger.debug('[AdminLayout] User authenticated, checking admin access', {
      email: user?.email,
      roles: user?.roles
    });
    
    // Check if user has admin role
    const hasAdminAccess = hasRole('ADMIN') || hasRole('PER_ADMIN');
    
    if (!hasAdminAccess) {
      // Redirect non-admin users
      logger.debug('[AdminLayout] User lacks admin role, redirecting to dashboard');
      router.push('/dashboard');
      return;
    }
    
    // Force admin mode
    logger.debug('[AdminLayout] Forcing admin mode');
    const success = forceAdminMode();
    
    if (!success) {
      logger.warn('[AdminLayout] Failed to force admin mode, user may not have correct admin privileges');
    }
    
    // Log navigation information
    logger.debug('[AdminLayout] Admin navigation active', {
      path: window.location.pathname,
      adminFeatures: ADMIN_FEATURES.map(f => f.id)
    });
  }, [isAuthenticated, isLoading, hasRole, router, user]);
  
  // If still loading or not initiated, show loading state
  if (isLoading || !isInitialized) {
    return <div className="flex items-center justify-center min-h-screen">Loading admin interface...</div>;
  }
  
  // If not authenticated, the AppLayout will handle the redirection
  if (!isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Please log in to access admin features...</div>;
  }
  
  // Check for admin access
  const hasAdminAccess = hasRole('ADMIN') || hasRole('PER_ADMIN');
  
  // If not admin, show loading while redirecting
  if (!hasAdminAccess) {
    return <div className="flex items-center justify-center min-h-screen">Redirecting to dashboard...</div>;
  }

  return (
    <AppLayout 
      requireAuth={true} 
      appName="Admin Portal" 
      features={ADMIN_FEATURES}
      forceAdminMode={true}
      showSidebar={true}
    >
      {children}
    </AppLayout>
  );
}