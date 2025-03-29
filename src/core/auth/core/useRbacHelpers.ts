/**
 * RBAC Helpers Hook
 * 
 * Custom hook providing role and permission-based access control helper functions.
 */
import { useCallback } from 'react';
import { UserProfile } from '../types';
import { DEV_CONFIG } from '../constants/config';

/**
 * Hook for creating RBAC helper functions based on a user profile
 * 
 * @param user - The current user profile or null if not authenticated
 * @returns Object with RBAC helper functions
 */
export const useRbacHelpers = (user: UserProfile | null) => {
  /**
   * Check if the user has a specific role
   */
  const hasRole = useCallback((role: string): boolean => {
    // In development mode with auth bypass, assume all roles for convenience
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      return true;
    }
    
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  }, [user]);
  
  /**
   * Check if the user has a specific permission
   */
  const hasPermission = useCallback((permission: string): boolean => {
    // In development mode with auth bypass, assume all permissions for convenience
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      return true;
    }
    
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  }, [user]);
  
  /**
   * Check if the user has access based on roles and permissions
   */
  const hasAccess = useCallback((roles: string[] = [], permissions: string[] = []): boolean => {
    // In development mode with auth bypass, assume all access for convenience
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      return true;
    }
    
    if (!user) return false;
    
    // If no roles or permissions specified, deny access
    if (roles.length === 0 && permissions.length === 0) return false;
    
    // Check roles
    const hasRequiredRole = roles.length === 0 || roles.some(role => hasRole(role));
    
    // Check permissions
    const hasRequiredPermission = permissions.length === 0 || 
      permissions.some(permission => hasPermission(permission));
      
    // User must satisfy both role and permission requirements
    return hasRequiredRole && hasRequiredPermission;
  }, [user, hasRole, hasPermission]);

  return {
    hasRole,
    hasPermission,
    hasAccess
  };
};

export default useRbacHelpers;
