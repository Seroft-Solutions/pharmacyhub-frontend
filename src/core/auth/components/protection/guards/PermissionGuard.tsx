/**
 * Permission-based Guard Component
 * 
 * Protects routes by checking if a user has the required permissions.
 * This component only focuses on permission-based access control.
 */
import React, { useMemo } from 'react';
import { useAuth } from '../../../hooks';
import { hasRequiredItems } from '../../../utils/rbacUtils';

// Define the component props
interface PermissionGuardProps {
  /** The protected content to render if access is granted */
  children: React.ReactNode;
  /** Content to render if access is denied */
  fallback?: React.ReactNode;
  
  // Required permissions for access
  /** Array of permissions required for access */
  requiredPermissions: string[];
  /** If true, user must have all permissions; if false, any permission is sufficient */
  requireAll?: boolean;
}

/**
 * Component that checks if the user has the required permissions
 * 
 * This component is responsible only for permission-based authorization,
 * independent of authentication or role checks.
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  children, 
  fallback = null,
  requiredPermissions,
  requireAll = false
}) => {
  const { user } = useAuth();
  
  // Check if user has the required permissions
  const hasRequiredPermissions = useMemo(() => {
    return hasRequiredItems(
      user?.permissions,
      requiredPermissions,
      requireAll
    );
  }, [user?.permissions, requiredPermissions, requireAll]);

  // Show content based on access status
  return hasRequiredPermissions ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGuard;
