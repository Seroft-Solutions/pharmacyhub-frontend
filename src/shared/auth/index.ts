/**
 * Re-export auth feature for compatibility
 * This file serves as a compatibility layer for older code
 */

// Re-export everything from the auth feature
export * from '../../features/core/auth';

// Re-export rbac components
export {
  PermissionGuard,
  RoleGuard,
  PermissionCheck,
  usePermission,
  useRole,
  AdminGuard,
  ManagerGuard,
  ResourceGuard
} from '../../features/core/rbac';
