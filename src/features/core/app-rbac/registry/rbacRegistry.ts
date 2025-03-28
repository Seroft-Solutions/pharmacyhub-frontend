/**
 * RBAC Registry
 * 
 * Central registry for Role-Based Access Control that integrates with feature-specific permissions.
 * This module maps roles to permissions based on feature requirements.
 */

import { Role, ROLE_HIERARCHY } from '../constants/roles';
import { 
  getAllPermissions, 
  getAllFeatures, 
  getAllPermissionValues 
} from './featureRegistry';

// Maps roles to their granted permissions
// This is populated by the initializeRbacRegistry function
let ROLE_PERMISSIONS: Record<Role, string[]> = {
  [Role.SUPER_ADMIN]: [], // Will be populated with all permissions
  [Role.ADMIN]: [],
  [Role.PHARMACIST]: [],
  [Role.PHARMACY_MANAGER]: [],
  [Role.TECHNICIAN]: [],
  [Role.PROPRIETOR]: [],
  [Role.USER]: []
};

/**
 * Initialize the RBAC registry by collecting permissions from all features
 */
export function initializeRbacRegistry(): Record<Role, string[]> {
  const allPermissions = getAllPermissions();
  const allFeatures = getAllFeatures();
  
  // Reset the permissions map
  ROLE_PERMISSIONS = {
    [Role.SUPER_ADMIN]: [],
    [Role.ADMIN]: [],
    [Role.PHARMACIST]: [],
    [Role.PHARMACY_MANAGER]: [],
    [Role.TECHNICIAN]: [],
    [Role.PROPRIETOR]: [],
    [Role.USER]: []
  };
  
  // Populate Super Admin with all permissions
  ROLE_PERMISSIONS[Role.SUPER_ADMIN] = getAllPermissionValues();
  
  // For each feature, assign permissions based on required roles
  Object.values(allFeatures).forEach(feature => {
    const featurePermissions = Object.values(feature.permissions);
    
    // Assign feature permissions to each role that requires them
    feature.requiredRoles.forEach(roleId => {
      if (Object.values(Role).includes(roleId as Role)) {
        const role = roleId as Role;
        
        // Add all permissions for this feature to the role
        ROLE_PERMISSIONS[role] = [
          ...ROLE_PERMISSIONS[role],
          ...featurePermissions
        ];
      }
    });
  });
  
  // Apply role hierarchy - roles inherit permissions from roles below them
  Object.entries(ROLE_HIERARCHY).forEach(([roleKey, inheritedRoles]) => {
    const role = roleKey as Role;
    inheritedRoles.forEach(inheritedRole => {
      ROLE_PERMISSIONS[role] = [
        ...ROLE_PERMISSIONS[role],
        ...ROLE_PERMISSIONS[inheritedRole]
      ];
    });
  });
  
  // Deduplicate permissions
  Object.keys(ROLE_PERMISSIONS).forEach(role => {
    ROLE_PERMISSIONS[role as Role] = [...new Set(ROLE_PERMISSIONS[role as Role])];
  });
  
  return ROLE_PERMISSIONS;
}

/**
 * Get all permissions for a role
 */
export function getPermissionsForRole(role: Role): string[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if a role has a specific permission
 */
export function roleHasPermission(role: Role, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}

/**
 * Get all roles that have a specific permission
 */
export function getRolesWithPermission(permission: string): Role[] {
  return Object.entries(ROLE_PERMISSIONS)
    .filter(([_, permissions]) => permissions.includes(permission))
    .map(([role, _]) => role as Role);
}

/**
 * Reset and update the RBAC registry
 * This should be called whenever features or permissions are updated
 */
export function updateRbacRegistry(): void {
  initializeRbacRegistry();
}
