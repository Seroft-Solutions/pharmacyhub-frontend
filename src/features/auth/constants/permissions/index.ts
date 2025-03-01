/**
 * Auth Feature Permissions
 * 
 * Defines all permissions related to the authentication feature.
 */

/**
 * Auth-specific permissions
 */
export enum AuthPermission {
  // User account permissions
  LOGIN = 'auth:login',
  LOGOUT = 'auth:logout',
  REGISTER = 'auth:register',
  MANAGE_ACCOUNT = 'auth:manage-account',
  VERIFY_EMAIL = 'auth:verify-email',
  RESET_PASSWORD = 'auth:reset-password',
  
  // Profile permissions
  VIEW_PROFILE = 'auth:view-profile',
  EDIT_PROFILE = 'auth:edit-profile',
  
  // Session permissions
  MANAGE_SESSIONS = 'auth:manage-sessions',
  VIEW_SESSIONS = 'auth:view-sessions',
  
  // Admin permissions
  MANAGE_USERS = 'auth:manage-users',
  VIEW_USERS = 'auth:view-users',
  EDIT_USERS = 'auth:edit-users',
  DELETE_USERS = 'auth:delete-users',
  IMPERSONATE_USER = 'auth:impersonate-user'
}

/**
 * Admin-only permissions within this feature
 */
export const AUTH_ADMIN_PERMISSIONS = [
  AuthPermission.MANAGE_USERS,
  AuthPermission.EDIT_USERS,
  AuthPermission.DELETE_USERS,
  AuthPermission.IMPERSONATE_USER
];

/**
 * Permissions that all roles have
 */
export const AUTH_COMMON_PERMISSIONS = [
  AuthPermission.LOGIN,
  AuthPermission.LOGOUT,
  AuthPermission.VIEW_PROFILE,
  AuthPermission.EDIT_PROFILE,
  AuthPermission.RESET_PASSWORD
];
