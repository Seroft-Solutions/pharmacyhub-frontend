/**
 * Feature Access Service
 * Provides API methods for feature-based access control
 */
import { createExtendedApiService } from '@/features/tanstack-query-api';
import { apiClient } from '@/features/tanstack-query-api';
import type { FeatureAccessDTO } from '../../types/feature-access';

/**
 * Feature access endpoints
 */
export const FEATURE_ACCESS_ENDPOINTS = {
  checkFeature: (featureCode: string) => `/api/feature-access/check/${featureCode}`,
  checkOperation: (featureCode: string, operation: string) => 
    `/api/feature-access/check/${featureCode}/${operation}`,
  userFeatures: '/api/feature-access/user-features'
};

/**
 * Service for feature access API operations
 */
export const featureAccessService = createExtendedApiService({
  /**
   * Check if the current user has access to a feature
   * 
   * @param featureCode Code of the feature to check
   * @returns Feature access details including allowed operations
   */
  checkFeatureAccess: async (featureCode: string) => {
    return await apiClient.get<FeatureAccessDTO>(
      FEATURE_ACCESS_ENDPOINTS.checkFeature(featureCode)
    );
  },
  
  /**
   * Check if the current user can perform a specific operation on a feature
   * 
   * @param featureCode Code of the feature to check
   * @param operation Operation to check
   * @returns Boolean indicating if access is allowed
   */
  checkOperationAccess: async (featureCode: string, operation: string) => {
    return await apiClient.get<boolean>(
      FEATURE_ACCESS_ENDPOINTS.checkOperation(featureCode, operation)
    );
  },
  
  /**
   * Get all features the current user has access to
   * 
   * @returns List of all features with access details
   */
  getUserFeatures: async () => {
    return await apiClient.get<FeatureAccessDTO[]>(
      FEATURE_ACCESS_ENDPOINTS.userFeatures
    );
  }
});
