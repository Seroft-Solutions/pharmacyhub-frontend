/**
 * Authentication guard component
 * 
 * This component protects routes by checking if a user is authenticated
 * and has the required roles or permissions.
 */
import React from 'react';
import { RouteGuard, RbacGuard } from './guards';

// Define the component props
interface RequireAuthProps {
  /** The protected content to render if access is granted */
  children: React.ReactNode;
  /** Content to render if access is denied */
  fallback?: React.ReactNode;
  /** Path to redirect to if not authenticated */
  redirectTo?: string;
  /** Optional save return URL functionality */
  saveReturnUrl?: boolean;
  
  // RBAC parameters
  /** Array of roles required for access */
  requiredRoles?: string[];
  /** Array of permissions required for access */
  requiredPermissions?: string[];
  /** Whether to require all roles/permissions or just one */
  requireAll?: boolean;
}

/**
 * Component that combines authentication, role, and permission checks
 * to protect routes with comprehensive access control.
 * 
 * This component uses a composition of specialized guards:
 * - RouteGuard: Handles authentication and redirects
 * - RbacGuard: Manages role and permission-based access
 */
export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  fallback = null,
  redirectTo = '/login',
  saveReturnUrl = true,
  requiredRoles = [],
  requiredPermissions = [],
  requireAll = true
}) => {
  // Use nested guards for clean separation of concerns
  return (
    <RouteGuard 
      fallback={fallback} 
      redirectTo={redirectTo}
      saveReturnUrl={saveReturnUrl}
    >
      <RbacGuard 
        requiredRoles={requiredRoles}
        requiredPermissions={requiredPermissions}
        requireAll={requireAll}
        fallback={fallback}
      >
        {children}
      </RbacGuard>
    </RouteGuard>
  );
};

export default RequireAuth;
