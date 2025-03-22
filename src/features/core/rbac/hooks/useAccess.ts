/**
 * Access Control Hook
 * Provides client-side RBAC functions
 */
import { useCallback } from 'react';
import { useAuth } from '../../auth';
import { rbacService } from '../api';
import { logger } from '@/shared/lib/logger';
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
      // Check if user has the permission
      const result = user.permissions.includes(permission);
      
      logger.debug(`[useAccess] Permission check: ${permission}`, {
        result,
        userPermissions: user.permissions
      });
      
      return result;
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
      // Normalize the user's roles to uppercase
      const normalizedUserRoles = user.roles.map(r => 
        typeof r === 'string' ? r.toUpperCase() : r
      );
      
      // Normalize the requested role to uppercase for case-insensitive comparison
      const normalizedRole = typeof role === 'string' ? role.toUpperCase() : role;
      
      // Check if the user has the role
      const result = normalizedUserRoles.includes(normalizedRole);
      
      logger.debug(`[useAccess] Role check: ${role} (normalized: ${normalizedRole})`, {
        result,
        userRoles: user.roles,
        normalizedUserRoles
      });
      
      return result;
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
      // Normalize the user's roles to uppercase
      const normalizedUserRoles = user.roles.map(r => 
        typeof r === 'string' ? r.toUpperCase() : r
      );
      
      // Check if the user has any of the specified roles
      const result = roles.some(role => {
        // Normalize the requested role for case-insensitive comparison
        const normalizedRole = typeof role === 'string' ? role.toUpperCase() : role;
        return normalizedUserRoles.includes(normalizedRole);
      });
      
      logger.debug('[useAccess] hasAnyRole check', {
        result,
        requestedRoles: roles,
        userRoles: user.roles
      });
      
      return result;
    }
    
    return false;
  }, [user]);
  
  /**
   * Check if user has all of the specified roles
   */
  const hasAllRoles = useCallback((roles: string[], options?: RoleCheckOptions) => {
    if (!user || !user.roles || roles.length === 0) return false;
    
    if (!options?.verifyOnBackend) {
      // Normalize the user's roles to uppercase
      const normalizedUserRoles = user.roles.map(r => 
        typeof r === 'string' ? r.toUpperCase() : r
      );
      
      // Check if the user has all of the specified roles
      const result = roles.every(role => {
        // Normalize the requested role for case-insensitive comparison
        const normalizedRole = typeof role === 'string' ? role.toUpperCase() : role;
        return normalizedUserRoles.includes(normalizedRole);
      });
      
      logger.debug('[useAccess] hasAllRoles check', {
        result,
        requestedRoles: roles,
        userRoles: user.roles
      });
      
      return result;
    }
    
    return false;
  }, [user]);
  
  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = useCallback((permissions: string[], options?: RoleCheckOptions) => {
    if (!user || !user.permissions || permissions.length === 0) return false;
    
    if (!options?.verifyOnBackend) {
      const result = permissions.some(permission => user.permissions.includes(permission));
      
      logger.debug('[useAccess] hasAnyPermission check', {
        result,
        requestedPermissions: permissions,
        userPermissions: user.permissions
      });
      
      return result;
    }
    
    return false;
  }, [user]);
  
  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = useCallback((permissions: string[], options?: RoleCheckOptions) => {
    if (!user || !user.permissions || permissions.length === 0) return false;
    
    if (!options?.verifyOnBackend) {
      const result = permissions.every(permission => user.permissions.includes(permission));
      
      logger.debug('[useAccess] hasAllPermissions check', {
        result,
        requestedPermissions: permissions,
        userPermissions: user.permissions
      });
      
      return result;
    }
    
    return false;
  }, [user]);
  
  /**
   * Check complex access conditions (roles and/or permissions)
   * This is a newer version with object parameter for better readability
   */
  const hasAccess = useCallback((options: {
    permissions?: string[],
    roles?: string[],
    requireAll?: boolean,
    verifyOnBackend?: boolean
  }) => {
    if (!user) return false;
    
    const { 
      permissions = [],
      roles = [],
      requireAll = true,
      verifyOnBackend = false
    } = options;
    
    // Early return if no conditions provided
    if (roles.length === 0 && permissions.length === 0) {
      logger.debug('[useAccess] No access conditions provided, granting access');
      return true;
    }
    
    // If backend verification is required, component should handle that case
    if (verifyOnBackend) {
      logger.debug('[useAccess] Backend verification requested, returning false');
      return false;
    }
    
    // Check roles
    let roleCheck = true; // Default to true if no roles to check
    if (roles.length > 0) {
      roleCheck = requireAll
        ? hasAllRoles(roles)
        : hasAnyRole(roles);
    }
    
    // Check permissions
    let permissionCheck = true; // Default to true if no permissions to check
    if (permissions.length > 0) {
      permissionCheck = requireAll
        ? hasAllPermissions(permissions)
        : hasAnyPermission(permissions);
    }
    
    // Determine final result based on whether roles, permissions, or both were checked
    let result: boolean;
    
    if (roles.length > 0 && permissions.length > 0) {
      // If both are checked, merge results according to requireAll
      result = requireAll
        ? (roleCheck && permissionCheck)
        : (roleCheck || permissionCheck);
    } else if (roles.length > 0) {
      // Only roles were checked
      result = roleCheck;
    } else {
      // Only permissions were checked
      result = permissionCheck;
    }
    
    logger.debug('[useAccess] Access check result', {
      result,
      requestedRoles: roles,
      requestedPermissions: permissions,
      requireAll,
      roleCheckResult: roleCheck,
      permissionCheckResult: permissionCheck
    });
    
    return result;
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
      logger.error('Error verifying access:', error);
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
      logger.error('Error verifying permissions:', error);
      return {};
    }
  };
  
  // Convenience property - check if user has admin role
  const isAdmin = user?.roles?.some(role => {
    const normalizedRole = typeof role === 'string' ? role.toUpperCase() : role;
    return normalizedRole === 'ADMIN' || normalizedRole === 'PER_ADMIN';
  }) || false;
  
  return {
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasAnyPermission,
    hasAllPermissions,
    hasAccess,
    verifyAccess,
    verifyPermissions,
    isAdmin
  };
}