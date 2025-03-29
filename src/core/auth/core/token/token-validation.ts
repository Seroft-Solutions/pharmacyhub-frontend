/**
 * Token Validation
 * 
 * Provides functions for token validation, parsing, and extraction.
 */
import { logger } from '@/shared/lib/logger';
import { tokenStorage } from './token-storage';

/**
 * Token validation and parsing functions
 */
export const tokenValidation = {
  /**
   * Check if a valid token exists
   */
  hasValidToken: (): boolean => {
    const token = tokenStorage.getAccessToken();
    if (!token) return false;
    
    // Check expiry
    const expiry = tokenStorage.getTokenExpiry();
    if (expiry && Date.now() >= expiry) {
      logger.debug('[Auth] Token expired');
      return false;
    }
    
    return true;
  },
  
  /**
   * Format a token for Authorization header
   */
  getAuthHeader: (): string | null => {
    const token = tokenStorage.getAccessToken();
    if (!token) return null;
    
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  },
  
  /**
   * Extract user roles from JWT token
   */
  extractRolesFromToken: (token: string): string[] => {
    try {
      // Extract the payload part of the JWT
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      
      // Extract roles from token payload
      if (payload.roles && Array.isArray(payload.roles)) {
        return payload.roles;
      }
      
      // Or try to get from authorities if roles doesn't exist
      if (payload.authorities && Array.isArray(payload.authorities)) {
        return payload.authorities
          .filter((auth: string) => auth.startsWith('ROLE_'))
          .map((role: string) => role.replace('ROLE_', ''));
      }
      
      return [];
    } catch (error) {
      logger.error('[Auth] Failed to extract roles from token', error);
      return [];
    }
  }
};
