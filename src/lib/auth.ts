import { jwtDecode } from 'jwt-decode';
import { AuthError, Permission, Role, TokenData } from '../types/auth';

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

interface JWTPayload {
  sub: string;
  email: string;
  roles?: string[];
  authorities?: string[];
  scope?: string;
  permissions?: string[];
  exp: number;
}

export const parseToken = (token: string): JWTPayload => {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch {
    throw new Error('Invalid token format');
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = parseToken(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const shouldRefreshToken = (token: string): boolean => {
  try {
    const decoded = parseToken(token);
    return (decoded.exp * 1000) - Date.now() <= TOKEN_REFRESH_THRESHOLD;
  } catch {
    return true;
  }
};

export const hasPermission = (userPermissions: string[], requiredPermission: Permission): boolean => {
  return userPermissions.includes(requiredPermission);
};

export const hasRole = (userRoles: string[], requiredRole: Role): boolean => {
  // Define role hierarchy
  const roleHierarchy: Record<Role, Role[]> = {
    'SUPER_ADMIN': ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'PROPRIETOR', 'SALESMAN', 'INSTRUCTOR', 'USER'] as Role[],
    'ADMIN': ['ADMIN', 'MANAGER', 'PHARMACY_MANAGER', 'PHARMACIST', 'PROPRIETOR', 'SALESMAN', 'INSTRUCTOR', 'USER'] as Role[],
    'MANAGER': ['MANAGER', 'USER'] as Role[],
    'PHARMACY_MANAGER': ['PHARMACY_MANAGER', 'USER'] as Role[],
    'USER': ['USER'] as Role[],
    'PHARMACIST': ['PHARMACIST', 'USER'] as Role[],
    'PROPRIETOR': ['PROPRIETOR', 'USER'] as Role[],
    'SALESMAN': ['SALESMAN', 'USER'] as Role[],
    'INSTRUCTOR': ['INSTRUCTOR', 'USER'] as Role[]
  };

  // Direct match - the user has the exact role required
  if (userRoles.includes(requiredRole)) {
    return true;
  }

  // Hierarchical match - the user has a role that implies the required role
  const impliedRoles = roleHierarchy[requiredRole] || [];
  return impliedRoles.some(role => userRoles.includes(role));
};

/**
 * Extract roles from JWT token based on Spring Security format
 */
export const extractRolesFromToken = (token: string): Role[] => {
  try {
    const decoded = parseToken(token);
    const roles: string[] = [];
    
    // Extract from authorities claim (Spring Security standard)
    if (decoded.authorities) {
      const roleClaims = decoded.authorities
        .filter(auth => auth.startsWith('ROLE_'))
        .map(role => role.replace('ROLE_', ''));
      roles.push(...roleClaims);
    }
    
    // Extract from roles claim (if present)
    if (decoded.roles) {
      roles.push(...decoded.roles);
    }
    
    return roles.filter(role => 
      ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'PHARMACY_MANAGER', 'USER', 
       'PHARMACIST', 'PROPRIETOR', 'SALESMAN', 'INSTRUCTOR'].includes(role)
    ) as Role[];
  } catch (error) {
    console.error('Error extracting roles from token:', error);
    return [];
  }
};

/**
 * Extract permissions from JWT token
 */
export const extractPermissionsFromToken = (token: string): Permission[] => {
  try {
    const decoded = parseToken(token);
    const permissions: string[] = [];
    
    // Extract from authorities that aren't roles
    if (decoded.authorities) {
      const permissionClaims = decoded.authorities
        .filter(auth => !auth.startsWith('ROLE_'));
      permissions.push(...permissionClaims);
    }
    
    // Extract from permissions claim
    if (decoded.permissions) {
      permissions.push(...decoded.permissions);
    }
    
    // Extract from scope claim (common in OAuth)
    if (decoded.scope && typeof decoded.scope === 'string') {
      permissions.push(...decoded.scope.split(' '));
    }
    
    // Filter to valid permissions only
    return permissions.filter(perm => 
      ['manage_system', 'manage_users', 'manage_staff', 'view_reports', 
       'approve_orders', 'manage_inventory', 'view_products', 'place_orders',
       'create:pharmacy', 'edit:pharmacy', 'delete:pharmacy', 'view:pharmacy',
       'manage:users', 'view:users', 'manage:roles', 'manage:exams', 
       'take:exams', 'grade:exams', 'UPDATE_STATUS'].includes(perm)
    ) as Permission[];
  } catch (error) {
    console.error('Error extracting permissions from token:', error);
    return [];
  }
};

interface ApiError extends Error {
  response?: {
    status: number;
  };
}

export const handleAuthError = (error: ApiError): AuthError => {
  if (error?.response?.status === 401) {
    return {
      code: 'UNAUTHORIZED',
      message: 'Your session has expired',
      action: 'REFRESH_TOKEN'
    };
  }

  if (error?.response?.status === 403) {
    return {
      code: 'FORBIDDEN',
      message: 'You do not have permission to perform this action',
      action: 'LOGOUT'
    };
  }

  return {
    code: 'UNKNOWN',
    message: 'An unexpected error occurred',
    action: 'RETRY'
  };
};

export const setTokens = (tokens: TokenData): void => {
  // Store token in localStorage for your backend integration
  if (typeof window !== 'undefined') {
    localStorage.setItem('pharmacyhub_token', JSON.stringify(tokens));
  }
};

export const clearTokens = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('pharmacyhub_token');
    localStorage.removeItem('pharmacyhub_user');
  }
};

export const createAuthHeaders = (token: string): Record<string, string> => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

/**
 * Validate user access rights based on roles and permissions
 * 
 * @param userRoles - User's roles
 * @param userPermissions - User's permissions
 * @param requiredRoles - Roles required for access
 * @param requiredPermissions - Permissions required for access 
 * @param requireAll - If true, requires all roles/permissions; if false, any one is sufficient
 */
export const validateAccessRights = (
  userRoles: string[],
  userPermissions: string[],
  requiredRoles?: Role[],
  requiredPermissions?: Permission[],
  requireAll: boolean = false
): boolean => {
  // No requirements means access is allowed
  if (!requiredRoles?.length && !requiredPermissions?.length) {
    return true;
  }

  // Handle role-based access
  let hasRequiredRoles = true;
  if (requiredRoles?.length) {
    if (requireAll) {
      // User must have ALL required roles
      hasRequiredRoles = requiredRoles.every(role => hasRole(userRoles, role));
    } else {
      // User must have ANY required role
      hasRequiredRoles = requiredRoles.some(role => hasRole(userRoles, role));
    }
  }

  // Handle permission-based access
  let hasRequiredPermissions = true;
  if (requiredPermissions?.length) {
    if (requireAll) {
      // User must have ALL required permissions
      hasRequiredPermissions = requiredPermissions.every(
        permission => hasPermission(userPermissions, permission)
      );
    } else {
      // User must have ANY required permission
      hasRequiredPermissions = requiredPermissions.some(
        permission => hasPermission(userPermissions, permission)
      );
    }
  }

  // Both role and permission requirements must be satisfied
  return hasRequiredRoles && hasRequiredPermissions;
};