"use client";

import { useEffect } from 'react';
import { useSession } from '@/features/core/auth/hooks';
import { useRoleStore } from '../store/roleStore';
import { logger } from '@/shared/lib/logger';

/**
 * AppManager - Component for managing global application state
 * 
 * This component doesn't render any UI but handles:
 * 1. Synchronization between authentication and role state
 * 2. Maintains consistent state across page loads and refreshes
 * 
 * Completely rebuilt to use Zustand for state management
 */
export function AppManager() {
  const { user, isAuthenticated, isLoading } = useSession();
  const { initializeRoles, resetRoles } = useRoleStore();

  // Handle authentication state changes
  useEffect(() => {
    // Skip during SSR
    if (typeof window === 'undefined') return;
    
    // Wait for auth to finish loading
    if (isLoading) return;
    
    // If user is authenticated and we have user data, initialize roles
    if (isAuthenticated && user) {
      logger.debug('[AppManager] User authenticated, initializing roles', {
        username: user.username || user.email,
        roles: user.roles
      });
      
      // Initialize roles from user object
      if (user.roles) {
        // Force uppercase for role names to ensure consistency
        const normalizedRoles = user.roles.map(r => typeof r === 'string' ? r.toUpperCase() : r);
        
        logger.debug('[AppManager] Normalized roles', { 
          originalRoles: user.roles,
          normalizedRoles 
        });
        
        // Look for admin role
        const hasAdminRole = normalizedRoles.includes('ADMIN') || normalizedRoles.includes('PER_ADMIN');
        
        // Initialize roles
        initializeRoles(normalizedRoles);
        
        // Force admin mode if admin role exists
        if (hasAdminRole) {
          logger.debug('[AppManager] User has ADMIN role, forcing admin mode and redirecting');
          
          // Use the Zustand store to force admin role
          const roleStore = require('../store/roleStore');
          roleStore.forceAdminMode();
          
          // Check if we're not already on an admin page
          if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin')) {
            logger.debug('[AppManager] Redirecting to admin dashboard from', { 
              currentPath: window.location.pathname 
            });
            // Force a full page reload to ensure all state is reset
            window.location.href = '/admin/dashboard';
          }
        }
      }
    } else if (!isAuthenticated) {
      // If user is not authenticated, reset roles
      logger.debug('[AppManager] User not authenticated, resetting roles');
      resetRoles();
    }
  }, [isAuthenticated, isLoading, user, initializeRoles, resetRoles]);

  // This component doesn't render anything
  return null;
}

export default AppManager;