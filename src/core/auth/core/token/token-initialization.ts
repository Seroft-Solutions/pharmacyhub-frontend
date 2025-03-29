/**
 * Token Initialization
 * 
 * Handles initializing tokens from API responses and clearing token data.
 */
import { logger } from '@/shared/lib/logger';
import { unwrapAuthResponse } from '@/core/api/utils/transforms';
import { tokenStorage } from './token-storage';

/**
 * Token initialization functions
 */
export const tokenInitialization = {
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
      tokenStorage.setAccessToken(tokens.accessToken);
      
      // Set expiry if provided
      if (tokens.expiresIn) {
        const expiry = Date.now() + (tokens.expiresIn * 1000);
        logger.debug(`[Auth] Setting token expiry: ${new Date(expiry).toISOString()}`);
        tokenStorage.setTokenExpiry(expiry);
      }
      
      // Set refresh token if provided
      if (tokens.refreshToken) {
        logger.debug('[Auth] Setting refresh token');
        tokenStorage.setRefreshToken(tokens.refreshToken);
      }
    }
  },
  
  /**
   * Clear all auth-related data from storage
   */
  clearAllTokens: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      // Clear tokens
      tokenStorage.removeAccessToken();
      tokenStorage.removeRefreshToken();
      
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
  }
};

// Import here to avoid circular dependencies
import { TOKEN_CONFIG } from './token-constants';
