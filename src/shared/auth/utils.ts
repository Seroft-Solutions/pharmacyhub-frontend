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

/**
 * Debug and validate JWT token structure
 * Returns information about the token for troubleshooting
 */
export const debugJwtToken = (token: string | null): { valid: boolean, message: string, payload?: any } => {
  if (!token) {
    return { valid: false, message: 'No token provided' };
  }
  
  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, message: `Invalid JWT structure - expected 3 parts, got ${parts.length}` };
  }
  
  try {
    const payload = parseJwtToken(token);
    if (!payload) {
      return { valid: false, message: 'Failed to parse token payload' };
    }
    
    return { 
      valid: true, 
      message: 'Token structure is valid', 
      payload: {
        // Only include non-sensitive parts for logging
        sub: payload.sub,
        exp: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'not set',
        roles: payload.roles || [],
        hasRoles: Array.isArray(payload.roles) && payload.roles.length > 0,
        // If token expiry exists, check if token is expired
        expired: payload.exp ? (Date.now() >= payload.exp * 1000) : false
      }
    };
  } catch (error) {
    return { valid: false, message: `Error parsing token: ${error}` };
  }
};