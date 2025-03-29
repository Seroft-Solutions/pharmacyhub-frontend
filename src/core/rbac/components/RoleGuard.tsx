/**
 * RoleGuard Component
 * 
 * A component that conditionally renders content based on role checks
 */
import React, { ReactNode } from 'react';
import { Role } from '../types';
import { useRoles } from '../hooks/useRoles';
import BaseGuard from './BaseGuard';

/**
 * Props for the RoleGuard component
 */
interface RoleGuardProps {
  /**
   * Required roles to render the children
   */
  roles: Role | Role[];
  
  /**
   * Role check options
   */
  options?: {
    /**
     * Whether to throw an error if the role check fails
     */
    throwOnError?: boolean;
    
    /**
     * Whether to check role inheritance
     */
    checkInheritance?: boolean;
    
    /**
     * If true, require all roles to pass the check
     */
    all?: boolean;
  };
  
  /**
   * Content to render when role check passes
   */
  children: ReactNode;
  
  /**
   * Content to render when role check fails (optional)
   */
  fallback?: ReactNode;
  
  /**
   * Whether to render nothing when role check fails
   * @default false
   */
  renderNothing?: boolean;
}

/**
 * Component that conditionally renders content based on role checks
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  roles,
  options,
  children,
  fallback,
  renderNothing = false,
}) => {
  // Normalize roles to array
  const rolesArray = Array.isArray(roles) ? roles : [roles];
  
  // Check roles
  const { hasPermission: hasRole, isLoading, error } = useRoles(rolesArray, options);
  
  // Use the BaseGuard component for rendering logic
  return (
    <BaseGuard
      hasAccess={hasRole}
      isLoading={isLoading}
      error={error}
      fallback={fallback}
      renderNothing={renderNothing}
    >
      {children}
    </BaseGuard>
  );
};

export default RoleGuard;