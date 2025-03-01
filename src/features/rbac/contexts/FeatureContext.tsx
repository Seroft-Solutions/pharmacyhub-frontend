'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllFeatures } from '../registry';
import { featureFlagService } from '../services/featureFlagService';
import { useAccess } from '../hooks/useAccess';

// Context types
interface FeatureContextType {
  // Feature access
  isFeatureEnabled: (featureId: string) => boolean;
  isFeatureFlagEnabled: (featureId: string, flagId: string) => boolean;
  hasFeatureAccess: (featureId: string, permissionsRequired?: string[], rolesRequired?: string[]) => boolean;
  
  // Feature flags management
  enableFeature: (featureId: string) => void;
  disableFeature: (featureId: string) => void;
  enableFeatureFlag: (featureId: string, flagId: string) => void;
  disableFeatureFlag: (featureId: string, flagId: string) => void;
  
  // Feature information
  getFeatureInfo: (featureId: string) => any;
  getAllFeatureInfo: () => Record<string, any>;
  
  // Loading state
  isLoading: boolean;
}

// Create the context
const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

/**
 * Provider component for feature management
 */
export const FeatureProvider: React.FC<{ 
  children: React.ReactNode,
  initialFeatures?: Record<string, boolean>
}> = ({ 
  children,
  initialFeatures = {} 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({});
  const { hasAccess } = useAccess();
  
  // Initialize feature flags
  useEffect(() => {
    const initializeFlags = async () => {
      try {
        await featureFlagService.initialize();
        setFeatureFlags(featureFlagService.getAllFlags());
      } catch (error) {
        console.error('Failed to initialize feature flags', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeFlags();
  }, []);
  
  // Feature access functions
  const isFeatureEnabled = (featureId: string): boolean => {
    return featureFlagService.isEnabled(featureId);
  };
  
  const isFeatureFlagEnabled = (featureId: string, flagId: string): boolean => {
    return featureFlagService.isEnabled(featureId, flagId);
  };
  
  const hasFeatureAccess = (
    featureId: string, 
    permissionsRequired: string[] = [], 
    rolesRequired: string[] = []
  ): boolean => {
    // First check if the feature is enabled
    if (!isFeatureEnabled(featureId)) {
      return false;
    }
    
    // If no additional permissions or roles required, access is granted
    if (permissionsRequired.length === 0 && rolesRequired.length === 0) {
      return true;
    }
    
    // Check permissions and roles
    return hasAccess(rolesRequired, permissionsRequired);
  };
  
  // Feature flag management
  const enableFeature = (featureId: string): void => {
    featureFlagService.enableFeature(featureId);
    setFeatureFlags(featureFlagService.getAllFlags());
  };
  
  const disableFeature = (featureId: string): void => {
    featureFlagService.disableFeature(featureId);
    setFeatureFlags(featureFlagService.getAllFlags());
  };
  
  const enableFeatureFlag = (featureId: string, flagId: string): void => {
    featureFlagService.enableFeature(featureId, flagId);
    setFeatureFlags(featureFlagService.getAllFlags());
  };
  
  const disableFeatureFlag = (featureId: string, flagId: string): void => {
    featureFlagService.disableFeature(featureId, flagId);
    setFeatureFlags(featureFlagService.getAllFlags());
  };
  
  // Feature information
  const getFeatureInfo = (featureId: string): any => {
    const features = getAllFeatures();
    return features[featureId] || null;
  };
  
  const getAllFeatureInfo = (): Record<string, any> => {
    return getAllFeatures();
  };
  
  const contextValue: FeatureContextType = {
    isFeatureEnabled,
    isFeatureFlagEnabled,
    hasFeatureAccess,
    enableFeature,
    disableFeature,
    enableFeatureFlag,
    disableFeatureFlag,
    getFeatureInfo,
    getAllFeatureInfo,
    isLoading
  };
  
  return (
    <FeatureContext.Provider value={contextValue}>
      {children}
    </FeatureContext.Provider>
  );
};

/**
 * Hook for accessing feature management functionality
 */
export const useFeatures = (): FeatureContextType => {
  const context = useContext(FeatureContext);
  if (context === undefined) {
    throw new Error('useFeatures must be used within a FeatureProvider');
  }
  return context;
};

/**
 * Hook for checking a specific feature's access
 */
export const useFeature = (featureId: string, options?: {
  permissionsRequired?: string[];
  rolesRequired?: string[];
  flagId?: string;
}) => {
  const { 
    isFeatureEnabled, 
    isFeatureFlagEnabled, 
    hasFeatureAccess, 
    getFeatureInfo,
    isLoading 
  } = useFeatures();
  
  const { permissionsRequired = [], rolesRequired = [], flagId } = options || {};
  
  const isEnabled = flagId 
    ? isFeatureFlagEnabled(featureId, flagId) 
    : isFeatureEnabled(featureId);
  
  const hasAccess = hasFeatureAccess(featureId, permissionsRequired, rolesRequired);
  
  const featureInfo = getFeatureInfo(featureId);
  
  return {
    isEnabled,
    hasAccess,
    featureInfo,
    isLoading
  };
};

export default FeatureProvider;
