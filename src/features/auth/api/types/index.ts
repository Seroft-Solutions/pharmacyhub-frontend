/**
 * Auth API Types
 * 
 * This module defines all types used in the auth API.
 */

/**
 * User profile information
 */
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
  userType: string | null;
}

/**
 * User preferences
 */
export interface UserPreferences {
  id: string;
  userId: string;
  theme: string;
  language: string;
  notifications: boolean;
  [key: string]: any;
}

/**
 * Authentication tokens
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * User object returned by API
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
  userType: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  tokens: AuthTokens;
  user: UserProfile;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  emailAddress: string;
  password: string;
}

/**
 * Registration request payload
 */
export interface RegisterRequest {
  emailAddress: string;
  password: string;
  firstName: string;
  lastName: string;
  contactNumber?: string;
  userType?: string;
  openToConnect?: boolean;
}

/**
 * Password reset request payload
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password reset completion payload
 */
export interface PasswordResetCompletion {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Password change payload
 */
export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * User update payload
 */
export interface UserUpdatePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  contactNumber?: string;
  roles?: string[];
  userType?: string;
}
