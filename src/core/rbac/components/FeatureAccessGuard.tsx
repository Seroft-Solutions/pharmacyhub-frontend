/**
 * FeatureAccessGuard Component
 * 
 * A component that conditionally renders content based on feature access checks
 */
import React, { ReactNode } from 'react';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import { AccessCheckOptions } from '../types';
import BaseGuard from './BaseGuard';

/**
 * Props for the FeatureAccessGuard component
 */
interface FeatureAccessGuardProps {
  /**
   * Feature ID to check access for
   */
  featureId: string;
  
  /**
   * Access check options
   */
  options?: AccessCheckOptions;
  
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
 * Component that conditionally renders content based on feature access checks
 */
export const FeatureAccessGuard: React.FC<FeatureAccessGuardProps> = ({
  featureId,
  options,
  children,
  fallback,
  renderNothing = false,
}) => {
  // Check feature access
  const { hasAccess, isLoading, error } = useFeatureAccess(featureId, options);
  
  // Use the BaseGuard component for rendering logic
  return (
    <BaseGuard
      hasAccess={hasAccess}
      isLoading={isLoading}
      error={error}
      fallback={fallback}
      renderNothing={renderNothing}
    >
      {children}
    </BaseGuard>
  );
};

export default FeatureAccessGuard;