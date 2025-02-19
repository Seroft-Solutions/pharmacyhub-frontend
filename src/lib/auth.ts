import { jwtDecode } from 'jwt-decode';
import { AuthError, Permission, Role, TokenData } from '../types/auth';

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

interface JWTPayload {
  sub: string;
  email: string;
  roles: string[];
  permissions: string[];
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
  const roleHierarchy: Record<Role, Role[]> = {
    'SUPER_ADMIN': ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER'],
    'ADMIN': ['ADMIN', 'MANAGER', 'USER'],
    'MANAGER': ['MANAGER', 'USER'],
    'USER': ['USER']
  };

  return roleHierarchy[requiredRole].some(role => userRoles.includes(role));
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
  const secure = process.env.NODE_ENV === 'production';
  const sameSite = 'strict';
  
  // Set HTTP-only cookies
  document.cookie = `access_token=${tokens.access}; path=/; secure=${secure}; samesite=${sameSite}; httponly`;
  document.cookie = `refresh_token=${tokens.refresh}; path=/; secure=${secure}; samesite=${sameSite}; httponly`;
  document.cookie = `token_expires=${tokens.expires}; path=/; secure=${secure}; samesite=${sameSite}`;
};

export const clearTokens = (): void => {
  document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = 'token_expires=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

export const createAuthHeaders = (token: string): Record<string, string> => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

export const validateAccessRights = (
  userRoles: string[],
  userPermissions: string[],
  requiredRoles?: Role[],
  requiredPermissions?: Permission[]
): boolean => {
  if (!requiredRoles?.length && !requiredPermissions?.length) {
    return true;
  }

  const hasRequiredRole = requiredRoles?.some(role => hasRole(userRoles, role)) ?? true;
  const hasRequiredPermission = requiredPermissions?.every(
    permission => hasPermission(userPermissions, permission)
  ) ?? true;

  return hasRequiredRole && hasRequiredPermission;
};