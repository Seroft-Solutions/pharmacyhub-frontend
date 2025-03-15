/**
 * Token Manager Interface
 */
export interface TokenManager {
  /**
   * Get the current access token with Bearer prefix
   */
  getToken(): string | null;
  
  /**
   * Set a new access token
   */
  setToken(token: string): void;
  
  /**
   * Set a new refresh token
   */
  setRefreshToken(token: string): void;
  
  /**
   * Get the stored refresh token
   */
  getStoredRefreshToken(): string | null;
  
  /**
   * Set token expiration timestamp
   */
  setTokenExpiry(expiryTime: number): void;
  
  /**
   * Remove all tokens from storage
   */
  removeToken(): void;
  
  /**
   * Check if a valid token exists
   */
  hasToken(): boolean;
  
  /**
   * Refresh the access token using the refresh token
   */
  refreshToken(): Promise<string | null>;
}
