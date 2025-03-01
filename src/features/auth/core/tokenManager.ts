import { TokenManager } from './types';
import { logger } from '@/shared/lib/logger';

export const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  TOKEN_EXPIRY_KEY: 'token_expiry',
  USER_PROFILE_KEY: 'user_profile'
};

/**
 * Enhanced TokenManager implementation with:
 * - Better error handling
 * - Consistent token storage and retrieval
 * - Proper memory/local storage synchronization
 * - Debug logging
 */
class EnhancedTokenManager implements TokenManager {
  private readonly accessTokenKey: string;
  private readonly refreshTokenKey: string;
  private readonly expiryKey: string;
  private accessToken: string | null = null;
  private storedRefreshToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor(
    accessTokenKey: string = TOKEN_CONFIG.ACCESS_TOKEN_KEY, 
    refreshTokenKey: string = TOKEN_CONFIG.REFRESH_TOKEN_KEY,
    expiryKey: string = TOKEN_CONFIG.TOKEN_EXPIRY_KEY
  ) {
    this.accessTokenKey = accessTokenKey;
    this.refreshTokenKey = refreshTokenKey;
    this.expiryKey = expiryKey;
    
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  /**
   * Load tokens from localStorage into memory
   */
  private loadFromStorage(): void {
    try {
      this.accessToken = localStorage.getItem(this.accessTokenKey);
      this.storedRefreshToken = localStorage.getItem(this.refreshTokenKey);
      const expiryStr = localStorage.getItem(this.expiryKey);
      this.tokenExpiry = expiryStr ? parseInt(expiryStr) : null;
    } catch (error) {
      logger.error('Failed to load tokens from storage', { error });
    }
  }

  /**
   * Get access token with Bearer prefix
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;

    // Lazy load from storage if needed
    if (this.accessToken === null) {
      this.loadFromStorage();
    }

    if (!this.accessToken) {
      logger.debug('No access token available');
      return null;
    }

    // Ensure token has Bearer prefix
    return this.accessToken.startsWith('Bearer ') 
      ? this.accessToken 
      : `Bearer ${this.accessToken}`;
  }

  /**
   * Set access token and save to storage
   */
  setToken(token: string): void {
    if (typeof window === 'undefined') return;

    try {
      // Remove Bearer prefix if present
      const cleanToken = token.replace('Bearer ', '');
      
      // Update in-memory token
      this.accessToken = cleanToken;
      
      // Save to localStorage
      localStorage.setItem(this.accessTokenKey, cleanToken);
      
      logger.debug('Access token saved', { 
        tokenStart: cleanToken.substring(0, 10) + '...',
        length: cleanToken.length
      });
    } catch (error) {
      logger.error('Failed to save access token', { error });
    }
  }

  /**
   * Set refresh token
   */
  setRefreshToken(token: string): void {
    if (typeof window === 'undefined') return;

    try {
      this.storedRefreshToken = token;
      localStorage.setItem(this.refreshTokenKey, token);
    } catch (error) {
      logger.error('Failed to save refresh token', { error });
    }
  }

  /**
   * Get stored refresh token
   */
  getStoredRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;

    if (this.storedRefreshToken === null) {
      this.storedRefreshToken = localStorage.getItem(this.refreshTokenKey);
    }

    return this.storedRefreshToken;
  }

  /**
   * Set token expiry timestamp
   */
  setTokenExpiry(expiryTime: number): void {
    if (typeof window === 'undefined') return;

    try {
      this.tokenExpiry = expiryTime;
      localStorage.setItem(this.expiryKey, expiryTime.toString());
    } catch (error) {
      logger.error('Failed to save token expiry', { error });
    }
  }

  /**
   * Remove all tokens from storage
   */
  removeToken(): void {
    if (typeof window === 'undefined') return;

    try {
      // Clear memory
      this.accessToken = null;
      this.storedRefreshToken = null;
      this.tokenExpiry = null;
      
      // Clear storage
      localStorage.removeItem(this.accessTokenKey);
      localStorage.removeItem(this.refreshTokenKey);
      localStorage.removeItem(this.expiryKey);
      localStorage.removeItem(TOKEN_CONFIG.USER_PROFILE_KEY); // Also clear user profile
      
      logger.debug('Tokens and user profile removed from storage');
    } catch (error) {
      logger.error('Failed to remove tokens', { error });
    }
  }

  /**
   * Check if token exists and is not expired
   */
  hasToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Check expiration
    if (this.tokenExpiry) {
      const isExpired = Date.now() >= this.tokenExpiry;
      if (isExpired) {
        logger.debug('Token is expired', { expiry: new Date(this.tokenExpiry).toISOString() });
        return false;
      }
      return true;
    }
    
    // If no expiry info, just check token existence
    return true;
  }

  /**
   * Refresh token implementation
   */
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = this.getStoredRefreshToken();
      if (!refreshToken) {
        logger.error('No refresh token available for token refresh');
        return null;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed with status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.token) {
        throw new Error('No token in refresh response');
      }

      // Save the new token
      this.setToken(data.token);
      
      // Set new expiry if provided
      if (data.expiresIn) {
        const expiryTime = Date.now() + (data.expiresIn * 1000);
        this.setTokenExpiry(expiryTime);
      }
      
      // Save new refresh token if provided
      if (data.refreshToken) {
        this.setRefreshToken(data.refreshToken);
      }

      return data.token;
    } catch (error) {
      logger.error('Token refresh failed', { error });
      return null;
    }
  }
}

// Create a singleton instance with default configuration
export const tokenManager = new EnhancedTokenManager();

// Factory function for creating custom token managers
export const createTokenManager = (config?: {
  accessTokenKey?: string;
  refreshTokenKey?: string;
  expiryKey?: string;
}): TokenManager => {
  return new EnhancedTokenManager(
    config?.accessTokenKey,
    config?.refreshTokenKey,
    config?.expiryKey
  );
};

export default tokenManager;
