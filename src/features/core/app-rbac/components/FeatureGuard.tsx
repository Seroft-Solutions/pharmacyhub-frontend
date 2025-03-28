'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFeatureAccess } from '../hooks/useFeatureAccess';

interface FeatureGuardProps {
  featureCode: string | string[];
  children: React.ReactNode;
  operation?: string;
  fallback?: React.ReactNode;
  requireAll?: boolean;
  redirectTo?: string;
  showLoading?: boolean;
}

/**
 * Guard component to restrict access to specific features
 * Use this component to wrap UI elements that should only be visible
 * to users with access to specific features
 */
export function FeatureGuard({
  featureCode,
  children,
  operation,
  fallback = null,
  requireAll = true,
  redirectTo,
  showLoading = false,
}: FeatureGuardProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const router = useRouter();
  const {
    hasFeature,
    hasOperation,
    hasAllFeatures,
    hasAnyFeature,
    isLoading,
  } = useFeatureAccess();

  useEffect(() => {
    const checkFeatureAccess = () => {
      // Handle array of feature codes
      const featureCodes = Array.isArray(featureCode) ? featureCode : [featureCode];

      let accessResult = false;

      if (operation) {
        // Operation-level check (only supports single feature)
        if (Array.isArray(featureCode)) {
          console.warn('Operation check only supports a single feature code, using the first one');
          accessResult = hasOperation(featureCodes[0], operation);
        } else {
          accessResult = hasOperation(featureCode, operation);
        }
      } else {
        // Feature-level check
        accessResult = requireAll
          ? hasAllFeatures(featureCodes)
          : hasAnyFeature(featureCodes);
      }

      setHasAccess(accessResult);

      // Redirect if access is denied and redirectTo is provided
      if (!accessResult && redirectTo) {
        router.push(redirectTo);
      }
    };

    // Only check access after features have loaded
    if (!isLoading) {
      checkFeatureAccess();
    }
  }, [
    featureCode,
    operation,
    requireAll,
    hasFeature,
    hasOperation,
    hasAllFeatures,
    hasAnyFeature,
    redirectTo,
    router,
    isLoading,
  ]);

  // Show loading indicator if features are still loading or access check is in progress
  if (isLoading || hasAccess === null) {
    return showLoading ? (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    ) : null;
  }

  // Show children if user has access, otherwise show fallback
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

/**
 * Feature access guard for operation-specific controls
 * Use this to show UI elements only if a user can perform a specific operation
 */
export function OperationGuard({
  featureCode,
  operation,
  children,
  fallback = null,
}: {
  featureCode: string;
  operation: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <FeatureGuard 
      featureCode={featureCode} 
      operation={operation} 
      fallback={fallback}
    >
      {children}
    </FeatureGuard>
  );
}

/**
 * Admin only guard
 * Use this to show UI elements only for admin users
 */
export function AdminOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  return (
    <FeatureGuard
      featureCode={['admin', 'user_management']}
      requireAll={false}
      fallback={fallback}
    >
      {children}
    </FeatureGuard>
  );
}
