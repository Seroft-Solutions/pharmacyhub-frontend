'use client';

import { useAuth } from '@/features/core/app-auth/hooks';
import { useCallback, useMemo } from 'react';
import { useFeatureApi } from '../api/hooks/useFeatureApi';
import { FeatureAccessMap } from '../types';
import { DEV_CONFIG } from '@/features/core/app-auth/constants/config';

/**
 * Hook for feature-based access control
 * Use this hook to check if the user has access to specific features
 */
export function useFeatures() {
  const { isAuthenticated } = useAuth();
  const { useAccessibleFeatures, useCheckFeatureAccess, useCheckBulkFeatureAccess } = useFeatureApi();
  
  // Get all accessible features for the current user
  const { 
    data: accessibleFeatures = [], 
    isLoading: isLoadingFeatures,
    isError,
    error
  } = useAccessibleFeatures();
  
  // Mutation for checking bulk feature access
  const { mutateAsync: checkBulkAccess } = useCheckBulkFeatureAccess();
  
  // Build a map of feature codes for easy access checking
  const featuresMap: FeatureAccessMap = useMemo(() => {
    const map: FeatureAccessMap = {};
    accessibleFeatures.forEach((feature) => {
      map[feature.code] = true;
      // If feature has child features, add them too
      if (feature.childFeatures && feature.childFeatures.length > 0) {
        addChildFeaturesToMap(feature.childFeatures, map);
      }
    });
    return map;
  }, [accessibleFeatures]);
  
  // Helper function to recursively add child features to the map
  const addChildFeaturesToMap = (childFeatures: any[], map: FeatureAccessMap) => {
    childFeatures.forEach((child) => {
      map[child.code] = true;
      if (child.childFeatures && child.childFeatures.length > 0) {
        addChildFeaturesToMap(child.childFeatures, map);
      }
    });
  };
  
  // Check if user has access to a feature
  const hasFeature = useCallback((featureCode: string): boolean => {
    // In development mode with auth bypass, assume all features are available
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      return true;
    }
    
    if (!isAuthenticated) return false;
    return !!featuresMap[featureCode];
  }, [isAuthenticated, featuresMap]);
  
  // Check if user has all specified features
  const hasAllFeatures = useCallback((featureCodes: string[]): boolean => {
    return featureCodes.every((code) => hasFeature(code));
  }, [hasFeature]);
  
  // Check if user has any of the specified features
  const hasAnyFeature = useCallback((featureCodes: string[]): boolean => {
    return featureCodes.some((code) => hasFeature(code));
  }, [hasFeature]);
  
  // Verify access with the backend directly for critical operations
  const verifyFeatureAccess = useCallback(async (featureCodes: string[], requireAll = false): Promise<boolean> => {
    if (!isAuthenticated) return false;
    
    try {
      const response = await checkBulkAccess(featureCodes);
      const results = response.data;
      
      if (requireAll) {
        return Object.values(results).every((hasAccess) => hasAccess);
      } else {
        return Object.values(results).some((hasAccess) => hasAccess);
      }
    } catch (err) {
      console.error('Error verifying feature access:', err);
      return false;
    }
  }, [isAuthenticated, checkBulkAccess]);
  
  return {
    isLoadingFeatures,
    isError,
    error,
    accessibleFeatures,
    featuresMap,
    hasFeature,
    hasAllFeatures,
    hasAnyFeature,
    verifyFeatureAccess
  };
}
