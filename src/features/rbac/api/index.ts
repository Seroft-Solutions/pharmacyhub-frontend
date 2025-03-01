/**
 * RBAC API Module
 */

// Export service
export { rbacService } from './services/rbacService';
export { featureFlagService } from '../services/featureFlagService';

// Export query hooks
export {
  useAccessProfile,
  useUserAccessProfile,
  useCheckPermissions,
  useCheckAccess
} from './hooks/useRbacQueries';

// Export query keys
export { rbacQueryKeys } from './queryKeys';
