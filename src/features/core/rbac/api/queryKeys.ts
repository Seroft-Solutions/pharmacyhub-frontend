/**
 * RBAC Query Keys
 * TanStack Query key factory for RBAC-related queries
 */
import { createQueryKeys } from '@/features/core/tanstack-query-api';

/**
 * Query keys for RBAC-related queries
 */
export const rbacQueryKeys = createQueryKeys('rbac', {
  // Access profile queries
  profile: () => ['profile'],
  userProfile: (userId: string) => ['userProfile', userId],
  
  // Permission checking queries
  permissions: (permissions: string[]) => ['permissions', permissions],
  
  // Complex access check queries
  access: (roles: string[], permissions: string[], requireAll: boolean) => [
    'access', 
    { roles, permissions, requireAll }
  ]
});
