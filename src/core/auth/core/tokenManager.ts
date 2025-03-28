/**
 * Token Management Module
 * 
 * Provides utilities for handling authentication tokens securely.
 * Manages token storage, retrieval, and validation.
 */
import { logger } from '@/shared/lib/logger';
import { unwrapAuthResponse } from '@/core/api/utils/transforms';
import { DEVICE_STORAGE_KEY } from '../constants/device';
import { generateUUID } from '../utils/device/deviceManager';

// Define storage keys for tokens
export const TOKEN_CONFIG = {
  // Primary storage keys
  ACCESS_TOKEN_KEY: 'accessToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  TOKEN_EXPIRY_KEY: 'tokenExpiry',
  DEVICE_ID_KEY: DEVICE_STORAGE_KEY,
  
  // Legacy keys for backward compatibility
  LEGACY: {
    ACCESS_TOKEN: ['auth_token', 'access_token'],
    REFRESH_TOKEN: ['refresh_token'],
    TOKEN_EXPIRY: ['token_expiry']
  }
};

/**
 * Token manager for handling auth tokens
 */
export const tokenManager = {
  /**
   * Set the access token in storage
   */
  setToken: (token: string): void => {
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
  getToken: (): string | null => {
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
  removeToken: (): void => {
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
  
  /**
   * Get the device ID from localStorage or generate a new one
   */
  getDeviceId: (): string => {
    if (typeof window === 'undefined') return '';
    
    try {
      let deviceId = localStorage.getItem(TOKEN_CONFIG.DEVICE_ID_KEY);
      
      if (!deviceId) {
        deviceId = generateUUID();
        localStorage.setItem(TOKEN_CONFIG.DEVICE_ID_KEY, deviceId);
        logger.debug('[Auth] Generated new device ID');
      }
      
      return deviceId;
    } catch (error) {
      logger.error('[Auth] Error getting device ID', error);
      return '';
    }
  },
  
  /**
   * Check if a valid token exists
   */
  hasToken: (): boolean => {
    const token = tokenManager.getToken();
    if (!token) return false;
    
    // Check expiry
    const expiry = tokenManager.getTokenExpiry();
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
    const token = tokenManager.getToken();
    if (!token) return null;
    
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  },

  /**
   * Initialize tokens from a login response
   */
  initializeFromAuthResponse: (response: any): void => {
    // Unwrap the response to handle different formats
    const unwrappedResponse = unwrapAuthResponse(response);
    
    if (!unwrappedResponse || !unwrappedResponse.tokens) {
      logger.error('[Auth] Invalid auth response format', { 
        original: response,
        unwrapped: unwrappedResponse 
      });
      return;
    }

    const { tokens } = unwrappedResponse;
    
    if (tokens.accessToken) {
      logger.debug('[Auth] Setting access token');
      tokenManager.setToken(tokens.accessToken);
      
      // Set expiry if provided
      if (tokens.expiresIn) {
        const expiry = Date.now() + (tokens.expiresIn * 1000);
        logger.debug(`[Auth] Setting token expiry: ${new Date(expiry).toISOString()}`);
        tokenManager.setTokenExpiry(expiry);
      }
      
      // Set refresh token if provided
      if (tokens.refreshToken) {
        logger.debug('[Auth] Setting refresh token');
        tokenManager.setRefreshToken(tokens.refreshToken);
      }
      
      // Ensure device ID is set
      tokenManager.getDeviceId();
    }
  },
  
  /**
   * Clear all auth-related data from storage
   */
  clearAll: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      // Clear tokens
      tokenManager.removeToken();
      tokenManager.removeRefreshToken();
      
      // Clear expiry
      localStorage.removeItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
      TOKEN_CONFIG.LEGACY.TOKEN_EXPIRY.forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Clear any other auth-related data
      localStorage.removeItem('auth_user');
      localStorage.removeItem('user_profile');
      
      // Note: We don't clear the device ID on logout
      // This allows us to track the same device across sessions
      
      logger.debug('[Auth] All auth data cleared from storage');
    } catch (error) {
      logger.error('[Auth] Error clearing auth data', error);
    }
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
  },
  
  /**
   * Get auth data for login request
   * Includes device information for anti-sharing protection
   */
  getAuthDataForLogin: (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    
    return {
      deviceId: tokenManager.getDeviceId(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
    };
  }
};

export default tokenManager;
