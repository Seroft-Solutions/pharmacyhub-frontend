/**
 * Feature Context Provider
 * 
 * This file exports the FeatureProvider and useFeatures hook.
 */
import React, { useContext, ReactNode } from 'react';
import FeatureContext, { FeatureContextType } from './FeatureContext';
import { FeatureProvider as FeatureProviderComponent } from '../components/FeatureProvider';

/**
 * Re-export the FeatureProvider component
 */
export const FeatureProvider = FeatureProviderComponent;

/**
 * Hook for using the feature context
 * @returns Feature context methods
 * @throws Error if used outside of a FeatureProvider
 */
export const useFeatures = (): FeatureContextType => {
  const context = useContext(FeatureContext);
  
  if (context === undefined) {
    throw new Error('useFeatures must be used within a FeatureProvider');
  }
  
  return context;
};

export default FeatureProvider;