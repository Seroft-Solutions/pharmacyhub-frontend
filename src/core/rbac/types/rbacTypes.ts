/**
 * RBAC Type Definitions
 * 
 * This file contains TypeScript interfaces and types for Role-Based Access Control functionality.
 * These types are used throughout the RBAC module to ensure type safety and provide IntelliSense.
 */
import { NormalizedError } from '../utils/errorHandling';

/**
 * Represents a permission string
 * Format: 'resource:action'
 * Example: 'users:read', 'articles:delete'
 */
export type Permission = string;

/**
 * Represents a role in the system
 * Example: 'admin', 'editor', 'user'
 */
export type Role = string;

/**
 * Represents a role definition
 * @property name - The name of the role
 * @property permissions - The list of permissions granted to this role
 * @property description - Optional description of the role
 */
export interface RoleDefinition {
  name: Role;
  permissions: Permission[];
  description?: string;
}

/**
 * Represents the permissions granted to a user
 * @property roles - The roles assigned to the user
 * @property permissions - The permissions granted to the user
 */
export interface UserPermissions {
  roles: Role[];
  permissions: Permission[];
}

/**
 * Represents the state of the RBAC module
 * @property isInitialized - Whether the RBAC module has been initialized
 * @property isLoading - Whether the RBAC module is currently loading data
 * @property error - Any error that occurred during initialization or permission checking
 * @property userPermissions - The permissions granted to the current user
 */
export interface RbacState {
  isInitialized: boolean;
  isLoading: boolean;
  error: NormalizedError | null;
  userPermissions: UserPermissions | null;
}

/**
 * Represents a permission check result
 * @property hasPermission - Whether the user has the requested permission
 * @property isLoading - Whether the permission check is still loading
 * @property error - Any error that occurred during the permission check
 */
export interface PermissionCheckResult {
  hasPermission: boolean;
  isLoading: boolean;
  error: NormalizedError | null;
}

/**
 * Options for permission checking
 * @property all - If true, the user must have all permissions to pass the check
 * @property throwOnError - If true, throw an error if the permission check fails
 */
export interface PermissionCheckOptions {
  all?: boolean;
  throwOnError?: boolean;
}

/**
 * Represents a permission guard function to protect components or routes
 * @param permissions - The permissions required to access the component or route
 * @param options - Options for the permission check
 * @returns True if the user has the required permissions, false otherwise
 */
export type PermissionGuard = (
  permissions: Permission | Permission[],
  options?: PermissionCheckOptions
) => boolean;