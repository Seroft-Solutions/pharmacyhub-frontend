/**
 * Auth Types
 */

export type Role = 
  | 'ADMIN'
  | 'SUPER_ADMIN' 
  | 'MANAGER'
  | 'USER'
  | 'STUDENT'
  | 'GUEST'
  | string;

export type Permission = 
  | 'manage_users'
  | 'view_users'
  | 'manage_roles'
  | 'manage_permissions'
  | 'manage_pharmacists'
  | 'manage_pharmacy_managers'
  | 'manage_proprietors'
  | 'manage_salesmen'
  | 'manage_inventory'
  | 'view_products'
  | 'view_reports'
  | string;

export interface UserProfile {
  id: string | number;
  username?: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  roles?: Role[];
  permissions?: Permission[];
  avatar?: string;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, any>;
  userType?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: UserProfile;
  expiresIn?: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
  roles?: Role[];
  permissions?: Permission[];
  exp: number;
  iat: number;
}

export interface RegistrationData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phoneNumber?: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
}
