/**
 * RBAC Query Keys
 * 
 * This file defines the query keys used for RBAC-related queries
 * with React Query. Using a consistent key structure ensures proper
 * cache invalidation and refetching.
 */

/**
 * RBAC query key factory
 */
export const rbacQueryKeys = {
  /**
   * Root key for all RBAC queries
   */
  all: ['rbac'] as const,
  
  /**
   * Key for user access profile queries
   * @param userId Optional user ID (defaults to current user)
   */
  accessProfile: (userId?: string) => 
    [...rbacQueryKeys.all, 'accessProfile', userId] as const,
  
  /**
   * Key for role queries
   * @param roleId Optional role ID
   */
  roles: (roleId?: string) => 
    [...rbacQueryKeys.all, 'roles', roleId] as const,
  
  /**
   * Key for permission queries
   * @param permissionId Optional permission ID
   */
  permissions: (permissionId?: string) => 
    [...rbacQueryKeys.all, 'permissions', permissionId] as const,
  
  /**
   * Key for feature access queries
   * @param featureId Feature ID
   */
  featureAccess: (featureId: string) => 
    [...rbacQueryKeys.all, 'featureAccess', featureId] as const,
  
  /**
   * Key for feature flag queries
   * @param featureId Feature ID
   */
  featureFlag: (featureId: string) => 
    [...rbacQueryKeys.all, 'featureFlag', featureId] as const
};

export default rbacQueryKeys;