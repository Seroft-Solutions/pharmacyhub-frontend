/**
 * useRBACState Hook
 * 
 * Custom hook that manages RBAC state and provides access to RBAC functionality.
 * This hook now uses the Zustand store internally for state management.
 */
import { useMemo } from 'react';
import { RBACContextType, UserPermissions, Permission, Role, PermissionCheckOptions } from '../types';
import { useRbacStore } from '../state';

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
  // Get state from the Zustand store
  const {
    isInitialized,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAuthorized,
    userPermissions
  } = useRbacStore();
  
  /**
   * Create the context value
   */
  return useMemo<RBACContextType>(() => ({
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAuthorized,
    isInitialized,
    isLoading,
    getUserPermissions: () => userPermissions ? userPermissions.permissions : [],
    getUserRoles: () => userPermissions ? userPermissions.roles : []
  }), [
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAuthorized,
    isInitialized,
    isLoading,
    userPermissions
  ]);
}

export default useRBACState;