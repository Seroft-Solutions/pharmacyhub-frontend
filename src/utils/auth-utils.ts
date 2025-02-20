import type { Role, Permission } from "@/types/auth-types";

export function hasRole(userRoles: string[], requiredRoles: Role[], requireAll: boolean = false): boolean {
  if (!userRoles?.length || !requiredRoles?.length) return false;
  
  return requireAll
    ? requiredRoles.every(role => userRoles.includes(role))
    : requiredRoles.some(role => userRoles.includes(role));
}

export function hasPermission(userPermissions: string[], requiredPermissions: Permission[], requireAll: boolean = false): boolean {
  if (!userPermissions?.length || !requiredPermissions?.length) return false;
  
  return requireAll
    ? requiredPermissions.every(permission => userPermissions.includes(permission))
    : requiredPermissions.some(permission => userPermissions.includes(permission));
}

export interface AuthConfig {
  roles?: Role[];
  permissions?: Permission[];
  requireAllRoles?: boolean;
  requireAllPermissions?: boolean;
}

export function isAuthorized(
  userRoles: string[],
  userPermissions: string[],
  config: AuthConfig
): boolean {
  const {
    roles = [],
    permissions = [],
    requireAllRoles = false,
    requireAllPermissions = false
  } = config;

  // If no roles or permissions are specified, allow access
  if (!roles.length && !permissions.length) return true;

  // Check roles if specified
  const hasRequiredRoles = !roles.length || hasRole(userRoles, roles, requireAllRoles);

  // Check permissions if specified
  const hasRequiredPermissions = !permissions.length || 
    hasPermission(userPermissions, permissions, requireAllPermissions);

  // Require both roles and permissions if both are specified
  return hasRequiredRoles && hasRequiredPermissions;
}

export function getAuthError(
  userRoles: string[],
  userPermissions: string[],
  config: AuthConfig
): string | null {
  const {
    roles = [],
    permissions = [],
    requireAllRoles = false,
    requireAllPermissions = false
  } = config;

  if (!roles.length && !permissions.length) return null;

  const missingRoles = roles.filter(role => !userRoles.includes(role));
  const missingPermissions = permissions.filter(permission => !userPermissions.includes(permission));

  if (missingRoles.length && roles.length) {
    return `Missing required role${requireAllRoles ? 's' : ''}: ${missingRoles.join(', ')}`;
  }

  if (missingPermissions.length && permissions.length) {
    return `Missing required permission${requireAllPermissions ? 's' : ''}: ${missingPermissions.join(', ')}`;
  }

  return null;
}