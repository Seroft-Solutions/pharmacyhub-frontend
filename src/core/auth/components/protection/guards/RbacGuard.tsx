/**
 * RBAC Guard Component
 * 
 * Combines role and permission checks for comprehensive RBAC protection.
 * This component focuses solely on role-based and permission-based access control.
 */
import React from 'react';
import { RoleGuard } from './RoleGuard';
import { PermissionGuard } from './PermissionGuard';

// Define the component props
interface RbacGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRoles: string[];
  requiredPermissions: string[];
  requireAll: boolean;
}

/**
 * Component that handles combined RBAC (role and permission) checks
 * 
 * @param children - The protected content to render if access is granted
 * @param fallback - Content to render if access is denied (default: null)
 * @param requiredRoles - Array of roles required for access
 * @param requiredPermissions - Array of permissions required for access
 * @param requireAll - Whether to require all roles/permissions or just one
 */
export const RbacGuard: React.FC<RbacGuardProps> = ({
  children,
  fallback = null,
  requiredRoles,
  requiredPermissions,
  requireAll
}) => {
  // Skip RBAC checks if no roles or permissions are required
  if (requiredRoles.length === 0 && requiredPermissions.length === 0) {
    return <>{children}</>;
  }

  return (
    <RoleGuard 
      requiredRoles={requiredRoles} 
      requireAll={requireAll}
      fallback={fallback}
    >
      <PermissionGuard
        requiredPermissions={requiredPermissions}
        requireAll={requireAll}
        fallback={fallback}
      >
        {children}
      </PermissionGuard>
    </RoleGuard>
  );
};

export default RbacGuard;
