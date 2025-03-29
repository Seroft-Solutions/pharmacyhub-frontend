/**
 * Authentication Permissions
 * 
 * This file defines permissions related to authentication and user management.
 * Using constants prevents typos and makes permission changes easier to track.
 */

/**
 * Authentication permissions
 */
export const AUTH_PERMISSIONS = {
  /**
   * View user profiles
   */
  VIEW_USERS: 'auth:view-users',
  
  /**
   * Create new users
   */
  CREATE_USERS: 'auth:create-users',
  
  /**
   * Update existing users
   */
  UPDATE_USERS: 'auth:update-users',
  
  /**
   * Delete users
   */
  DELETE_USERS: 'auth:delete-users',
  
  /**
   * Manage user roles
   */
  MANAGE_ROLES: 'auth:manage-roles',
  
  /**
   * Manage user permissions
   */
  MANAGE_PERMISSIONS: 'auth:manage-permissions',
  
  /**
   * View auth logs
   */
  VIEW_LOGS: 'auth:view-logs',
  
  /**
   * Manage auth settings
   */
  MANAGE_SETTINGS: 'auth:manage-settings',
  
  /**
   * Impersonate other users
   */
  IMPERSONATE: 'auth:impersonate'
};

/**
 * Permission groups - convenient groupings of related permissions
 */
export const AUTH_PERMISSION_GROUPS = {
  /**
   * All user management permissions
   */
  USER_MANAGEMENT: [
    AUTH_PERMISSIONS.VIEW_USERS,
    AUTH_PERMISSIONS.CREATE_USERS,
    AUTH_PERMISSIONS.UPDATE_USERS,
    AUTH_PERMISSIONS.DELETE_USERS
  ],
  
  /**
   * All role and permission management permissions
   */
  ROLE_MANAGEMENT: [
    AUTH_PERMISSIONS.MANAGE_ROLES,
    AUTH_PERMISSIONS.MANAGE_PERMISSIONS
  ],
  
  /**
   * All authentication system management permissions
   */
  SYSTEM_MANAGEMENT: [
    AUTH_PERMISSIONS.VIEW_LOGS,
    AUTH_PERMISSIONS.MANAGE_SETTINGS,
    AUTH_PERMISSIONS.IMPERSONATE
  ]
};

export default AUTH_PERMISSIONS;