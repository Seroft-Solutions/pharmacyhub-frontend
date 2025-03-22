/**
 * Auth API Service
 * 
 * This service provides methods for interacting with the authentication API.
 * It's designed for use in both React and non-React environments.
 */
import { 
  createExtendedApiService, 
  apiClient, 
  ApiResponse 
} from '@/features/core/tanstack-query-api';
import { AUTH_ENDPOINTS } from '../constants';
import type {
  User,
  UserProfile,
  UserPreferences,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  AuthTokens,
  PasswordResetRequest,
  PasswordResetCompletion,
  PasswordChangeRequest,
  UserUpdatePayload
} from '../types';
import { logger } from '@/shared/lib/logger';

/**
 * Token management utilities
 */
export const tokenStorage = {
  /**
   * Store authentication tokens in localStorage
   */
  storeTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);

    // Store token expiry
    const expiryTime = Date.now() + (tokens.expiresIn * 1000);
    localStorage.setItem('tokenExpiry', expiryTime.toString());
    localStorage.setItem('token_expiry', expiryTime.toString());
  },

  /**
   * Clear authentication tokens from localStorage
   */
  clearTokens(): void {
    if (typeof window === 'undefined') return;
    
    // Clear all token-related values from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiry');

  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('accessToken') || 
                 localStorage.getItem('auth_token') || 
                 localStorage.getItem('access_token');
    if (!token) return false;
    
    // Check token expiration
    const expiryStr = localStorage.getItem('tokenExpiry') || 
                     localStorage.getItem('token_expiry');
    if (expiryStr) {
      const expiry = parseInt(expiryStr, 10);
      if (Date.now() >= expiry) {
        // Token has expired
        return false;
      }
    }
    
    return true;
  },

  /**
   * Get access token
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    return localStorage.getItem('accessToken') || 
           localStorage.getItem('auth_token') || 
           localStorage.getItem('access_token');
  },
  
  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    return localStorage.getItem('refreshToken') || 
           localStorage.getItem('refresh_token');
  },
  
  /**
   * Extracts user roles from JWT token
   */
  extractRolesFromToken(token: string): string[] {
    try {
      // Extract the payload part of the JWT
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );

      const payload = JSON.parse(jsonPayload);
      
      // Extract roles from token payload
      if (payload.roles && Array.isArray(payload.roles)) {
        return payload.roles;
      }
      
      // Or try to get from authorities if roles doesn't exist
      if (payload.authorities && Array.isArray(payload.authorities)) {
        return payload.authorities
          .filter(auth => auth.startsWith('ROLE_'))
          .map(role => role.replace('ROLE_', ''));
      }
      
      return [];
    } catch (error) {
      console.error('Failed to extract roles from token', error);
      return [];
    }
  }
};

/**
 * Extended API service for authentication operations
 */
export const authApiService = createExtendedApiService<User, {
  // Authentication operations
  login: (credentials: LoginRequest) => Promise<ApiResponse<AuthResponse>>;
  register: (userData: RegisterRequest) => Promise<ApiResponse<AuthResponse>>;
  logout: () => Promise<ApiResponse<void>>;
  refreshToken: (token: string) => Promise<ApiResponse<AuthTokens>>;
  
  // Profile operations
  getUserProfile: () => Promise<ApiResponse<UserProfile>>;
  updateUserProfile: (data: UserUpdatePayload) => Promise<ApiResponse<UserProfile>>;
  changePassword: (data: PasswordChangeRequest) => Promise<ApiResponse<void>>;
  updatePreferences: (data: Partial<UserPreferences>) => Promise<ApiResponse<UserPreferences>>;
  
  // Password reset
  requestPasswordReset: (email: string) => Promise<ApiResponse<void>>;
  validateResetToken: (token: string) => Promise<ApiResponse<{ valid: boolean }>>;
  resetPassword: (data: PasswordResetCompletion) => Promise<ApiResponse<void>>;
  
  // Email verification
  verifyEmail: (token: string) => Promise<ApiResponse<void>>;
  checkEmailVerification: (email: string) => Promise<ApiResponse<{ verified: boolean }>>;
  
  // Token management
  handleAuthResponse: (response: ApiResponse<AuthResponse>) => void;
  clearAuthData: () => void;
  getAuthHeader: () => string | null;
}>(
  AUTH_ENDPOINTS.USERS_LIST,
  {
    // Authentication operations
    login: async (credentials) => {
      const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
      if (response.data?.tokens) {
        tokenStorage.storeTokens(response.data.tokens);
      }
      return response;
    },
    
    register: async (userData) => {
      const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.REGISTER, userData);
      if (response.data?.tokens) {
        tokenStorage.storeTokens(response.data.tokens);
      }
      return response;
    },
    
    logout: async () => {
      try {
        const response = await apiClient.post<void>(AUTH_ENDPOINTS.LOGOUT);
        tokenStorage.clearTokens();
        return response;
      } catch (error) {
        // Even if the logout request fails, we still clear the tokens
        tokenStorage.clearTokens();
        throw error;
      }
    },
    
    refreshToken: async (token) => {
      const response = await apiClient.post<AuthTokens>(
        AUTH_ENDPOINTS.REFRESH_TOKEN, 
        { refreshToken: token }
      );
      if (response.data) {
        tokenStorage.storeTokens(response.data);
      }
      return response;
    },
    
    // Profile operations
    getUserProfile: async () => {
      // Ensure we're using the correct endpoint
      logger.debug('[Auth] Getting user profile with endpoint:', AUTH_ENDPOINTS.PROFILE);
      
      // Get the user profile
      const response = await apiClient.get<UserProfile>(AUTH_ENDPOINTS.PROFILE);
      
      // Log the raw response to see what we're getting
      logger.debug('[Auth] User profile raw response:', {
        status: response.status,
        success: response.success,
        hasData: !!response.data,
        hasMetadata: !!response.metadata,
        metadata: response.metadata
      });
      
      // Check if there's a userType in metadata
      if (response.metadata && response.metadata.userType) {
        const userType = response.metadata.userType;
        
        // If it's an ADMIN user, make sure roles include ADMIN
        if (userType === 'ADMIN' && response.data) {
          if (!response.data.roles) {
            response.data.roles = [];
          }
          
          if (!response.data.roles.includes('ADMIN')) {
            logger.debug('[Auth] Adding ADMIN role from metadata.userType');
            response.data.roles.push('ADMIN');
          }
        }
      }
      
      return response;
    },
    
    updateUserProfile: async (data) => {
      return await apiClient.patch<UserProfile>(AUTH_ENDPOINTS.UPDATE_PROFILE, data);
    },
    
    changePassword: async (data) => {
      return await apiClient.post<void>(AUTH_ENDPOINTS.CHANGE_PASSWORD, data);
    },
    
    updatePreferences: async (data) => {
      return await apiClient.patch<UserPreferences>(AUTH_ENDPOINTS.UPDATE_PREFERENCES, data);
    },
    
    // Password reset
    requestPasswordReset: async (email) => {
      return await apiClient.post<void>(AUTH_ENDPOINTS.REQUEST_PASSWORD_RESET, { email });
    },
    
    validateResetToken: async (token) => {
      return await apiClient.get<{ valid: boolean }>(
        `${AUTH_ENDPOINTS.VALIDATE_RESET_TOKEN}/${token}`
      );
    },
    
    resetPassword: async (data) => {
      return await apiClient.post<void>(AUTH_ENDPOINTS.RESET_PASSWORD, data);
    },
    
    // Email verification
    verifyEmail: async (token) => {
      return await apiClient.post<void>(AUTH_ENDPOINTS.VERIFY_EMAIL, { token });
    },
    
    checkEmailVerification: async (email) => {
      return await apiClient.get<{ verified: boolean }>(
        `${AUTH_ENDPOINTS.VERIFY_EMAIL_STATUS}/${encodeURIComponent(email)}`
      );
    },
    
    // Token management helpers
    handleAuthResponse: (response) => {
      if (response.data?.tokens) {
        tokenStorage.storeTokens(response.data.tokens);
      }
    },
    
    clearAuthData: () => {
      tokenStorage.clearTokens();
    },
    
    getAuthHeader: () => {
      const token = tokenStorage.getToken();
      if (!token) return null;
      
      return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }
  }
);

// Export the service and token utilities
export default authApiService;