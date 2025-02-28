// Role and permission definitions
export type Role = 
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'PHARMACY_MANAGER'
  | 'USER'
  | 'PHARMACIST'
  | 'PROPRIETOR'
  | 'SALESMAN'
  | 'INSTRUCTOR';

export type Permission = 
  | 'manage_system'
  | 'manage_users'
  | 'manage_staff'
  | 'view_reports'
  | 'approve_orders'
  | 'manage_inventory'
  | 'view_products'
  | 'place_orders'
  | 'create:pharmacy'
  | 'edit:pharmacy'
  | 'delete:pharmacy'
  | 'view:pharmacy'
  | 'manage:users'
  | 'view:users'
  | 'manage:roles'
  | 'manage:exams'
  | 'take:exams'
  | 'grade:exams'
  | 'UPDATE_STATUS';

// Token and user data
export interface TokenData {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  jwtToken?: string;
}

export interface TokenUser {
  id: string;
  email: string;
  name: string;
  roles: Role[];
  permissions: Permission[];
  userType?: string | null;
  accessToken?: string;
}

export interface UserProfile extends TokenUser {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

// Authentication state
export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  token: TokenData;
}

// Auth errors
export interface AuthError {
  code: string;
  message: string;
  field?: string;
  action?: 'REFRESH_TOKEN' | 'LOGOUT' | 'RETRY';
}

// Login and registration interfaces
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  user: UserProfile;
}

export interface RegistrationData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  userType?: string;
  acceptTerms?: boolean;
  additionalInfo?: Record<string, any>;
}

export interface RegisterResponse {
  user: UserProfile;
  verificationSent: boolean;
}

// Password recovery and verification
export interface PasswordRecoveryRequest {
  email: string;
}

export interface VerificationRequest {
  token: string;
  code?: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword?: string;
}

export interface VerificationResponse {
  email: string;
  verified: boolean;
}

export type ResetStep = 'request' | 'verification' | 'success';
export type VerificationStatus = 'verifying' | 'success' | 'failed';
export type ResetStatus = 'validating' | 'valid' | 'invalid' | 'resetting' | 'success';

export interface PasswordStrength {
  score: number;
  label: 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';
  suggestions: string[];
}