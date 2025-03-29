/**
 * BaseGuard Component
 * 
 * A base component that provides common guard functionality for permission, role, and feature access checks
 */
import React, { ReactNode } from 'react';
import { NormalizedError } from '../utils/errorHandling';

/**
 * Props for the BaseGuard component
 */
export interface BaseGuardProps {
  /**
   * Whether access is granted based on the check
   */
  hasAccess: boolean;
  
  /**
   * Whether the access check is still loading
   */
  isLoading: boolean;
  
  /**
   * Error that occurred during the access check
   */
  error: NormalizedError | null;
  
  /**
   * Content to render when access check passes
   */
  children: ReactNode;
  
  /**
   * Content to render when access check fails (optional)
   */
  fallback?: ReactNode;
  
  /**
   * Whether to render nothing when access check fails
   * @default false
   */
  renderNothing?: boolean;
}

/**
 * Base component that conditionally renders content based on access checks
 */
export const BaseGuard: React.FC<BaseGuardProps> = ({
  hasAccess,
  isLoading,
  error,
  children,
  fallback,
  renderNothing = false,
}) => {
  // Return loading state or error state if needed
  if (isLoading || error) {
    return renderNothing ? null : fallback || null;
  }
  
  // Render children if access check passes, otherwise render fallback
  return hasAccess 
    ? <>{children}</> 
    : renderNothing 
      ? null 
      : <>{fallback || null}</>;
};

export default BaseGuard;