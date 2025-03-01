/**
 * Custom hook for checking user permissions
 */
import { useAuth } from '@/features/auth/hooks';
import { useEffect, useState } from 'react';

type Permission = string;
type Role = string;

export function usePermissions() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  // Initialize permissions and roles when user changes
  useEffect(() => {
    if (user) {
      setPermissions(user.permissions || []);
      setRoles(user.roles || []);
    } else {
      setPermissions([]);
      setRoles([]);
    }
  }, [user]);

  // Check if the user has a specific permission
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    
    // Check direct permissions
    if (permissions.includes(permission)) return true;
    
    // Admin role has all permissions
    if (roles.includes('admin')) return true;
    
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
    return roles.includes(role);
  };

  // Check if the user has all specified roles
  const hasAllRoles = (requiredRoles: Role[]): boolean => {
    return requiredRoles.every(role => hasRole(role));
  };

  // Check if the user has any of the specified roles
  const hasAnyRole = (requiredRoles: Role[]): boolean => {
    return requiredRoles.some(role => hasRole(role));
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
  };
}
