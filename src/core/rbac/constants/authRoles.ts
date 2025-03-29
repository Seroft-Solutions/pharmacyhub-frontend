/**
 * Authentication Roles
 * 
 * This file defines roles related to authentication and user management.
 * Using constants prevents typos and makes role changes easier to track.
 */

import { RoleDefinition } from '../types';
import { ROLES } from './roles';
import { AUTH_PERMISSIONS, AUTH_PERMISSION_GROUPS } from './authPermissions';

/**
 * Authentication-related role definitions with their assigned permissions
 */
export const AUTH_ROLES: Record<string, RoleDefinition> = {
  /**
   * User admin role - can manage all user-related functions
   */
  USER_ADMIN: {
    name: 'user_admin',
    description: 'User administrator with full user management capabilities',
    permissions: [
      ...AUTH_PERMISSION_GROUPS.USER_MANAGEMENT,
      ...AUTH_PERMISSION_GROUPS.ROLE_MANAGEMENT
    ]
  },
  
  /**
   * User manager role - can view and update users, but not create or delete
   */
  USER_MANAGER: {
    name: 'user_manager',
    description: 'User manager with limited user management capabilities',
    permissions: [
      AUTH_PERMISSIONS.VIEW_USERS,
      AUTH_PERMISSIONS.UPDATE_USERS
    ]
  },
  
  /**
   * System admin role - can manage auth system settings and logs
   */
  SYSTEM_ADMIN: {
    name: 'system_admin',
    description: 'System administrator with access to auth settings and logs',
    permissions: [
      ...AUTH_PERMISSION_GROUPS.SYSTEM_MANAGEMENT
    ]
  }
};

/**
 * Role mapping to standard application roles
 * Maps specialized auth roles to standard application roles
 */
export const AUTH_ROLE_MAPPING = {
  [ROLES.SUPER_ADMIN]: [
    AUTH_ROLES.USER_ADMIN.name,
    AUTH_ROLES.SYSTEM_ADMIN.name
  ],
  [ROLES.ADMIN]: [
    AUTH_ROLES.USER_ADMIN.name
  ],
  [ROLES.MANAGER]: [
    AUTH_ROLES.USER_MANAGER.name
  ],
  [ROLES.USER]: [],
  [ROLES.GUEST]: [],
  [ROLES.API]: []
};

export default AUTH_ROLES;