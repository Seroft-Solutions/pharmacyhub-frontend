import { 
  LoginCredentials, 
  LoginResponse, 
  RegistrationData, 
  RegisterResponse,
  VerificationResponse,
  ResetPasswordData,
  UserProfile,
  TokenData
} from '../model/types';
import { tokenManager } from '../lib/tokenManager';
import { isTokenExpired, parseToken } from '../lib/authUtils';

// Default API configuration
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '/api'
};

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  USER_PROFILE: '/auth/user-profile',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/token/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  RESEND_VERIFICATION: '/auth/resend-verification'
};

const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard'
};

/**
 * Format API errors into user-friendly messages
 */
export const formatAuthError = (error: any): string => {
  // Handle Axios error objects
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (status === 401) {
      return 'Invalid username or password';
    }
    
    if (status === 403) {
      return 'You do not have permission to access this resource';
    }
    
    if (status === 422 || status === 400) {
      // Validation errors
      if (data.message) return data.message;
      if (data.error) return data.error;
      if (data.errors) {
        const firstError = Object.values(data.errors)[0];
        return Array.isArray(firstError) ? firstError[0] : String(firstError);
      }
    }
    
    return `Error: ${data.message || data.error || 'Unknown error'}`;
  }
  
  // Network errors
  if (error.request) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }
  
  // Plain error objects
  if (error.message) {
    return error.message;
  }
  
  // Fallback
  return 'An unexpected error occurred';
};

/**
 * Debug JWT token for troubleshooting (only in development)
 */
export const debugJwtToken = (token: string | null): any => {
  if (!token) return { error: 'No token provided' };
  
  try {
    const decoded = parseToken(token);
    return {
      sub: decoded.sub,
      email: decoded.email,
      roles: decoded.roles || [],
      permissions: decoded.permissions || [],
      expires: new Date(decoded.exp * 1000).toISOString(),
      expired: isTokenExpired(token)
    };
  } catch (error) {
    return { error: 'Invalid token format' };
  }
};

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
    
    const token = tokenManager.getToken();
    if (token && isTokenExpired(token)) {
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
      if (process.env.NODE_ENV === 'development') {
        const token = tokenManager.getToken();
        console.log('Token debug after login:', token ? debugJwtToken(token) : 'No token');
      }
      
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
      const token = tokenManager.getToken();
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
      
      return profile;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  };

  hasPermission = async (permission: string): Promise<boolean> => {
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

  hasRole = async (role: string): Promise<boolean> => {
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
      const token = tokenManager.getToken();
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

      tokenManager.removeToken();
      this.userProfile = null;
      window.location.href = AUTH_ROUTES.LOGIN;
    } catch (error) {
      console.error('Logout error:', error);
      tokenManager.removeToken();
      this.userProfile = null;
      window.location.href = AUTH_ROUTES.LOGIN;
    }
  };

  isAuthenticated = () => {
    return tokenManager.hasToken();
  };

  refreshToken = async () => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`, {
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

  private saveTokens = (data: TokenData) => {
    try {
      let token: string | null = null;
      let expiresIn = this.DEFAULT_EXPIRY;
      let refreshToken: string | null = null;

      // Handle different response formats
      if (data.jwtToken) {
        token = data.jwtToken;
      } else if (data.access_token) {
        token = data.access_token;
        refreshToken = data.refresh_token || null;
        expiresIn = data.expires_in || this.DEFAULT_EXPIRY;
      }

      if (!token) {
        throw new Error('No token found in response');
      }

      // Save to tokenManager
      tokenManager.setToken(token);
      tokenManager.setTokenExpiry(Date.now() + (expiresIn * 1000));
      if (refreshToken) {
        tokenManager.setRefreshToken(refreshToken);
      }

      console.log('Tokens saved successfully');
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  };

  resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.RESET_PASSWORD}`, {
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

  requestPasswordReset = async (email: string): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.FORGOT_PASSWORD}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(formatAuthError(error));
      }

      return { success: true };
    } catch (error) {
      console.error('Password reset request error:', error);
      throw new Error(formatAuthError(error));
    }
  };

  verifyEmail = async (token: string): Promise<VerificationResponse> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.VERIFY_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(formatAuthError(error));
      }

      return await response.json();
    } catch (error) {
      console.error('Email verification error:', error);
      throw new Error(formatAuthError(error));
    }
  };

  resendVerificationEmail = async (email: string): Promise<{ success: boolean }> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.RESEND_VERIFICATION}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(formatAuthError(error));
      }

      return { success: true };
    } catch (error) {
      console.error('Resend verification error:', error);
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

export const authService = new AuthService();
export default authService;