/**
 * Feature Access Service
 * Provides API methods for feature-based access control
 */
import { createExtendedApiService, ApiResponse } from '../../../app-api-handler';
import type { FeatureAccessDTO } from '../../types/feature-access';

/**
 * Feature access endpoints as constants
 */
export const FEATURE_ACCESS_ENDPOINTS = {
  CHECK_FEATURE: (featureCode: string) => `/api/feature-access/check/${featureCode}`,
  CHECK_OPERATION: (featureCode: string, operation: string) => 
    `/api/feature-access/check/${featureCode}/${operation}`,
  USER_FEATURES: '/api/feature-access/user-features'
};

/**
 * Service for feature access API operations
 * Uses TanStack Query API pattern for consistent data fetching
 */
export const featureAccessService = createExtendedApiService<FeatureAccessDTO, {
  /**
   * Check if the current user has access to a feature
   * 
   * @param featureCode Code of the feature to check
   * @returns Feature access details including allowed operations
   */
  checkFeatureAccess: (featureCode: string) => Promise<ApiResponse<FeatureAccessDTO>>;
  
  /**
   * Check if the current user can perform a specific operation on a feature
   * 
   * @param featureCode Code of the feature to check
   * @param operation Operation to check
   * @returns Boolean indicating if access is allowed
   */
  checkOperationAccess: (featureCode: string, operation: string) => Promise<ApiResponse<boolean>>;
  
  /**
   * Get all features the current user has access to
   * 
   * @returns List of all features with access details
   */
  getUserFeatures: () => Promise<ApiResponse<FeatureAccessDTO[]>>;
}>(
  '/api/feature-access',
  {
    checkFeatureAccess: async (featureCode: string) => {
      const endpoint = FEATURE_ACCESS_ENDPOINTS.CHECK_FEATURE(featureCode);
      return await apiClient.get<FeatureAccessDTO>(endpoint);
    },
    
    checkOperationAccess: async (featureCode: string, operation: string) => {
      const endpoint = FEATURE_ACCESS_ENDPOINTS.CHECK_OPERATION(featureCode, operation);
      return await apiClient.get<boolean>(endpoint);
    },
    
    getUserFeatures: async () => {
      return await apiClient.get<FeatureAccessDTO[]>(FEATURE_ACCESS_ENDPOINTS.USER_FEATURES);
    }
  }
);

// Import apiClient from tanstack-query-api
import { apiClient } from '../../../app-api-handler';

// Add hooks for feature access
export * from '../hooks/useFeatureAccessQueries';
