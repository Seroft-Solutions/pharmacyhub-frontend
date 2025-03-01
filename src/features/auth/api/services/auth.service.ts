import { createExtendedApiService } from '@/features/tanstack-query-api/services/createService';
import { apiClient } from '@/features/tanstack-query-api/core/apiClient';
import { 
  LoginCredentials, 
  LoginResponse, 
  RegistrationData, 
  RegisterResponse,
  VerificationResponse
} from '../../model/types';

// Define custom auth methods beyond standard CRUD
const customMethods = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials) => {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },

  /**
   * Register a new user
   */
  register: async (data: RegistrationData) => {
    return apiClient.post<RegisterResponse>('/auth/register', data);
  },

  /**
   * Request a password reset
   */
  requestPasswordReset: async (email: string) => {
    return apiClient.post<{ success: boolean }>('/auth/forgot-password', { email });
  },

  /**
   * Validate a password reset token
   */
  validateResetToken: async (token: string) => {
    return apiClient.get<{ valid: boolean }>(`/auth/reset-password/validate/${token}`);
  },

  /**
   * Complete the password reset process
   */
  completePasswordReset: async (token: string, newPassword: string) => {
    return apiClient.post<{ success: boolean }>('/auth/reset-password', { 
      token, 
      newPassword 
    });
  },

  /**
   * Verify email address
   */
  verifyEmail: async (token: string) => {
    return apiClient.post<VerificationResponse>('/auth/verify-email', { token });
  },

  /**
   * Resend verification email
   */
  resendVerification: async (email: string) => {
    return apiClient.post<{ success: boolean }>('/auth/resend-verification', { 
      email 
    });
  }
};

// Create service with both standard CRUD and custom auth methods
export const authService = createExtendedApiService('/auth', customMethods);

export default authService;
