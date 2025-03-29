/**
 * usePermission Hook
 * 
 * Custom hook for checking permissions in components
 */
import { useMemo } from 'react';
import { Permission, PermissionCheckOptions, PermissionCheckResult } from '../types';
import { useRBAC } from '../hooks/useRBAC';
import { createPermissionDeniedError } from '../utils/permissionErrors';
import { safeExecute } from '../utils/errorUtils';

/**
 * Hook to check if the current user has a specific permission
 * @param permission Permission to check
 * @param options Optional permission check options
 * @returns Permission check result
 */
export function usePermission(
  permission: Permission,
  options: PermissionCheckOptions = {}
): PermissionCheckResult {
  const { hasPermission, isInitialized, isLoading } = useRBAC();
  
  return useMemo(() => {
    // If we're still loading or not initialized, return loading state
    if (!isInitialized || isLoading) {
      return {
        hasPermission: false,
        isLoading: true,
        error: null
      };
    }
    
    // Execute permission check with error handling
    const result = safeExecute(
      () => {
        const permissionResult = hasPermission(permission);
        
        // If permission check fails and throwOnError is true, throw error
        if (!permissionResult && options.throwOnError) {
          throw createPermissionDeniedError(permission);
        }
        
        return permissionResult;
      },
      `Failed to check permission: ${permission}`
    );
    
    return {
      hasPermission: result.data ?? false,
      isLoading: false,
      error: result.error
    };
  }, [permission, hasPermission, isInitialized, isLoading, options.throwOnError]);
}

export default usePermission;