/**
 * RBAC State Management
 * 
 * This module exports the Zustand store for RBAC state and selectors.
 */

// Export the RBAC store and selectors
export { 
  useRbacStore,
  
  // State selectors
  useUserPermissions,
  useIsRbacInitialized,
  useIsRbacLoading,
  useRbacError,
  
  // Permission selectors
  usePermissionCheck,
  
  // Role selectors
  useRoleCheck,
  
  // Authorization selectors
  useAuthorization,
  
  // Action selectors
  useRbacActions,
  
  // Helper functions
  getUserPermissions,
  getUserRoles
} from './rbacStore';