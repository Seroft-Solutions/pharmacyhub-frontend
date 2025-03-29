/**
 * Access Control Type Definitions
 * 
 * This file contains TypeScript interfaces and types for access control functionality.
 * These types are used throughout the RBAC module to ensure type safety and provide IntelliSense.
 */

import { Permission, Role } from './rbacTypes';
import { NormalizedError } from '../utils/errorHandling';

/**
 * Represents an access profile
 * @property id - Unique identifier for the access profile
 * @property name - Human-readable name for the access profile
 * @property roles - The roles included in this access profile
 * @property permissions - The permissions included in this access profile
 * @property description - Optional description of the access profile
 */
export interface AccessProfile {
  id: string;
  name: string;
  roles: Role[];
  permissions: Permission[];
  description?: string;
}

/**
 * Represents a user's access control information
 * @property userId - The ID of the user
 * @property profiles - The access profiles assigned to the user
 * @property roles - The roles assigned to the user (combination of all profile roles and direct roles)
 * @property permissions - The permissions granted to the user (combination of all profile permissions and direct permissions)
 * @property directRoles - Roles assigned directly to the user (not through profiles)
 * @property directPermissions - Permissions assigned directly to the user (not through profiles or roles)
 */
export interface UserAccess {
  userId: string;
  profiles: AccessProfile[];
  roles: Role[];
  permissions: Permission[];
  directRoles: Role[];
  directPermissions: Permission[];
}

/**
 * Access check result
 * @property hasAccess - Whether the user has the required access
 * @property isLoading - Whether the access check is still loading
 * @property error - Any error that occurred during the access check
 */
export interface AccessCheckResult {
  hasAccess: boolean;
  isLoading: boolean;
  error: NormalizedError | null;
}

/**
 * Options for access checking
 * @property throwOnError - If true, throw an error if the access check fails
 * @property all - If true, the user must have all specified roles or permissions
 * @property checkBoth - If true, check both roles and permissions
 */
export interface AccessCheckOptions {
  throwOnError?: boolean;
  all?: boolean;
  checkBoth?: boolean;
}

/**
 * Feature access parameters
 * @property featureId - The ID of the feature to check access for
 * @property roles - Roles required to access the feature
 * @property permissions - Permissions required to access the feature
 */
export interface FeatureAccessParams {
  featureId: string;
  roles?: Role[];
  permissions?: Permission[];
}

/**
 * Feature access check result
 * @property hasAccess - Whether the user has access to the feature
 * @property isLoading - Whether the access check is still loading
 * @property error - Any error that occurred during the access check
 */
export interface FeatureAccessResult {
  hasAccess: boolean;
  isLoading: boolean;
  error: NormalizedError | null;
}