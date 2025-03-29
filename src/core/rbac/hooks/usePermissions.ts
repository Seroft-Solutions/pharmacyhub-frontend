/**
 * usePermissions Hook
 * 
 * Custom hook for checking multiple permissions in components
 */
import { useMemo } from 'react';
import { Permission, PermissionCheckOptions, PermissionCheckResult } from '../types';
import { useRBAC } from '../hooks/useRBAC';
import { createPermissionDeniedError } from '../utils/permissionErrors';
import { safeExecute } from '../utils/errorUtils';

/**
 * Hook to check if the current user has multiple permissions
 * @param permissions Permissions to check
 * @param options Optional permission check options
 * @returns Permission check result
 */
export function usePermissions(
  permissions: Permission[],
  options: PermissionCheckOptions = {}
): PermissionCheckResult {
  const { 
    hasAllPermissions, 
    hasAnyPermission,
    isInitialized, 
    isLoading 
  } = useRBAC();
  
  return useMemo(() => {
    // If we're still loading or not initialized, return loading state
    if (!isInitialized || isLoading) {
      return {
        hasPermission: false,
        isLoading: true,
        error: null
      };
    }
    
    // Early return for empty permissions array
    if (permissions.length === 0) {
      return {
        hasPermission: true,
        isLoading: false,
        error: null
      };
    }
    
    // Execute permission check with error handling
    const result = safeExecute(
      () => {
        // Check permissions based on options
        const { all = false } = options;
        const permissionResult = all
          ? hasAllPermissions(permissions)
          : hasAnyPermission(permissions);
        
        // If permission check fails and throwOnError is true, throw error
        if (!permissionResult && options.throwOnError) {
          throw createPermissionDeniedError(permissions.join(', '));
        }
        
        return permissionResult;
      },
      `Failed to check permissions: ${permissions.join(', ')}`
    );
    
    return {
      hasPermission: result.data ?? false,
      isLoading: false,
      error: result.error
    };
  }, [
    permissions, 
    hasAllPermissions, 
    hasAnyPermission, 
    isInitialized, 
    isLoading, 
    options
  ]);
}

export default usePermissions;