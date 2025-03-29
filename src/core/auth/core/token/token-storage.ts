/**
 * Token Storage
 * 
 * Provides functionality for storing and retrieving tokens from localStorage.
 */
import { logger } from '@/shared/lib/logger';
import { TOKEN_CONFIG } from './token-constants';

/**
 * Token storage functions for handling tokens in localStorage
 */
export const tokenStorage = {
  /**
   * Set the access token in storage
   */
  setAccessToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      // Store in primary location
      localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, token);
      
      // Store in legacy locations for compatibility
      TOKEN_CONFIG.LEGACY.ACCESS_TOKEN.forEach(key => {
        localStorage.setItem(key, token);
      });
      
      logger.debug('[Auth] Token set successfully');
    } catch (error) {
      logger.error('[Auth] Error setting token', error);
    }
  },
  
  /**
   * Get the current access token
   */
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      // Try primary storage location first
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
      if (token) return token;
      
      // Fall back to legacy locations
      for (const key of TOKEN_CONFIG.LEGACY.ACCESS_TOKEN) {
        const legacyToken = localStorage.getItem(key);
        if (legacyToken) return legacyToken;
      }
      
      logger.debug('[Auth] No token found in storage');
      return null;
    } catch (error) {
      logger.error('[Auth] Error retrieving token', error);
      return null;
    }
  },
  
  /**
   * Remove the access token from all storage locations
   */
  removeAccessToken: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      // Remove from primary location
      localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
      
      // Remove from legacy locations
      TOKEN_CONFIG.LEGACY.ACCESS_TOKEN.forEach(key => {
        localStorage.removeItem(key);
      });
      
      logger.debug('[Auth] Token removed from storage');
    } catch (error) {
      logger.error('[Auth] Error removing token', error);
    }
  },
  
  /**
   * Set the refresh token
   */
  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      // Store in primary location
      localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, token);
      
      // Store in legacy locations
      TOKEN_CONFIG.LEGACY.REFRESH_TOKEN.forEach(key => {
        localStorage.setItem(key, token);
      });
    } catch (error) {
      logger.error('[Auth] Error setting refresh token', error);
    }
  },
  
  /**
   * Get the current refresh token
   */
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      // Try primary storage location first
      const token = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
      if (token) return token;
      
      // Fall back to legacy locations
      for (const key of TOKEN_CONFIG.LEGACY.REFRESH_TOKEN) {
        const legacyToken = localStorage.getItem(key);
        if (legacyToken) return legacyToken;
      }
      
      return null;
    } catch (error) {
      logger.error('[Auth] Error retrieving refresh token', error);
      return null;
    }
  },
  
  /**
   * Remove the refresh token from all storage locations
   */
  removeRefreshToken: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      // Remove from primary location
      localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
      
      // Remove from legacy locations
      TOKEN_CONFIG.LEGACY.REFRESH_TOKEN.forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      logger.error('[Auth] Error removing refresh token', error);
    }
  },
  
  /**
   * Set the token expiry timestamp
   */
  setTokenExpiry: (expiryTime: number): void => {
    if (typeof window === 'undefined') return;
    
    try {
      // Store in primary location
      localStorage.setItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY, expiryTime.toString());
      
      // Store in legacy locations
      TOKEN_CONFIG.LEGACY.TOKEN_EXPIRY.forEach(key => {
        localStorage.setItem(key, expiryTime.toString());
      });
    } catch (error) {
      logger.error('[Auth] Error setting token expiry', error);
    }
  },
  
  /**
   * Get the token expiry timestamp
   */
  getTokenExpiry: (): number | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      // Try primary storage location first
      const expiry = localStorage.getItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
      if (expiry) return parseInt(expiry, 10);
      
      // Fall back to legacy locations
      for (const key of TOKEN_CONFIG.LEGACY.TOKEN_EXPIRY) {
        const legacyExpiry = localStorage.getItem(key);
        if (legacyExpiry) return parseInt(legacyExpiry, 10);
      }
      
      return null;
    } catch (error) {
      logger.error('[Auth] Error retrieving token expiry', error);
      return null;
    }
  },
};
