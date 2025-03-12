import { apiClient } from '@/features/tanstack-query-api/core/apiClient';
import type { ApiResponse } from '@/features/tanstack-query-api/core/apiClient';
import { User } from './userService';
import { AUTH_ROUTES } from '../../constants/routes';

/**
 * Login request interface
 */
export interface LoginRequest {
  emailAddress: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Updated Registration request interface to match backend
 */
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  contactNumber?: string;
  userType?: string;
  openToConnect?: boolean;
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
    return apiClient.post<AuthResponse>(AUTH_ROUTES.LOGIN, data, { requiresAuth: false });
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<AuthResponse>(AUTH_ROUTES.REGISTER, data, { requiresAuth: false });
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(AUTH_ROUTES.LOGOUT);
  },

  /**
   * Refresh the authentication token
   */
  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthTokens>> => {
    return apiClient.post<AuthTokens>(AUTH_ROUTES.REFRESH_TOKEN, { refreshToken }, { requiresAuth: false });
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(AUTH_ROUTES.VERIFY_EMAIL, { token }, { requiresAuth: false });
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(AUTH_ROUTES.REQUEST_PASSWORD_RESET, { email }, { requiresAuth: false });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string, confirmPassword: string): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(
      AUTH_ROUTES.RESET_PASSWORD, 
      { token, newPassword, confirmPassword }, 
      { requiresAuth: false }
    );
  },

  /**
   * Get the current user profile
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    return apiClient.get<User>(AUTH_ROUTES.PROFILE);
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
