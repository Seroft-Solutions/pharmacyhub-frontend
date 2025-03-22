"use client";

import { useEffect, useRef } from 'react';
import { FeatureNavigation } from '../types/navigationTypes';
import { useNavigationStore } from '../store/navigationStore';
import { logger } from '@/shared/lib/logger';

/**
 * useFeatureRegistration - A custom hook to safely register navigation features
 * 
 * This hook ensures that features are only registered once, preventing infinite
 * render loops that can occur when registering features in component effects.
 * 
 * @param feature The feature to register
 * @param dependencies Optional array of dependencies that should trigger re-registration
 */
export function useFeatureRegistration(
  feature: FeatureNavigation,
  dependencies: any[] = []
) {
  const { registerFeature } = useNavigationStore();
  const registeredRef = useRef(false);
  
  useEffect(() => {
    // Only register the feature once to prevent infinite loops
    if (!registeredRef.current) {
      logger.debug('[useFeatureRegistration] Registering feature', { 
        featureId: feature.id 
      });
      
      registerFeature(feature);
      registeredRef.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feature.id, ...dependencies]);
}

/**
 * useMultipleFeaturesRegistration - A custom hook to safely register multiple navigation features
 * 
 * This hook ensures that features are only registered once, preventing infinite
 * render loops that can occur when registering features in component effects.
 * 
 * @param features The features to register
 * @param dependencies Optional array of dependencies that should trigger re-registration
 */
export function useMultipleFeaturesRegistration(
  features: FeatureNavigation[],
  dependencies: any[] = []
) {
  const { registerFeature } = useNavigationStore();
  const registeredRef = useRef(false);
  
  useEffect(() => {
    // Only register the features once to prevent infinite loops
    if (!registeredRef.current) {
      logger.debug('[useMultipleFeaturesRegistration] Registering features', { 
        count: features.length,
        featureIds: features.map(f => f.id)
      });
      
      features.forEach(feature => {
        registerFeature(feature);
      });
      
      registeredRef.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);
}

export default useFeatureRegistration;