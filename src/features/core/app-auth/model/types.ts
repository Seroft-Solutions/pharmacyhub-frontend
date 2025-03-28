/**
 * Auth Types for UI components
 */

// Password reset form steps
export type ResetStep = 'request' | 'verification' | 'success';

// Password reset status
export type ResetStatus = 'validating' | 'valid' | 'invalid' | 'resetting' | 'success';
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'pharmacist' | 'manager' | 'proprietor' | 'salesman';

export interface LoginCredentials {
  emailAddress: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  jwtToken: string;
  user: User;
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
  user: User;
  verificationSent: boolean;
}

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

export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export type ResetStep = 'request' | 'verification' | 'success';
export type VerificationStatus = 'verifying' | 'success' | 'failed';
export type ResetStatus = 'validating' | 'valid' | 'invalid' | 'resetting' | 'success';

export interface PasswordStrength {
  score: number;
  label: 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';
  suggestions: string[];
}