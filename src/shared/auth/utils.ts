/**
 * Authentication Utilities
 * 
 * Common utility functions used across the authentication system,
 * with proper type definitions for security and maintainability.
 * @module
 */

/**
 * Creates standard authentication headers for API requests
 */
export const createAuthHeaders = (token: string): Record<string, string> => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
});

interface JwtPayload {
  sub: string;
  email: string;
  name?: string;
  roles: string[];
  permissions: string[];
  exp: number;
}

/**
 * Parse JWT token and extract payload
 */
export const parseJwtToken = (token: string): JwtPayload | null => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error('Failed to parse JWT token:', error);
    return null;
  }
};

/**
 * Check if a JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = parseJwtToken(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
};

interface KeycloakError {
  error?: string;
  error_description?: string;
  message?: string;
}

function isKeycloakError(error: unknown): error is KeycloakError {
  return typeof error === 'object' && 
         error !== null && 
         ('error_description' in error || 'message' in error);
}

/**
 * Format error messages from Keycloak responses
 */
export const formatAuthError = (error: unknown): string => {
  if (typeof error === 'string') return error;
  
  if (isKeycloakError(error)) {
    if (error.error_description) return error.error_description;
    if (error.message) return error.message;
    if (error.error) return error.error;
  }
  
  return 'An unexpected authentication error occurred';
};