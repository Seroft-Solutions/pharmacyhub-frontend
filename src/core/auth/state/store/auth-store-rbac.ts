/**
 * Auth Store RBAC Helpers
 * 
 * Role-Based Access Control helpers for the auth store.
 */
import { StoreApi } from 'zustand';
import { AuthState } from './auth-store-types';

// DEV_CONFIG for development mode
const DEV_CONFIG = {
  bypassAuth: process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true'
};

/**
 * Create RBAC helper functions for the auth store
 * 
 * @param get - Zustand get function
 * @returns RBAC helper functions
 */
export const createRbacHelpers = (get: StoreApi<AuthState>['getState']) => ({
  /**
   * Check if the user has a specific role
   */
  hasRole: (role: string): boolean => {
    // In development mode with auth bypass, assume all roles
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      return true;
    }
    
    const { user } = get();
    if (!user || !user.roles) return false;
    
    return user.roles.some(r => r === role);
  },
  
  /**
   * Check if the user has a specific permission
   */
  hasPermission: (permission: string): boolean => {
    // In development mode with auth bypass, assume all permissions
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      return true;
    }
    
    const { user } = get();
    if (!user || !user.permissions) return false;
    
    return user.permissions.some(p => p === permission);
  },
  
  /**
   * Check if the user has access based on roles and permissions
   */
  hasAccess: (roles: string[] = [], permissions: string[] = []): boolean => {
    // In development mode with auth bypass, assume all access
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      return true;
    }
    
    // If both roles and permissions are empty, no access required
    if (roles.length === 0 && permissions.length === 0) return true;
    
    // Check roles first if specified
    if (roles.length > 0) {
      const hasRequiredRole = roles.some(role => get().hasRole(role));
      if (hasRequiredRole) return true;
    }
    
    // Then check permissions if specified
    if (permissions.length > 0) {
      const hasRequiredPermission = permissions.some(permission => 
        get().hasPermission(permission)
      );
      if (hasRequiredPermission) return true;
    }
    
    // No matching roles or permissions
    return false;
  }
});
