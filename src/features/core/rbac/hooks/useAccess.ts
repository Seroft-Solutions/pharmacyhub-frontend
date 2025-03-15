/**
 * Access Control Hook
 * Provides client-side RBAC functions
 */
import { useCallback } from 'react';
import { useAuth } from '../../auth';
import { rbacService } from '../api';
import type { AccessCheckOptions, RoleCheckOptions } from '../types';

/**
 * Hook providing functions to check user's permissions and roles
 */
export function useAccess() {
  const { user } = useAuth();
  
  /**
   * Check if user has a specific permission
   */
  const hasPermission = useCallback((permission: string, options?: RoleCheckOptions) => {
    // If no user or no permissions, deny access
    if (!user || !user.permissions) return false;
    
    // If client-side check is sufficient, return result immediately
    if (!options?.verifyOnBackend) {
      return user.permissions.includes(permission);
    }
    
    // Otherwise, verification will need to be done at the component level
    // using the RBAC API service
    return false;
  }, [user]);
  
  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback((role: string, options?: RoleCheckOptions) => {
    // If no user or no roles, deny access
    if (!user || !user.roles) return false;
    
    // If client-side check is sufficient, return result immediately
    if (!options?.verifyOnBackend) {
      return user.roles.includes(role);
    }
    
    // Otherwise, verification will need to be done at the component level
    // using the RBAC API service
    return false;
  }, [user]);
  
  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = useCallback((roles: string[], options?: RoleCheckOptions) => {
    if (!user || !user.roles || roles.length === 0) return false;
    
    if (!options?.verifyOnBackend) {
      return roles.some(role => user.roles.includes(role));
    }
    
    return false;
  }, [user]);
  
  /**
   * Check if user has all of the specified roles
   */
  const hasAllRoles = useCallback((roles: string[], options?: RoleCheckOptions) => {
    if (!user || !user.roles || roles.length === 0) return false;
    
    if (!options?.verifyOnBackend) {
      return roles.every(role => user.roles.includes(role));
    }
    
    return false;
  }, [user]);
  
  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = useCallback((permissions: string[], options?: RoleCheckOptions) => {
    if (!user || !user.permissions || permissions.length === 0) return false;
    
    if (!options?.verifyOnBackend) {
      return permissions.some(permission => user.permissions.includes(permission));
    }
    
    return false;
  }, [user]);
  
  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = useCallback((permissions: string[], options?: RoleCheckOptions) => {
    if (!user || !user.permissions || permissions.length === 0) return false;
    
    if (!options?.verifyOnBackend) {
      return permissions.every(permission => user.permissions.includes(permission));
    }
    
    return false;
  }, [user]);
  
  /**
   * Check complex access conditions (roles and/or permissions)
   */
  const hasAccess = useCallback((
    roles: string[] = [], 
    permissions: string[] = [],
    options?: AccessCheckOptions
  ) => {
    if (!user) return false;
    
    // Early return if no conditions provided
    if (roles.length === 0 && permissions.length === 0) return false;
    
    // If backend verification is required, component should handle that case
    if (options?.verifyOnBackend) return false;
    
    const requireAll = options?.requireAll ?? true;
    
    // Check roles
    let roleCheck = false;
    if (roles.length > 0) {
      roleCheck = requireAll
        ? hasAllRoles(roles)
        : hasAnyRole(roles);
    }
    
    // Check permissions
    let permissionCheck = false;
    if (permissions.length > 0) {
      permissionCheck = requireAll
        ? hasAllPermissions(permissions)
        : hasAnyPermission(permissions);
    }
    
    // Determine final result based on whether roles, permissions, or both were checked
    if (roles.length > 0 && permissions.length > 0) {
      // If both are checked, merge results according to requireAll
      return requireAll
        ? (roleCheck && permissionCheck)
        : (roleCheck || permissionCheck);
    } else if (roles.length > 0) {
      // Only roles were checked
      return roleCheck;
    } else {
      // Only permissions were checked
      return permissionCheck;
    }
  }, [user, hasAllRoles, hasAnyRole, hasAllPermissions, hasAnyPermission]);
  
  /**
   * Verify access on the backend
   */
  const verifyAccess = async (
    roles: string[] = [], 
    permissions: string[] = [],
    requireAll: boolean = true
  ) => {
    try {
      const response = await rbacService.checkAccess(roles, permissions, requireAll);
      return response.data || false;
    } catch (error) {
      console.error('Error verifying access:', error);
      return false;
    }
  };
  
  /**
   * Verify permissions on the backend
   */
  const verifyPermissions = async (permissions: string[]) => {
    try {
      const response = await rbacService.checkPermissions(permissions);
      return response.data || {};
    } catch (error) {
      console.error('Error verifying permissions:', error);
      return {};
    }
  };
  
  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasAnyPermission,
    hasAllPermissions,
    hasAccess,
    verifyAccess,
    verifyPermissions
  };
}
