/**
 * Token management utilities for handling
 * authentication tokens securely.
 */

// Define storage keys for tokens
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: 'accessToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  TOKEN_EXPIRY_KEY: 'tokenExpiry',
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
    
    // Store in standard location
    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, token);
    
    // Store in legacy locations for compatibility
    localStorage.setItem('auth_token', token);
    localStorage.setItem('access_token', token);
    
    // Log token setting for debugging
    console.log('[Auth] Token set successfully');
  },
  
  /**
   * Get the current access token
   */
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    
    // Try all possible storage locations
    const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY) ||
                 localStorage.getItem('auth_token') ||
                 localStorage.getItem('access_token');
                 
    if (!token) {
      console.warn('[Auth] No token found in storage');
      return null;
    }
    
    // Debug token retrieval
    console.log('[Auth] Token retrieved successfully');
    return token;
  },
  
  /**
   * Remove the access token
   */
  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    
    // Remove from all possible storage locations
    localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('access_token');
    
    console.log('[Auth] Token removed from storage');
  },
  
  /**
   * Set the refresh token
   */
  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, token);
    localStorage.setItem('refresh_token', token); // Legacy
  },
  
  /**
   * Get the current refresh token
   */
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    
    return (
      localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY) ||
      localStorage.getItem('refresh_token')
    );
  },
  
  /**
   * Remove the refresh token
   */
  removeRefreshToken: (): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem('refresh_token');
  },
  
  /**
   * Set the token expiry timestamp
   */
  setTokenExpiry: (expiryTime: number): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY, expiryTime.toString());
    localStorage.setItem('token_expiry', expiryTime.toString()); // Legacy
  },
  
  /**
   * Get the token expiry timestamp
   */
  getTokenExpiry: (): number | null => {
    if (typeof window === 'undefined') return null;
    
    const expiry = (
      localStorage.getItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY) ||
      localStorage.getItem('token_expiry')
    );
    
    return expiry ? parseInt(expiry, 10) : null;
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
      console.log('[Auth] Token expired');
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
   * Initialize tokens from a response (like after login)
   */
  initializeFromLoginResponse: (response: any): void => {
    if (!response || !response.data) return;

    // Extract tokens from response
    const { tokens } = response.data;
    
    if (tokens?.accessToken) {
      tokenManager.setToken(tokens.accessToken);
      
      // Set expiry if provided
      if (tokens.expiresIn) {
        const expiry = Date.now() + (tokens.expiresIn * 1000);
        tokenManager.setTokenExpiry(expiry);
      }
      
      // Set refresh token if provided
      if (tokens.refreshToken) {
        tokenManager.setRefreshToken(tokens.refreshToken);
      }
    }
  },
  
  /**
   * Debug token information in console
   */
  debugTokenInfo: (): void => {
    if (typeof window === 'undefined') return;
    
    const token = tokenManager.getToken();
    if (!token) {
      console.log('[Auth Debug] No token found');
      return;
    }
    
    try {
      // Extract the payload part of the JWT
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      
      console.log('[Auth Debug] Token payload:', {
        roles: payload.roles,
        permissions: payload.permissions,
        exp: new Date(payload.exp * 1000).toLocaleString(),
        sub: payload.sub
      });
    } catch (err) {
      console.error('[Auth Debug] Error decoding token:', err);
    }
  }
};

export default tokenManager;
