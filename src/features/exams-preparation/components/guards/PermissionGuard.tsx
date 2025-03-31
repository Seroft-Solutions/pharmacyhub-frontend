/**
 * Permission Guard Component
 * 
 * This component controls access to functionality based on user permissions.
 * It leverages the core RBAC module for permission checks.
 */

import React, { ReactNode } from 'react';
import { usePermissions } from '@/core/rbac/hooks';
import { ErrorState, LoadingState } from '../atoms';

interface PermissionGuardProps {
  permission: string | string[];
  children: ReactNode;
  fallback?: ReactNode;
  loadingComponent?: ReactNode;
}

/**
 * Guard component that checks if user has the required permission(s)
 * Uses the core RBAC hooks for consistent permission checking
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  children,
  fallback,
  loadingComponent = <LoadingState message="Checking permissions..." />
}) => {
  const { hasPermission, checkPermissions, isLoading } = usePermissions();

  // Handle loading state
  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  // Check for multiple permissions if array is provided
  if (Array.isArray(permission)) {
    const hasAllPermissions = checkPermissions(permission);
    if (!hasAllPermissions) {
      return <>{fallback || <ErrorState message="You don't have permission to access this content." />}</>;
    }
    return <>{children}</>;
  }

  // Check for single permission
  if (!hasPermission(permission)) {
    return <>{fallback || <ErrorState message="You don't have permission to access this content." />}</>;
  }

  return <>{children}</>;
};

export default PermissionGuard;
