import { apiClient } from '../apiClient';
import type { ApiResponse } from '../apiClient';
import { User } from './userService';

/**
 * Login request interface
 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Registration request interface
 */
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  termsAccepted: boolean;
}

/**
 * Auth token response
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

/**
 * Authentication service for handling login, registration, and tokens
 */
export const authService = {
  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<AuthResponse>('/auth/login', data, { requiresAuth: false });
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<AuthResponse>('/auth/register', data, { requiresAuth: false });
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/auth/logout');
  },

  /**
   * Refresh the authentication token
   */
  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthTokens>> => {
    return apiClient.post<AuthTokens>('/auth/token/refresh', { refreshToken }, { requiresAuth: false });
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/auth/verify-email', { token }, { requiresAuth: false });
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>('/auth/request-password-reset', { email }, { requiresAuth: false });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string, confirmPassword: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(
      '/auth/reset-password', 
      { token, newPassword, confirmPassword }, 
      { requiresAuth: false }
    );
  },

  /**
   * Get the current user profile
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return apiClient.get<User>('/auth/me');
  },

  /**
   * Store auth tokens in local storage
   */
  storeTokens: (tokens: AuthTokens): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    
    // Store token expiry
    const expiryTime = Date.now() + (tokens.expiresIn * 1000);
    localStorage.setItem('tokenExpiry', expiryTime.toString());
  },

  /**
   * Remove auth tokens from storage
   */
  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');
  },

  /**
   * Check if the user is authenticated
   */
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    // Check token expiration
    const expiryStr = localStorage.getItem('tokenExpiry');
    if (expiryStr) {
      const expiry = parseInt(expiryStr, 10);
      if (Date.now() >= expiry) {
        // Token has expired
        return false;
      }
    }
    
    return true;
  }
};

export default authService;
