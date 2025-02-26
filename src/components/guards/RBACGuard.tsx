"use client";

import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Permission, Role } from '@/types/auth';

interface RBACGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  roles?: Role[];
  permissions?: Permission[];
  requireAll?: boolean;
}

/**
 * RBAC Guard component for role and permission-based access control
 * 
 * @param children - Content to render if user has required access
 * @param fallback - Content to render if user doesn't have required access
 * @param roles - Array of roles required for access
 * @param permissions - Array of permissions required for access
 * @param requireAll - If true, requires all roles/permissions; if false, any one is sufficient
 */
export const RBACGuard: React.FC<RBACGuardProps> = ({
  children,
  fallback = null,
  roles,
  permissions,
  requireAll = false
}) => {
  const { user, hasRole, hasPermission } = useAuth();
  
  if (!user) {
    return fallback;
  }
  
  // No restrictions specified - allow access
  if (!roles?.length && !permissions?.length) {
    return <>{children}</>;
  }
  
  let hasAccess = false;
  
  if (requireAll) {
    // User must have all specified roles and permissions
    const hasAllRoles = !roles?.length || roles.every(role => hasRole(role));
    const hasAllPermissions = !permissions?.length || permissions.every(permission => hasPermission(permission));
    hasAccess = hasAllRoles && hasAllPermissions;
  } else {
    // User must have at least one of the specified roles or permissions
    const hasAnyRole = roles?.some(role => hasRole(role)) ?? false;
    const hasAnyPermission = permissions?.some(permission => hasPermission(permission)) ?? false;
    hasAccess = (roles?.length ? hasAnyRole : true) && (permissions?.length ? hasAnyPermission : true);
  }
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default RBACGuard;