'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { featureAccessService } from '../services/featureAccessService';
import type { FeatureAccessDTO } from '../../types/feature-access';

/**
 * React Query hooks for feature access
 */
export const useFeatureAccessQueries = () => {
  const queryClient = useQueryClient();
  
  /**
   * Get all features the current user has access to
   */
  const useUserFeatures = () => {
    return useQuery({
      queryKey: ['userFeatures'],
      queryFn: () => featureAccessService.getUserFeatures(),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    });
  };
  
  /**
   * Check if the current user has access to a specific feature
   */
  const useFeatureAccess = (featureCode: string) => {
    return useQuery({
      queryKey: ['featureAccess', featureCode],
      queryFn: () => featureAccessService.checkFeatureAccess(featureCode),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    });
  };
  
  /**
   * Check if the current user can perform a specific operation on a feature
   */
  const useOperationAccess = (featureCode: string, operation: string) => {
    return useQuery({
      queryKey: ['operationAccess', featureCode, operation],
      queryFn: () => featureAccessService.checkOperationAccess(featureCode, operation),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes,
    });
  };

  /**
   * Invalidate all feature access queries to refresh the data
   */
  const invalidateFeatureAccess = () => {
    return queryClient.invalidateQueries({
      queryKey: ['userFeatures'],
    });
  };
  
  return {
    useUserFeatures,
    useFeatureAccess,
    useOperationAccess,
    invalidateFeatureAccess,
  };
};
