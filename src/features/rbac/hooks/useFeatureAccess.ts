/**
 * Feature Access Hook
 * 
 * Custom hook for checking feature access and feature flags
 */
import { useContext } from 'react';
import { useFeatures } from '../contexts/FeatureContext';
import { getFeature, getFeaturePermissions } from '../registry';
import { useAccess } from './useAccess';

/**
 * Hook for checking if a feature is accessible to the current user
 * Takes into account both feature flags and user permissions
 */
export function useFeatureAccess(featureId: string, options?: {
  flagId?: string;
  permissionsRequired?: string[];
  rolesRequired?: string[];
  requireAll?: boolean;
}) {
  const { 
    isFeatureEnabled, 
    isFeatureFlagEnabled,
    getFeatureInfo,
    isLoading 
  } = useFeatures();
  
  const { hasAccess } = useAccess();
  
  const { 
    flagId, 
    permissionsRequired = [], 
    rolesRequired = [],
    requireAll = true
  } = options || {};
  
  // Get the feature data
  const feature = getFeatureInfo(featureId);
  
  // Check if the feature or feature flag is enabled
  const enabled = flagId 
    ? isFeatureFlagEnabled(featureId, flagId) 
    : isFeatureEnabled(featureId);
  
  // If no specific permissions/roles provided, use the feature's default required roles
  const effectiveRoles = rolesRequired.length > 0 
    ? rolesRequired 
    : (feature?.requiredRoles || []);
    
  // Check if the user has the required permissions and roles
  const hasRequiredAccess = hasAccess(
    effectiveRoles,
    permissionsRequired,
    { requireAll }
  );
  
  // Feature is accessible if it's enabled and the user has the required access
  const canAccess = enabled && hasRequiredAccess;
  
  return {
    canAccess,    // Can the user access the feature
    isEnabled: enabled,    // Is the feature turned on
    hasPermissions: hasRequiredAccess,  // Does the user have the required permissions
    feature,      // The feature data
    isLoading     // Is the feature system still loading
  };
}
