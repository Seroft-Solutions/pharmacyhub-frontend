/**
 * Feature Context
 * 
 * This file defines the React context for feature flags and feature access.
 */
import { createContext } from 'react';
import { AccessCheckOptions } from '../types';

/**
 * Feature context type
 */
export interface FeatureContextType {
  /**
   * Check if a feature is enabled
   * @param featureId Feature ID to check
   * @returns True if the feature is enabled
   */
  isFeatureEnabled: (featureId: string) => boolean;
  
  /**
   * Check if a user has access to a feature
   * @param featureId Feature ID to check
   * @param options Access check options
   * @returns True if the user has access
   */
  hasFeatureAccess: (featureId: string, options?: AccessCheckOptions) => boolean;
}

// Create the context with default values
const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export default FeatureContext;