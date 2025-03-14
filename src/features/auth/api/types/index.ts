/**
 * Auth API Types
 * 
 * This module defines all types used in authentication-related API operations.
 */

/**
 * Basic user type definition
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Extended user profile type
 */
export interface UserProfile extends User {
  contactNumber?: string;
  profilePhoto?: string;
  userType?: string;
  preferences?: UserPreferences;
}

/**
 * User preferences type
 */
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  accessibility?: {
    highContrast?: boolean;
    largeText?: boolean;
  };
}

/**
 * User update payload
 */
export interface UserUpdatePayload {
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
  profilePhoto?: string;
  preferences?: Partial<UserPreferences>;
}

/**
 * Login request interface
 */
export interface LoginRequest {
  emailAddress: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Registration request interface
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
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password reset completion
 */
export interface PasswordResetCompletion {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Password change request
 */
export interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
}
