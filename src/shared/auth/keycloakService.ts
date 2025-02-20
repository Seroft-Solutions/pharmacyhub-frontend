/**
 * Keycloak Service
 * 
 * This service handles all interactions with the Keycloak server,
 * including authentication, registration, and token management.
 */

import { Permission, Role, UserType, GROUP_PATHS, GroupPath } from './permissions';
import { 
  KEYCLOAK_CONFIG, 
  KEYCLOAK_ENDPOINTS, 
  TOKEN_CONFIG
} from './apiConfig';

// Types
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  id_token?: string;
  session_state?: string;
  scope?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  permissions: Permission[];
  groups: string[];
  userType: UserType;
  attributes?: Record<string, unknown>;
}

export interface RegistrationData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  userType: UserType;
  phoneNumber?: string;
  additionalInfo?: Record<string, unknown>;
}

interface KeycloakGroup {
  id: string;
  path: string;
  subGroups?: KeycloakGroup[];
}

/**
 * Keycloak Service Class
 */
class KeycloakService {
  private adminToken: string | null = null;
  private adminTokenExpiry: number = 0;
  private lastTokenRefresh: number = 0;
  private refreshInProgress: boolean = false;
  private refreshPromise: Promise<boolean> | null = null;
  private sessionCheckInterval: NodeJS.Timeout | null = null;
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.startSessionMonitoring();
    }
  }

  /**
   * Start session monitoring to prevent unexpected logouts
   */
  private startSessionMonitoring(): void {
    if (typeof window === 'undefined') return;
    
    // Clear any existing interval
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }
    
    // Check session every 2 minutes
    this.sessionCheckInterval = setInterval(() => {
      if (this.isAuthenticated()) {
        this.checkSession().catch(err => {
          console.warn('Session check failed:', err);
        });
      }
    }, 2 * 60 * 1000); // 2 minutes
  }

  /**
   * Check if session is still valid and refresh if needed
   */
  private async checkSession(): Promise<void> {
    try {
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
      if (!token) return;
      
      const expiryStr = localStorage.getItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
      if (!expiryStr) return;
      
      const expiry = parseInt(expiryStr);
      const currentTime = Date.now();
      
      // If token expires within the next 5 minutes, refresh it
      if (currentTime > expiry - 5 * 60 * 1000) {
        await this.refreshToken();
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  }

  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<UserProfile> {
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('client_id', KEYCLOAK_CONFIG.CLIENT_ID);
      formData.append('client_secret', KEYCLOAK_CONFIG.CLIENT_SECRET);
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(KEYCLOAK_ENDPOINTS.TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const tokenData: TokenResponse = await response.json();
      this.saveTokens(tokenData);

      const userProfile = await this.getUserProfile();
      localStorage.setItem(TOKEN_CONFIG.USER_PROFILE_KEY, JSON.stringify(userProfile));

      return userProfile;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout the current user
   */
  logout(): void {
    localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
    localStorage.removeItem(TOKEN_CONFIG.USER_PROFILE_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
    
    if (!token || !expiry) {
      return false;
    }
    
    const expiryTime = parseInt(expiry);
    const currentTime = Date.now();
    
    // If token is about to expire, trigger refresh in background
    if (currentTime > expiryTime - 5 * 60 * 1000) { // 5 minute buffer
      this.triggerBackgroundRefresh();
    }
    
    // Check if token is expired (with 30-second buffer)
    return currentTime < expiryTime - 30000;
  }

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<UserProfile> {
    const token = await this.getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const tokenData = this.parseToken(token);
    
    if (!tokenData) {
      throw new Error('Invalid token');
    }
    
    // Get cached profile first
    const cachedProfile = localStorage.getItem(TOKEN_CONFIG.USER_PROFILE_KEY);
    if (cachedProfile) {
      return JSON.parse(cachedProfile);
    }

    // Otherwise construct from token data
    const userProfile: UserProfile = {
      id: tokenData.sub,
      username: tokenData.preferred_username as string,
      email: tokenData.email as string,
      firstName: tokenData.given_name as string,
      lastName: tokenData.family_name as string,
      roles: (tokenData.roles as Role[]) || [],
      permissions: (tokenData.permissions as Permission[]) || [],
      groups: (tokenData.groups as string[]) || [],
      userType: (tokenData.userType as UserType) || 'GENERAL_USER',
      attributes: tokenData.attributes as Record<string, unknown> | undefined,
    };

    // Cache the profile
    localStorage.setItem(TOKEN_CONFIG.USER_PROFILE_KEY, JSON.stringify(userProfile));
    
    return userProfile;
  }

  /**
   * Get access token with automatic refresh if needed
   */
  async getAccessToken(): Promise<string | null> {
    // If there's a refresh in progress, wait for it
    if (this.refreshPromise) {
      await this.refreshPromise;
    }
    
    if (!this.isAuthenticated()) {
      // Try to refresh the token
      const refreshed = await this.refreshToken();
      if (!refreshed) {
        return null;
      }
    }
    
    return localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
  }

  /**
   * Trigger a background token refresh
   */
  private triggerBackgroundRefresh(): void {
    // Avoid multiple simultaneous refresh attempts
    if (this.refreshInProgress) {
      return;
    }
    
    // Throttle refresh attempts
    const now = Date.now();
    if (now - this.lastTokenRefresh < 1000 * 30) { // 30 seconds
      return;
    }
    
    this.refreshInProgress = true;
    this.lastTokenRefresh = now;
    
    // Use a promise to handle concurrent refreshes
    this.refreshPromise = this.refreshToken().finally(() => {
      this.refreshInProgress = false;
      this.refreshPromise = null;
    });
  }

  /**
   * Refresh the access token
   */
  async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      return false;
    }
    
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'refresh_token');
      formData.append('client_id', KEYCLOAK_CONFIG.CLIENT_ID);
      formData.append('client_secret', KEYCLOAK_CONFIG.CLIENT_SECRET);
      formData.append('refresh_token', refreshToken);
      
      const response = await fetch(KEYCLOAK_ENDPOINTS.TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      const tokenData: TokenResponse = await response.json();
      this.saveTokens(tokenData);
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  /**
   * Save tokens to storage
   */
  private saveTokens(tokenData: TokenResponse): void {
    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, tokenData.access_token);
    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, tokenData.refresh_token);
    
    // Calculate token expiry time
    const expiryTime = Date.now() + (tokenData.expires_in * 1000);
    localStorage.setItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  /**
   * Parse JWT token
   */
  private parseToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  /**
   * Clean up on class destruction
   */
  destroy(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  }
}

// Create and export the singleton instance
const keycloakService = new KeycloakService();

export { keycloakService };
export default keycloakService;