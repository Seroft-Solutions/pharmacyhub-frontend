/**
 * RBAC Query Hooks
 * TanStack Query hooks for RBAC-related data fetching
 */
import { 
  useApiQuery, 
  useApiMutation, 
  UseApiQueryOptions 
} from '@/features/tanstack-query-api';
import { rbacService } from '../services/rbacService';
import { rbacQueryKeys } from '../queryKeys';
import type { AccessProfile, PermissionCheckResponse } from '../../types';

/**
 * Hook to get the current user's access profile
 */
export function useAccessProfile(options?: UseApiQueryOptions<AccessProfile>) {
  return useApiQuery<AccessProfile>(
    rbacQueryKeys.profile(),
    () => rbacService.getUserAccessProfile(),
    options
  );
}

/**
 * Hook to get a user's access profile by ID
 */
export function useUserAccessProfile(userId: string, options?: UseApiQueryOptions<AccessProfile>) {
  return useApiQuery<AccessProfile>(
    rbacQueryKeys.userProfile(userId),
    () => rbacService.getUserAccessProfileById(userId),
    {
      enabled: !!userId,
      ...options
    }
  );
}

/**
 * Hook to check specific permissions
 */
export function useCheckPermissions(
  permissions: string[],
  options?: UseApiQueryOptions<PermissionCheckResponse>
) {
  return useApiQuery<PermissionCheckResponse>(
    rbacQueryKeys.permissions(permissions),
    () => rbacService.checkPermissions(permissions),
    {
      enabled: permissions.length > 0,
      ...options
    }
  );
}

/**
 * Hook to check access based on roles and/or permissions
 */
export function useCheckAccess(
  roles: string[] = [],
  permissions: string[] = [],
  requireAll: boolean = false,
  options?: UseApiQueryOptions<boolean>
) {
  return useApiQuery<boolean>(
    rbacQueryKeys.access(roles, permissions, requireAll),
    () => rbacService.checkAccess(roles, permissions, requireAll),
    {
      enabled: roles.length > 0 || permissions.length > 0,
      ...options
    }
  );
}
