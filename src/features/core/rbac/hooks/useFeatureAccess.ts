'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useFeatureAccessQueries } from '../api/hooks/useFeatureAccessQueries';
import { featureAccessService } from '../api/services/featureAccessService';
import type { FeatureAccessDTO, FeatureAccessMap } from '../types/feature-access';

/**
 * Hook for checking feature access in components
 * Provides methods to check feature and operation access with efficient caching
 */
export function useFeatureAccess() {
  const { useUserFeatures } = useFeatureAccessQueries();
  const queryClient = useQueryClient();
  const { data: userFeatures, isLoading, error } = useUserFeatures();
  const [featureMap, setFeatureMap] = useState<FeatureAccessMap>({});
  
  // Build feature map when data changes
  useEffect(() => {
    if (userFeatures && Array.isArray(userFeatures)) {
      const map: FeatureAccessMap = {};
      userFeatures.forEach((feature) => {
        map[feature.featureCode] = feature;
      });
      setFeatureMap(map);
    }
  }, [userFeatures]);
  
  /**
   * Check if the current user has access to a feature
   * 
   * @param featureCode Code of the feature to check
   * @returns boolean indicating if access is allowed
   */
  const hasFeature = useCallback((featureCode: string): boolean => {
    // Check from cached map first
    if (featureMap[featureCode]) {
      return featureMap[featureCode].hasAccess;
    }
    
    // If not in map, check from cache or make API call
    const cachedFeature = queryClient.getQueryData<FeatureAccessDTO>(['featureAccess', featureCode]);
    if (cachedFeature) {
      return cachedFeature.hasAccess;
    }
    
    // If not in cache, we can't determine access synchronously
    // Return false and trigger a query
    queryClient.fetchQuery({ 
      queryKey: ['featureAccess', featureCode],
      queryFn: () => featureAccessService.checkFeatureAccess(featureCode)
    });
    
    return false;
  }, [featureMap, queryClient]);
  
  /**
   * Check if the current user can perform a specific operation on a feature
   * 
   * @param featureCode Code of the feature to check
   * @param operation Operation to check
   * @returns boolean indicating if operation is allowed
   */
  const hasOperation = useCallback((featureCode: string, operation: string): boolean => {
    // Check from cached map first
    if (featureMap[featureCode]) {
      return featureMap[featureCode].hasAccess && 
             featureMap[featureCode].allowedOperations.includes(operation);
    }
    
    // If not in map, check from cache or make API call
    const cachedFeature = queryClient.getQueryData<FeatureAccessDTO>(['featureAccess', featureCode]);
    if (cachedFeature) {
      return cachedFeature.hasAccess && 
             cachedFeature.allowedOperations.includes(operation);
    }
    
    // If not in cache, we can't determine access synchronously
    // Return false and trigger a query
    queryClient.fetchQuery({
      queryKey: ['operationAccess', featureCode, operation],
      queryFn: () => featureAccessService.checkOperationAccess(featureCode, operation)
    });
    
    return false;
  }, [featureMap, queryClient]);
  
  /**
   * Check if the current user has access to all specified features
   * 
   * @param featureCodes Array of feature codes to check
   * @returns boolean indicating if access is allowed for all features
   */
  const hasAllFeatures = useCallback((featureCodes: string[]): boolean => {
    return featureCodes.every(code => hasFeature(code));
  }, [hasFeature]);
  
  /**
   * Check if the current user has access to any of the specified features
   * 
   * @param featureCodes Array of feature codes to check
   * @returns boolean indicating if access is allowed for any feature
   */
  const hasAnyFeature = useCallback((featureCodes: string[]): boolean => {
    return featureCodes.some(code => hasFeature(code));
  }, [hasFeature]);
  
  return {
    isLoading,
    error,
    features: Array.isArray(userFeatures) ? userFeatures : [],
    featureMap,
    hasFeature,
    hasOperation,
    hasAllFeatures,
    hasAnyFeature,
  };
}
