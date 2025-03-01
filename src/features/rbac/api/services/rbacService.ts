/**
 * RBAC Service
 * Provides API methods for role and permission-based access control
 */
import { createExtendedApiService } from '@/features/tanstack-query-api';
import type { ApiResponse } from '@/features/tanstack-query-api';
import type { PermissionCheckResponse, AccessProfile } from '../../types';

/**
 * Service for RBAC-related API operations
 */
export const rbacService = createExtendedApiService<AccessProfile, {
  /**
   * Checks if the user has the specified permissions
   * 
   * @param permissions Array of permission codes to check
   * @returns Object mapping each permission to a boolean indicating if it's granted
   */
  checkPermissions: (permissions: string[]) => Promise<ApiResponse<PermissionCheckResponse>>;
  
  /**
   * Checks if the user has the required access based on roles and/or permissions
   * 
   * @param roles Array of roles to check
   * @param permissions Array of permissions to check
   * @param requireAll Whether all roles/permissions are required (true) or just any (false)
   * @returns Boolean indicating if access is granted
   */
  checkAccess: (
    roles: string[], 
    permissions: string[], 
    requireAll: boolean
  ) => Promise<ApiResponse<boolean>>;
  
  /**
   * Gets the complete access profile for the current user
   * 
   * @returns User's access profile including roles and permissions
   */
  getUserAccessProfile: () => Promise<ApiResponse<AccessProfile>>;
  
  /**
   * Gets the access profile for a specific user
   * 
   * @param userId ID of the user to get access profile for
   * @returns User's access profile including roles and permissions
   */
  getUserAccessProfileById: (userId: string) => Promise<ApiResponse<AccessProfile>>;
}>('security', {
  checkPermissions: async (permissions: string[]): Promise<ApiResponse<PermissionCheckResponse>> => {
    return await apiClient.post<PermissionCheckResponse>('/security/check-permissions', { permissions });
  },
  
  checkAccess: async (
    roles: string[], 
    permissions: string[], 
    requireAll: boolean
  ): Promise<ApiResponse<boolean>> => {
    return await apiClient.post<boolean>('/security/check-access', {
      roles,
      permissions,
      requireAll
    });
  },
  
  getUserAccessProfile: async (): Promise<ApiResponse<AccessProfile>> => {
    return await apiClient.get<AccessProfile>('/security/profile');
  },
  
  getUserAccessProfileById: async (userId: string): Promise<ApiResponse<AccessProfile>> => {
    return await apiClient.get<AccessProfile>(`/security/profile/${userId}`);
  }
});

// Fix to import the apiClient
import { apiClient } from '@/features/tanstack-query-api';
