/**
 * useFeatureAccess Hook
 * 
 * Custom hook for checking feature access in components
 */
import { useMemo } from 'react';
import { AccessCheckOptions, FeatureAccessResult } from '../types';
import { useFeatures } from '../contexts/FeatureContext';
import { useRBAC } from '../hooks/useRBAC';
import { createFeatureAccessDeniedError } from '../utils/featureErrors';
import { safeExecute } from '../utils/errorUtils';

/**
 * Hook to check if the current user has access to a feature
 * @param featureId Feature ID to check
 * @param options Optional access check options
 * @returns Feature access check result
 */
export function useFeatureAccess(
  featureId: string,
  options: AccessCheckOptions = {}
): FeatureAccessResult {
  const { hasFeatureAccess } = useFeatures();
  const { isInitialized, isLoading } = useRBAC();
  
  return useMemo(() => {
    // If we're still loading or not initialized, return loading state
    if (!isInitialized || isLoading) {
      return {
        hasAccess: false,
        isLoading: true,
        error: null
      };
    }
    
    // Execute feature access check with error handling
    const result = safeExecute(
      () => {
        // Check if the user has access to the feature
        const accessResult = hasFeatureAccess(featureId, options);
        
        // If access check fails and throwOnError is true, throw error
        if (!accessResult && options.throwOnError) {
          throw createFeatureAccessDeniedError(featureId);
        }
        
        return accessResult;
      },
      `Failed to check feature access: ${featureId}`
    );
    
    // If throwOnError is true and there's an error, let it propagate
    if (result.error && options.throwOnError) {
      throw result.error;
    }
    
    return {
      hasAccess: result.data ?? false,
      isLoading: false,
      error: result.error
    };
  }, [featureId, hasFeatureAccess, isInitialized, isLoading, options]);
}

export default useFeatureAccess;