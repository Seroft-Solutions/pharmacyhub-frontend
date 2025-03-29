/**
 * useFeatureFlag Hook
 * 
 * Custom hook for checking feature flags in components
 */
import { useMemo } from 'react';
import { FeatureFlagCheckResult, FeatureFlagOptions } from '../types';
import { featureFlagService } from '../services/featureFlagService';
import { safeExecute } from '../utils/errorUtils';

/**
 * Hook to check if a feature is enabled
 * @param featureId Feature ID to check
 * @param options Optional feature flag options
 * @returns Feature flag check result
 */
export function useFeatureFlag(
  featureId: string,
  options: FeatureFlagOptions = {}
): FeatureFlagCheckResult {
  // Check if the feature flag service is initialized
  const isInitialized = featureFlagService.isServiceInitialized();
  
  return useMemo(() => {
    // If the service isn't initialized, return loading state
    if (!isInitialized) {
      return {
        isEnabled: options.fallbackValue ?? false,
        isLoading: true,
        error: null
      };
    }
    
    // Execute feature flag check with error handling
    const result = safeExecute(
      () => featureFlagService.isFeatureEnabled(featureId, options),
      `Failed to check feature flag: ${featureId}`
    );
    
    // If throwOnError is true and there's an error, let it propagate
    if (result.error && options.throwOnError) {
      throw result.error;
    }
    
    return {
      isEnabled: result.data ?? options.fallbackValue ?? false,
      isLoading: false,
      error: result.error
    };
  }, [featureId, isInitialized, options]);
}

export default useFeatureFlag;