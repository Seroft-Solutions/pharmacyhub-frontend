/**
 * useRBACState Hook
 * 
 * Custom hook that manages RBAC state and provides access to RBAC functionality
 */
import { useState, useEffect, useMemo } from 'react';
import { rbacService } from '../services/rbacService';
import { RBACContextType, UserPermissions, Permission, Role, PermissionCheckOptions } from '../types';

/**
 * Props for the useRBACState hook
 */
interface UseRBACStateProps {
  /**
   * Initial user permissions
   */
  initialPermissions?: UserPermissions;
  
  /**
   * Whether to initialize the RBAC service immediately
   */
  initializeImmediately?: boolean;
}

/**
 * Hook that provides RBAC state and methods
 * @param props Hook configuration 
 * @returns RBAC context value
 */
export function useRBACState({
  initialPermissions,
  initializeImmediately = true
}: UseRBACStateProps = {}): RBACContextType {
  // Local state for tracking initialization and loading
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize RBAC service
  useEffect(() => {
    if (initializeImmediately && initialPermissions) {
      setIsLoading(true);
      rbacService.initialize(initialPermissions);
      setIsInitialized(true);
      setIsLoading(false);
    }
  }, [initializeImmediately, initialPermissions]);
  
  /**
   * Create permission methods
   * @returns Permission-related methods
   */
  const createPermissionMethods = () => ({
    hasPermission: (permission: Permission) => 
      rbacService.hasPermission(permission),
    hasAnyPermission: (permissions: Permission[]) => 
      rbacService.hasAnyPermission(permissions),
    hasAllPermissions: (permissions: Permission[]) => 
      rbacService.hasAllPermissions(permissions),
  });

  /**
   * Create role methods
   * @returns Role-related methods
   */
  const createRoleMethods = () => ({
    hasRole: (role: Role, checkInheritance?: boolean) => 
      rbacService.hasRole(role, checkInheritance),
    hasAnyRole: (roles: Role[], checkInheritance?: boolean) => 
      rbacService.hasAnyRole(roles, checkInheritance),
    hasAllRoles: (roles: Role[], checkInheritance?: boolean) => 
      rbacService.hasAllRoles(roles, checkInheritance),
  });

  /**
   * Create authorization and getter methods
   * @returns Authorization and getter methods
   */
  const createUtilityMethods = () => ({
    isAuthorized: (rolesOrPermissions: (Role | Permission)[], options?: PermissionCheckOptions) => 
      rbacService.isAuthorized(rolesOrPermissions, options),
    getUserPermissions: () => rbacService.getUserPermissions(),
    getUserRoles: () => rbacService.getUserRoles(),
  });
  
  // Create the context value with memoization by combining method groups
  return useMemo<RBACContextType>(() => ({
    ...createPermissionMethods(),
    ...createRoleMethods(),
    ...createUtilityMethods(),
    isInitialized,
    isLoading
  }), [isInitialized, isLoading]);
}

export default useRBACState;