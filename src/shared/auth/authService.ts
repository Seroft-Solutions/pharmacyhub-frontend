import { TOKEN_CONFIG, AUTH_ENDPOINTS, AUTH_ROUTES } from './apiConfig';
import { formatAuthError } from './utils';
import { UserProfile, RegistrationData } from './types';
import { Permission, Role } from './permissions';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

class AuthService {
  private userProfile: UserProfile | null = null;
  private sessionCheckInterval: NodeJS.Timeout | null = null;
  private lastCheck = 0;
  private readonly CHECK_INTERVAL = 60000; // 1 minute

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

  login = async (username: string, password: string): Promise<UserProfile> => {
    try {
      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      this.saveTokens(data);
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
      const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
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
      const response = await fetch(AUTH_ENDPOINTS.USER_PROFILE, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY)}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const profile = await response.json();
      this.userProfile = profile;
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
      try {
        await fetch(AUTH_ENDPOINTS.LOGOUT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY)}`
          }
        });
      } catch (error) {
        console.warn('Logout endpoint error:', error);
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
      const response = await fetch('/api/auth/token/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) throw new Error('Token refresh failed');

      const data = await response.json();
      this.saveTokens(data);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  private saveTokens = (data: TokenResponse) => {
    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, data.access_token);
    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, data.refresh_token);
    localStorage.setItem(
      TOKEN_CONFIG.TOKEN_EXPIRY_KEY, 
      (Date.now() + (data.expires_in * 1000)).toString()
    );
  };

  private clearStorage = () => {
    localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
    localStorage.removeItem(TOKEN_CONFIG.USER_PROFILE_KEY);
    document.cookie.split(';').forEach(cookie => 
      document.cookie = cookie.split('=')[0] + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/');
  };

  resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      const response = await fetch(`/api/auth/reset-password`, {
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
