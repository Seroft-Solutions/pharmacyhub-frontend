/**
 * RBAC UI Components
 */

// Export permission and role guard components
export {
  PermissionGuard,
  AnyPermissionGuard,
  AllPermissionsGuard,
  RoleGuard,
  AnyRoleGuard,
  usePermission,
  useRole
} from './PermissionGuard';

// Export permission check components with backend verification
export {
  PermissionCheck,
  RoleCheck,
  AccessCheck
} from './PermissionCheck';

// Export common role-based guards
export {
  AdminGuard,
  ManagerGuard,
  FeatureGuard as ResourceGuard // Renamed to avoid conflict
} from './RoleGuards';

// Export feature guard
export { FeatureGuard } from './FeatureGuard';
