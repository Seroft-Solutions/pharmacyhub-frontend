/**
 * RBAC (Role-Based Access Control) Feature
 * 
 * @deprecated This module has been migrated to `@/core/rbac`. Please update your imports.
 * 
 * This feature provides a comprehensive solution for managing and enforcing
 * access control based on user roles and permissions.
 * 
 * Features:
 * - Client-side and server-side permission checking
 * - Role and permission-based UI component guards
 * - Access control hooks and utilities
 * - TanStack Query integration for data fetching
 * - Feature registry and management
 * - Feature flags
 */

// Export registry and constants
export * from './registry';
export * from './constants/roles';
export * from './constants/authPermissions';
export * from './constants/authRoles';

// Export contexts
export { FeatureProvider, useFeatures } from './contexts/FeatureContext';

// Export hooks
export { useAccess } from './hooks/useAccess';
export { useFeatureAccess } from './hooks/useFeatureAccess';
export { usePermissions } from './hooks/usePermissions';

// Export UI components
export {
  // Basic permission guards
  PermissionGuard,
  AnyPermissionGuard,
  AllPermissionsGuard,
  RoleGuard,
  AnyRoleGuard,
  
  // Permission hooks
  usePermission,
  useRole,
  
  // Backend verification components
  PermissionCheck,
  RoleCheck,
  AccessCheck,
  
  // Common role guards
  AdminGuard,
  ManagerGuard,
  ResourceGuard,
  
  // Feature control
  FeatureGuard
} from './components';

// Export API
export {
  // Services
  rbacService,
  featureFlagService,
  featureAccessService,
  
  // Feature access hooks
  useFeatureAccessQueries,
  
  // Query hooks
  useAccessProfile,
  useUserAccessProfile,
  useCheckPermissions,
  useCheckAccess,
  
  // Query keys
  rbacQueryKeys
} from './api';

// Export types
export * from './types';

/**
 * Initialize the RBAC feature
 * This should be called at application startup
 */
export function initializeRbac() {
  // Initialize all registered features
  import('./registry').then(({ initializeFeatures }) => {
    initializeFeatures();
  });
  
  // Initialize the feature flag service
  import('./services/featureFlagService').then(({ featureFlagService }) => {
    featureFlagService.initialize();
  });
}
