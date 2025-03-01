'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { featureFlagService } from '../services/featureFlagService';
import { getFeature, getFeaturePermissions } from '../registry';
import { rbacService } from '../api/services/rbacService';
import { useAccess } from '../hooks/useAccess';

interface FeatureGuardProps {
  featureId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  permissionsRequired?: string[];
  rolesRequired?: string[];
  requireAll?: boolean;
  verifyOnBackend?: boolean;
  flagId?: string;
}

/**
 * Guard component to restrict access to specific features
 * Features can be restricted based on permissions, roles, or feature flags
 */
export function FeatureGuard({ 
  featureId, 
  children, 
  fallback = null,
  permissionsRequired = [],
  rolesRequired = [],
  requireAll = true,
  verifyOnBackend = false,
  flagId
}: FeatureGuardProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { hasAccess: checkClientAccess } = useAccess();
  const { user } = useAuth();
  
  useEffect(() => {
    const checkFeatureAccess = async () => {
      // First check if the feature exists
      const feature = getFeature(featureId);
      if (!feature) {
        console.warn(`Feature ${featureId} is not registered`);
        setHasAccess(false);
        setIsLoading(false);
        return;
      }
      
      // Check if the feature is enabled at all
      let featureEnabled = featureFlagService.isEnabled(featureId, flagId);
      if (!featureEnabled) {
        setHasAccess(false);
        setIsLoading(false);
        return;
      }
      
      // If no additional access checks are required, grant access
      if (permissionsRequired.length === 0 && rolesRequired.length === 0) {
        setHasAccess(true);
        setIsLoading(false);
        return;
      }
      
      // Handle server-side verification if needed
      if (verifyOnBackend) {
        try {
          const result = await rbacService.checkAccess(
            rolesRequired, 
            permissionsRequired, 
            requireAll
          );
          setHasAccess(result.data || false);
        } catch (error) {
          console.error('Failed to check feature access', error);
          setHasAccess(false);
        } finally {
          setIsLoading(false);
        }
        return;
      }
      
      // Client-side access check for permissions and roles
      const accessGranted = checkClientAccess(
        rolesRequired, 
        permissionsRequired, 
        { requireAll }
      );
      
      setHasAccess(accessGranted);
      setIsLoading(false);
    };
    
    checkFeatureAccess();
  }, [featureId, flagId, permissionsRequired, rolesRequired, requireAll, verifyOnBackend, checkClientAccess, user]);
  
  if (isLoading) return null;
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

/**
 * Specialized guard for feature flags
 */
export function FeatureFlagGuard({ 
  featureId, 
  flagId, 
  children, 
  fallback = null 
}: { 
  featureId: string;
  flagId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if the specific feature flag is enabled
    const flagEnabled = featureFlagService.isEnabled(featureId, flagId);
    setIsEnabled(flagEnabled);
    setIsLoading(false);
  }, [featureId, flagId]);
  
  if (isLoading) return null;
  
  return isEnabled ? <>{children}</> : <>{fallback}</>;
}
