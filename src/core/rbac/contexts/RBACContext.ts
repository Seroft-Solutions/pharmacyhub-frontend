/**
 * RBAC Context
 * 
 * This file defines the React context for Role-Based Access Control.
 */
import { createContext } from 'react';
import { Permission, PermissionCheckOptions, Role } from '../types';

/**
 * RBAC context type
 */
export interface RBACContextType {
  /**
   * Check if the user has a permission
   * @param permission Permission to check
   * @returns True if the user has the permission
   */
  hasPermission: (permission: Permission) => boolean;
  
  /**
   * Check if the user has any of the specified permissions
   * @param permissions Permissions to check
   * @returns True if the user has any of the permissions
   */
  hasAnyPermission: (permissions: Permission[]) => boolean;
  
  /**
   * Check if the user has all of the specified permissions
   * @param permissions Permissions to check
   * @returns True if the user has all of the permissions
   */
  hasAllPermissions: (permissions: Permission[]) => boolean;
  
  /**
   * Check if the user has a role
   * @param role Role to check
   * @param checkInheritance Whether to check role inheritance
   * @returns True if the user has the role
   */
  hasRole: (role: Role, checkInheritance?: boolean) => boolean;
  
  /**
   * Check if the user has any of the specified roles
   * @param roles Roles to check
   * @param checkInheritance Whether to check role inheritance
   * @returns True if the user has any of the roles
   */
  hasAnyRole: (roles: Role[], checkInheritance?: boolean) => boolean;
  
  /**
   * Check if the user has all of the specified roles
   * @param roles Roles to check
   * @param checkInheritance Whether to check role inheritance
   * @returns True if the user has all of the roles
   */
  hasAllRoles: (roles: Role[], checkInheritance?: boolean) => boolean;
  
  /**
   * Check if the user is authorized based on roles or permissions
   * @param rolesOrPermissions Roles or permissions to check
   * @param options Permission check options
   * @returns True if the user is authorized
   */
  isAuthorized: (rolesOrPermissions: (Role | Permission)[], options?: PermissionCheckOptions) => boolean;
  
  /**
   * Get all permissions for the current user
   * @returns Array of permission strings
   */
  getUserPermissions: () => Permission[];
  
  /**
   * Get all roles for the current user
   * @returns Array of role strings
   */
  getUserRoles: () => Role[];
  
  /**
   * Whether the RBAC service is initialized
   */
  isInitialized: boolean;
  
  /**
   * Whether the RBAC service is loading
   */
  isLoading: boolean;
}

// Create the context with default values
const RBACContext = createContext<RBACContextType | undefined>(undefined);

export default RBACContext;