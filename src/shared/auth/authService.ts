import { TOKEN_CONFIG, AUTH_ENDPOINTS, AUTH_ROUTES, API_CONFIG } from './apiConfig';
import { formatAuthError, debugJwtToken } from './utils';
import { UserProfile, RegistrationData } from './types';
import { Permission, Role } from './permissions';
import { tokenManager } from '@/shared/api/tokenManager';

interface TokenData {
  jwtToken?: string;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
}

class AuthService {
  private userProfile: UserProfile | null = null;
  private sessionCheckInterval: NodeJS.Timeout | null = null;
  private lastCheck = 0;
  private readonly CHECK_INTERVAL = 60000; // 1 minute
  private readonly DEFAULT_EXPIRY = 8 * 60 * 60; // 8 hours

  constructor() {
    if (typeof window !== 'undefined') {
      this.startSessionMonitoring();
    }
  }

  private startSessionMonitoring = () => {
    if (typeof window === 'undefined') return;
    
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }
    
    this.sessionCheckInterval = setInterval(this.checkSession, 5 * 60 * 1000);
  };

  private checkSession = async () => {
    const now = Date.now();
    
    if (now - this.lastCheck < this.CHECK_INTERVAL) return;
    this.lastCheck = now;

    if (!this.isAuthenticated()) return;
    
    const expiry = parseInt(localStorage.getItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY) || '0');
    if (now > expiry - 5 * 60 * 1000) {
      await this.refreshToken();
    }
  };

  login = async (emailAddress: string, password: string): Promise<UserProfile> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ emailAddress, password })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown login error' }));
        throw new Error(error.error || 'Login failed');
      }

      const data: TokenData = await response.json();
      this.saveTokens(data);

      // Debug token for troubleshooting
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
      const tokenDebug = debugJwtToken(token);
      console.log('Token debug after login:', tokenDebug);
      
      const userProfile = await this.getUserProfile();
      this.userProfile = userProfile;
      return userProfile;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(formatAuthError(error));
    }
  };

  register = async (data: RegistrationData): Promise<void> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(formatAuthError(error));
    }
  };

  getUserProfile = async (): Promise<UserProfile> => {
    try {
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
      if (!token) {
        throw new Error('No access token available');
      }
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.USER_PROFILE}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile (${response.status})`);
      }

      const profile = await response.json();
      this.userProfile = profile;
      
      // Save decoded profile data
      localStorage.setItem(TOKEN_CONFIG.USER_PROFILE_KEY, JSON.stringify(profile));
      
      return profile;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  };

  hasPermission = async (permission: Permission): Promise<boolean> => {
    try {
      if (!this.userProfile) {
        await this.getUserProfile();
      }
      return this.userProfile?.permissions.includes(permission) || false;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  };

  hasRole = async (role: Role): Promise<boolean> => {
    try {
      if (!this.userProfile) {
        await this.getUserProfile();
      }
      return this.userProfile?.roles.includes(role) || false;
    } catch (error) {
      console.error('Role check error:', error);
      return false;
    }
  };

  logout = async () => {
    try {
      // Call backend logout endpoint if it exists
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
      if (token) {
        try {
          await fetch(`${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.LOGOUT}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (error) {
          console.warn('Logout endpoint error:', error);
        }
      }

      if (this.sessionCheckInterval) {
        clearInterval(this.sessionCheckInterval);
        this.sessionCheckInterval = null;
      }

      this.clearStorage();
      window.location.href = AUTH_ROUTES.LOGIN;
    } catch (error) {
      console.error('Logout error:', error);
      this.clearStorage();
      window.location.href = AUTH_ROUTES.LOGIN;
    }
  };

  isAuthenticated = () => {
    const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
    
    if (!token || !expiry) return false;
    return Date.now() < parseInt(expiry);
  };

  refreshToken = async () => {
    const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/token/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) throw new Error('Token refresh failed');

      const data: TokenData = await response.json();
      this.saveTokens(data);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  private saveTokens = (data: TokenData | string) => {
    try {
      let token: string | null = null;
      let expiresIn = this.DEFAULT_EXPIRY;
      let refreshToken: string | null = null;

      // Handle different response formats
      if (typeof data === 'string') {
        token = data;
      } else if (data.jwtToken) {
        token = data.jwtToken;
      } else if (data.access_token) {
        token = data.access_token;
        refreshToken = data.refresh_token || null;
        expiresIn = data.expires_in || this.DEFAULT_EXPIRY;
      }

      if (!token) {
        throw new Error('No token found in response');
      }

      // Save to localStorage
      localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, token);
      if (refreshToken) {
        localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, refreshToken);
      }
      const expiryTime = Date.now() + (expiresIn * 1000);
      localStorage.setItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY, expiryTime.toString());

      // Sync with tokenManager
      tokenManager.setToken(token);
      tokenManager.setTokenExpiry(expiryTime);
      if (refreshToken) {
        tokenManager.setRefreshToken(refreshToken);
      }

      console.log('Tokens saved successfully');
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  };

  private clearStorage = () => {
    localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
    localStorage.removeItem(TOKEN_CONFIG.USER_PROFILE_KEY);

    // Clear tokenManager
    tokenManager.removeToken();

    // Clear cookies too
    document.cookie.split(';').forEach(cookie => 
      document.cookie = cookie.split('=')[0] + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/');
  };

  resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(formatAuthError(error));
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error(formatAuthError(error));
    }
  };

  destroy = () => {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  };
}

const authService = new AuthService();
export { authService };
export default authService;
