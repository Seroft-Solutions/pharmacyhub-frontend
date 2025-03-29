/**
 * PermissionGuard Component
 * 
 * A component that conditionally renders content based on permission checks
 */
import React, { ReactNode } from 'react';
import { Permission, PermissionCheckOptions } from '../types';
import { usePermissions } from '../hooks/usePermissions';
import BaseGuard from './BaseGuard';

/**
 * Props for the PermissionGuard component
 */
interface PermissionGuardProps {
  /**
   * Required permissions to render the children
   */
  permissions: Permission | Permission[];
  
  /**
   * Permission check options
   */
  options?: PermissionCheckOptions;
  
  /**
   * Content to render when permission check passes
   */
  children: ReactNode;
  
  /**
   * Content to render when permission check fails (optional)
   */
  fallback?: ReactNode;
  
  /**
   * Whether to render nothing when permission check fails
   * @default false
   */
  renderNothing?: boolean;
}

/**
 * Component that conditionally renders content based on permission checks
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permissions,
  options,
  children,
  fallback,
  renderNothing = false,
}) => {
  // Normalize permissions to array
  const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
  
  // Check permissions
  const { hasPermission, isLoading, error } = usePermissions(permissionsArray, options);
  
  // Use the BaseGuard component for rendering logic
  return (
    <BaseGuard
      hasAccess={hasPermission}
      isLoading={isLoading}
      error={error}
      fallback={fallback}
      renderNothing={renderNothing}
    >
      {children}
    </BaseGuard>
  );
};

export default PermissionGuard;