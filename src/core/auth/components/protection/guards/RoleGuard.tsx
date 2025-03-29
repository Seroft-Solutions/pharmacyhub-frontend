/**
 * Role-based Guard Component
 * 
 * Protects routes by checking if a user has the required roles.
 * This component only focuses on role-based access control.
 */
import React, { useMemo } from 'react';
import { useAuth } from '../../../hooks';
import { hasRequiredItems } from '../../../utils/rbacUtils';

// Define the component props
interface RoleGuardProps {
  /** The protected content to render if access is granted */
  children: React.ReactNode;
  /** Content to render if access is denied */
  fallback?: React.ReactNode;
  
  // Required roles for access
  /** Array of roles required for access */
  requiredRoles: string[];
  /** If true, user must have all roles; if false, any role is sufficient */
  requireAll?: boolean;
}

/**
 * Component that checks if the user has the required roles
 * 
 * This component is responsible only for role-based authorization,
 * independent of authentication or permission checks.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ 
  children, 
  fallback = null,
  requiredRoles,
  requireAll = false
}) => {
  const { user } = useAuth();
  
  // Check if user has the required roles
  const hasRequiredRoles = useMemo(() => {
    return hasRequiredItems(
      user?.roles,
      requiredRoles,
      requireAll
    );
  }, [user?.roles, requiredRoles, requireAll]);

  // Show content based on access status
  return hasRequiredRoles ? <>{children}</> : <>{fallback}</>;
};

export default RoleGuard;
