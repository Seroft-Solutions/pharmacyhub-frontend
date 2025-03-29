/**
 * useRoles Hook
 * 
 * Custom hook for checking multiple user roles in components
 */
import { useMemo } from 'react';
import { Role, PermissionCheckResult } from '../types';
import { useRBAC } from '../hooks/useRBAC';
import { createRoleDeniedError } from '../utils/permissionErrors';
import { safeExecute } from '../utils/errorUtils';

/**
 * Options for roles checking
 */
interface RolesCheckOptions {
  /**
   * Whether to throw an error if the role check fails
   */
  throwOnError?: boolean;
  
  /**
   * Whether to check role inheritance
   */
  checkInheritance?: boolean;
  
  /**
   * If true, require all roles to pass the check
   */
  all?: boolean;
}

/**
 * Hook to check if the current user has multiple roles
 * @param roles Roles to check
 * @param options Optional roles check options
 * @returns Roles check result
 */
export function useRoles(
  roles: Role[],
  options: RolesCheckOptions = {}
): PermissionCheckResult {
  const { 
    hasAllRoles, 
    hasAnyRole,
    isInitialized, 
    isLoading 
  } = useRBAC();
  
  const { checkInheritance = true, all = false } = options;
  
  return useMemo(() => {
    // If we're still loading or not initialized, return loading state
    if (!isInitialized || isLoading) {
      return {
        hasPermission: false,
        isLoading: true,
        error: null
      };
    }
    
    // Early return for empty roles array
    if (roles.length === 0) {
      return {
        hasPermission: true,
        isLoading: false,
        error: null
      };
    }
    
    // Execute role check with error handling
    const result = safeExecute(
      () => {
        // Check roles based on options
        const roleResult = all
          ? hasAllRoles(roles, checkInheritance)
          : hasAnyRole(roles, checkInheritance);
        
        // If role check fails and throwOnError is true, throw error
        if (!roleResult && options.throwOnError) {
          throw createRoleDeniedError(roles.join(', '));
        }
        
        return roleResult;
      },
      `Failed to check roles: ${roles.join(', ')}`
    );
    
    return {
      hasPermission: result.data ?? false,
      isLoading: false,
      error: result.error
    };
  }, [
    roles, 
    hasAllRoles, 
    hasAnyRole, 
    isInitialized, 
    isLoading,
    checkInheritance,
    all,
    options.throwOnError
  ]);
}

export default useRoles;