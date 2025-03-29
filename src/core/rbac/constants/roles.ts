/**
 * Role Constants
 * 
 * This file defines standard application roles as constants to prevent typos
 * and make role changes easier to track and manage.
 */

/**
 * Standard user roles
 */
export const ROLES = {
  /**
   * Super administrator with full access to all system functions
   */
  SUPER_ADMIN: 'super_admin',
  
  /**
   * Administrator with access to most system functions
   */
  ADMIN: 'admin',
  
  /**
   * Manager role with elevated privileges but less than admin
   */
  MANAGER: 'manager',
  
  /**
   * Standard user role with basic access
   */
  USER: 'user',
  
  /**
   * Guest role with minimal access
   */
  GUEST: 'guest',
  
  /**
   * API access role for system integrations
   */
  API: 'api'
};

/**
 * Role hierarchy
 * Defines which roles inherit permissions from other roles
 */
export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: [ROLES.ADMIN, ROLES.MANAGER, ROLES.USER, ROLES.GUEST],
  [ROLES.ADMIN]: [ROLES.MANAGER, ROLES.USER, ROLES.GUEST],
  [ROLES.MANAGER]: [ROLES.USER, ROLES.GUEST],
  [ROLES.USER]: [ROLES.GUEST],
  [ROLES.GUEST]: [],
  [ROLES.API]: []
};

/**
 * Get all roles that a given role inherits from
 * @param role The role to check
 * @returns Array of inherited roles
 */
export function getInheritedRoles(role: string): string[] {
  return ROLE_HIERARCHY[role] || [];
}

/**
 * Check if a role inherits from another role
 * @param role The role to check
 * @param inheritsFrom The role it might inherit from
 * @returns True if role inherits from inheritsFrom
 */
export function roleInheritsFrom(role: string, inheritsFrom: string): boolean {
  if (role === inheritsFrom) {
    return true;
  }
  
  const inheritedRoles = ROLE_HIERARCHY[role] || [];
  return inheritedRoles.includes(inheritsFrom) || 
    inheritedRoles.some(r => roleInheritsFrom(r, inheritsFrom));
}

export default ROLES;