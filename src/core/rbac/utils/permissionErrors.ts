/**
 * Permission Error Utilities
 * 
 * This file provides utilities for permission-related error handling.
 */
import { NormalizedError } from './errorUtils';

/**
 * Create a permission denied error
 * @param permission The permission that was denied
 * @returns Normalized error object
 */
export function createPermissionDeniedError(permission: string): NormalizedError {
  return {
    message: `Permission denied: ${permission}`,
    code: 'PERMISSION_DENIED',
    details: {
      permission,
    },
  };
}

/**
 * Create a role denied error
 * @param role The role that was denied
 * @returns Normalized error object
 */
export function createRoleDeniedError(role: string): NormalizedError {
  return {
    message: `Role check failed: ${role}`,
    code: 'ROLE_DENIED',
    details: {
      role,
    },
  };
}