/**
 * useRole Hook
 * 
 * Custom hook for checking user roles in components
 */
import { useMemo } from 'react';
import { Role, PermissionCheckResult } from '../types';
import { useRBAC } from '../hooks/useRBAC';
import { createRoleDeniedError } from '../utils/permissionErrors';
import { safeExecute } from '../utils/errorUtils';

/**
 * Options for role checking
 */
interface RoleCheckOptions {
  /**
   * Whether to throw an error if the role check fails
   */
  throwOnError?: boolean;
  
  /**
   * Whether to check role inheritance
   */
  checkInheritance?: boolean;
}

/**
 * Hook to check if the current user has a specific role
 * @param role Role to check
 * @param options Optional role check options
 * @returns Role check result
 */
export function useRole(
  role: Role,
  options: RoleCheckOptions = {}
): PermissionCheckResult {
  const { hasRole, isInitialized, isLoading } = useRBAC();
  const { checkInheritance = true } = options;
  
  return useMemo(() => {
    // If we're still loading or not initialized, return loading state
    if (!isInitialized || isLoading) {
      return {
        hasPermission: false,
        isLoading: true,
        error: null
      };
    }
    
    // Execute role check with error handling
    const result = safeExecute(
      () => {
        const roleResult = hasRole(role, checkInheritance);
        
        // If role check fails and throwOnError is true, throw error
        if (!roleResult && options.throwOnError) {
          throw createRoleDeniedError(role);
        }
        
        return roleResult;
      },
      `Failed to check role: ${role}`
    );
    
    return {
      hasPermission: result.data ?? false,
      isLoading: false,
      error: result.error
    };
  }, [role, hasRole, isInitialized, isLoading, checkInheritance, options.throwOnError]);
}

export default useRole;