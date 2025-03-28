/**
 * Feature Access Query Hooks
 * 
 * React query hooks for the feature access API
 */
import { useApiQuery, queryKeys } from '../../../app-api-handler';
import { FEATURE_ACCESS_ENDPOINTS } from '../services/featureAccessService';
import type { FeatureAccessDTO } from '../../types/feature-access';

// Create query keys for feature access
export const featureAccessQueryKeys = {
  all: () => ['featureAccess'] as const,
  userFeatures: () => [...featureAccessQueryKeys.all(), 'userFeatures'] as const,
  feature: (featureCode: string) => [...featureAccessQueryKeys.all(), 'feature', featureCode] as const,
  operation: (featureCode: string, operation: string) => 
    [...featureAccessQueryKeys.all(), 'operation', featureCode, operation] as const,
};

/**
 * Hooks for feature access queries
 */
export const useFeatureAccessQueries = () => {
  /**
   * Hook to get all features the current user has access to
   */
  const useUserFeatures = (options = {}) => {
    return useApiQuery<FeatureAccessDTO[]>(
      featureAccessQueryKeys.userFeatures(),
      FEATURE_ACCESS_ENDPOINTS.USER_FEATURES,
      {
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options
      }
    );
  };

  /**
   * Hook to check if the current user has access to a specific feature
   */
  const useFeatureAccess = (featureCode: string, options = {}) => {
    return useApiQuery<FeatureAccessDTO>(
      featureAccessQueryKeys.feature(featureCode),
      FEATURE_ACCESS_ENDPOINTS.CHECK_FEATURE(featureCode),
      {
        enabled: !!featureCode,
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options
      }
    );
  };

  /**
   * Hook to check if the current user can perform a specific operation on a feature
   */
  const useOperationAccess = (featureCode: string, operation: string, options = {}) => {
    return useApiQuery<boolean>(
      featureAccessQueryKeys.operation(featureCode, operation),
      FEATURE_ACCESS_ENDPOINTS.CHECK_OPERATION(featureCode, operation),
      {
        enabled: !!featureCode && !!operation,
        staleTime: 5 * 60 * 1000, // 5 minutes
        ...options
      }
    );
  };

  return {
    useUserFeatures,
    useFeatureAccess,
    useOperationAccess
  };
};
