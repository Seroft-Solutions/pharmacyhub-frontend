/**
 * FeatureGuard Component
 * 
 * A component that conditionally renders content based on feature flag checks
 */
import React, { ReactNode } from 'react';
import { useFeatureFlag } from '../hooks/useFeatureFlag';
import { FeatureFlagOptions } from '../types';

/**
 * Props for the FeatureGuard component
 */
interface FeatureGuardProps {
  /**
   * Feature ID to check
   */
  featureId: string;
  
  /**
   * Feature flag options
   */
  options?: FeatureFlagOptions;
  
  /**
   * Content to render when feature is enabled
   */
  children: ReactNode;
  
  /**
   * Content to render when feature is disabled (optional)
   */
  fallback?: ReactNode;
  
  /**
   * Whether to render nothing when feature is disabled
   * @default false
   */
  renderNothing?: boolean;
}

/**
 * Component that conditionally renders content based on feature flag checks
 */
export const FeatureGuard: React.FC<FeatureGuardProps> = ({
  featureId,
  options,
  children,
  fallback,
  renderNothing = false,
}) => {
  // Check feature flag
  const { isEnabled, isLoading, error } = useFeatureFlag(featureId, options);
  
  // Return loading state or error state if needed
  if (isLoading || error) {
    return renderNothing ? null : fallback || null;
  }
  
  // Render children if feature is enabled, otherwise render fallback
  return isEnabled 
    ? <>{children}</> 
    : renderNothing 
      ? null 
      : <>{fallback || null}</>;
};

export default FeatureGuard;