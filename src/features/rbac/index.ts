/**
 * RBAC (Role-Based Access Control) Feature
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

// Export contexts
export { FeatureProvider, useFeatures } from './contexts/FeatureContext';

// Export hooks
export { useAccess } from './hooks';

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
} from './ui';

// Export API
export {
  // Service
  rbacService,
  featureFlagService,
  
  // Query hooks
  useAccessProfile,
  useUserAccessProfile,
  useCheckPermissions,
  useCheckAccess,
  
  // Query keys
  rbacQueryKeys
} from './api';

// Export types
export type {
  AccessProfile,
  AccessCheckResult,
  PermissionCheckResponse,
  AccessCheckOptions,
  RoleCheckOptions,
  PermissionGuardProps,
  RoleGuardProps,
  AccessGuardProps,
  FeatureGuardProps,
  Feature
} from './types';

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

