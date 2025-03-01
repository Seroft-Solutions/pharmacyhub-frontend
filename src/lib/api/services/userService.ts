import { createExtendedApiService } from '../createService';
import { apiClient } from '../apiClient';
import type { ApiResponse } from '../apiClient';

/**
 * User profile interface
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  createdAt: string;
  updatedAt: string;
}

/**
 * User profile update data
 */
export interface UserProfileUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

/**
 * Password change request
 */
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Create a user service with extended methods
 */
export const userService = createExtendedApiService<User, {
  getCurrentUser: () => Promise<ApiResponse<User>>;
  updateProfile: (data: UserProfileUpdateData) => Promise<ApiResponse<User>>;
  changePassword: (data: PasswordChangeRequest) => Promise<ApiResponse<void>>;
  resetPassword: (email: string) => Promise<ApiResponse<void>>;
}>('/users', {
  /**
   * Get the current authenticated user
   */
  getCurrentUser: async () => {
    return apiClient.get<User>('/users/me');
  },

  /**
   * Update the current user's profile
   */
  updateProfile: async (data: UserProfileUpdateData) => {
    return apiClient.patch<User>('/users/me/profile', data);
  },

  /**
   * Change the current user's password
   */
  changePassword: async (data: PasswordChangeRequest) => {
    return apiClient.post<void>('/users/me/password', data);
  },

  /**
   * Request a password reset for a user
   */
  resetPassword: async (email: string) => {
    return apiClient.post<void>('/auth/reset-password', { email });
  }
});

export default userService;
