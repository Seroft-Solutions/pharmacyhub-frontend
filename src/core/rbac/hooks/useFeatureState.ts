/**
 * useFeatureState Hook
 * 
 * Custom hook that provides feature flag and access functionality
 */
import { useMemo } from 'react';
import { featureAccessService } from '../services/featureAccessService';
import { featureFlagService } from '../services/featureFlagService';
import { AccessCheckOptions } from '../types';
import { FeatureContextType } from '../contexts/FeatureContext';

/**
 * Hook that provides feature flag and access methods
 * @returns Feature context value
 */
export function useFeatureState(): FeatureContextType {
  // Create the context value with memoization
  return useMemo<FeatureContextType>(() => ({
    /**
     * Check if a feature is enabled
     * @param featureId Feature ID to check
     * @returns True if the feature is enabled
     */
    isFeatureEnabled: (featureId: string) => {
      return featureFlagService.isFeatureEnabled(featureId);
    },
    
    /**
     * Check if a user has access to a feature
     * @param featureId Feature ID to check
     * @param options Access check options
     * @returns True if the user has access
     */
    hasFeatureAccess: (featureId: string, options?: AccessCheckOptions) => {
      return featureAccessService.hasFeatureAccess(featureId, options);
    }
  }), []);
}

export default useFeatureState;