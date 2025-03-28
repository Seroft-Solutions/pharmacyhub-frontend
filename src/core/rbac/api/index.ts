/**
 * RBAC API
 * 
 * This module exports all RBAC-related API services and hooks
 */

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
};
