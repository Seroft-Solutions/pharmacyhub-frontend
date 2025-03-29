/**
 * Feature Provider Component
 * 
 * Provides methods for checking feature flags and feature access
 */
import React, { ReactNode } from 'react';
import FeatureContext from '../contexts/FeatureContext';
import { useFeatureState } from '../hooks/useFeatureState';

/**
 * Props for the FeatureProvider component
 */
interface FeatureProviderProps {
  children: ReactNode;
}

/**
 * Feature Provider Component
 * 
 * Provides feature flag and access functionality to the application
 */
export const FeatureProvider: React.FC<FeatureProviderProps> = ({ children }) => {
  // Use the feature state hook to get feature methods
  const featureState = useFeatureState();
  
  return (
    <FeatureContext.Provider value={featureState}>
      {children}
    </FeatureContext.Provider>
  );
};

export default FeatureProvider;