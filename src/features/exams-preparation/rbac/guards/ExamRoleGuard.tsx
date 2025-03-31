/**
 * ExamRoleGuard Component
 * 
 * A component that conditionally renders content based on user roles for the exams feature.
 * This is a wrapper around the core RoleGuard that provides exam-specific enhancements.
 */
import React, { ReactNode } from 'react';
import { RoleGuard } from '@/core/rbac/components';
import { AccessDenied } from '@/core/rbac/components';

/**
 * User roles for the exams feature
 */
export type ExamRole = 'admin' | 'instructor' | 'student';

/**
 * Props for the ExamRoleGuard component
 */
interface ExamRoleGuardProps {
  /**
   * The roles that are allowed to view the content
   */
  roles: ExamRole | ExamRole[];
  
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
  
  /**
   * Optional loading component
   */
  loadingComponent?: ReactNode;
}

/**
 * Component that conditionally renders content based on user roles for exams
 */
export const ExamRoleGuard: React.FC<ExamRoleGuardProps> = ({
  roles,
  children,
  fallback,
  renderNothing = false,
  loadingComponent,
}) => {
  // Normalize roles to array
  const rolesArray = Array.isArray(roles) ? roles : [roles];
  
  // Default fallback if none provided
  const defaultFallback = fallback || (
    <AccessDenied 
      message={`You don't have the required role to access this feature. Required: ${rolesArray.join(', ')}`}
    />
  );
  
  // Use the core RoleGuard
  return (
    <RoleGuard
      roles={rolesArray}
      fallback={loadingComponent ? defaultFallback : defaultFallback}
      renderNothing={renderNothing}
    >
      {children}
    </RoleGuard>
  );
};

export default ExamRoleGuard;
