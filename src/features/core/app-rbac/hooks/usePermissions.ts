/**
 * Custom hook for checking user permissions
 */
import { useAuth } from '@/features/core/app-auth/hooks';
import { useEffect, useState } from 'react';
import { logger } from '@/shared/lib/logger';

type Permission = string;
type Role = string;

export function usePermissions() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  // Initialize permissions and roles when user changes
  useEffect(() => {
    if (user) {
      // Normalize roles to uppercase for consistency
      const normalizedRoles = (user.roles || []).map(
        r => typeof r === 'string' ? r.toUpperCase() : r
      );
      
      logger.debug('[usePermissions] Initializing with user data', {
        userId: user.id,
        email: user.email,
        originalRoles: user.roles,
        normalizedRoles,
        permissions: user.permissions
      });
      
      setPermissions(user.permissions || []);
      setRoles(normalizedRoles);
    } else {
      logger.debug('[usePermissions] No user data, resetting permissions and roles');
      setPermissions([]);
      setRoles([]);
    }
  }, [user]);

  // Check if the user has a specific permission
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    
    // Check direct permissions
    if (permissions.includes(permission)) {
      logger.debug(`[usePermissions] User has permission: ${permission}`);
      return true;
    }
    
    // Admin role has all permissions
    if (roles.includes('ADMIN')) {
      logger.debug(`[usePermissions] User has ADMIN role, granting permission: ${permission}`);
      return true;
    }
    
    logger.debug(`[usePermissions] User lacks permission: ${permission}`);
    return false;
  };

  // Check if the user has all specified permissions
  const hasAllPermissions = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.every(permission => hasPermission(permission));
  };

  // Check if the user has any of the specified permissions
  const hasAnyPermission = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.some(permission => hasPermission(permission));
  };

  // Check if the user has a specific role
  const hasRole = (role: Role): boolean => {
    if (!user) return false;
    
    // Normalize the provided role for case-insensitive comparison
    const normalizedRole = typeof role === 'string' ? role.toUpperCase() : role;
    
    // Check if the normalized role is in the user's roles
    const hasTheRole = roles.includes(normalizedRole);
    
    logger.debug(`[usePermissions] Checking role: ${role} (normalized: ${normalizedRole})`, {
      hasRole: hasTheRole,
      userRoles: roles
    });
    
    return hasTheRole;
  };

  // Check if the user has all specified roles
  const hasAllRoles = (requiredRoles: Role[]): boolean => {
    return requiredRoles.every(role => hasRole(role));
  };

  // Check if the user has any of the specified roles
  const hasAnyRole = (requiredRoles: Role[]): boolean => {
    return requiredRoles.some(role => hasRole(role));
  };

  // Does the user have admin access - convenience method
  const isAdmin = hasRole('ADMIN') || hasRole('PER_ADMIN');
  
  // Does the user have manager access - convenience method
  const isManager = isAdmin || hasRole('MANAGER') || hasRole('PHARMACY_MANAGER');

  // Check access based on permissions, roles, or both
  const hasAccess = ({
    permissions: requiredPermissions = [],
    roles: requiredRoles = [],
    requireAll = true
  }: {
    permissions?: Permission[],
    roles?: Role[],
    requireAll?: boolean
  }): boolean => {
    // If no permissions or roles required, grant access
    if (requiredPermissions.length === 0 && requiredRoles.length === 0) {
      return true;
    }
    
    // Check permissions
    const hasPermissions = requiredPermissions.length === 0 || 
      (requireAll 
        ? hasAllPermissions(requiredPermissions)
        : hasAnyPermission(requiredPermissions));
    
    // Check roles
    const hasRoles = requiredRoles.length === 0 || 
      (requireAll 
        ? hasAllRoles(requiredRoles)
        : hasAnyRole(requiredRoles));
    
    // Debug log the access check
    logger.debug('[usePermissions] Access check', {
      requiredPermissions,
      requiredRoles,
      requireAll,
      hasPermissions,
      hasRoles,
      result: requireAll ? (hasPermissions && hasRoles) : (hasPermissions || hasRoles)
    });
    
    // Combine results based on requireAll flag
    return requireAll 
      ? (hasPermissions && hasRoles)
      : (hasPermissions || hasRoles);
  };

  return {
    permissions,
    roles,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    hasRole,
    hasAllRoles,
    hasAnyRole,
    isAdmin,
    isManager,
    hasAccess
  };
}