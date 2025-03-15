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
  firstName?: string;
  lastName?: string;
  roles?: Role[];
  permissions?: Permission[];
  userType?: string;
  avatar?: string;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Record<string, any>;
}

export interface LoginRequest {
  emailAddress: string;
  password: string;
}

export interface RegisterRequest {
  emailAddress: string;
  password: string;
  firstName?: string;
  lastName?: string;
  contactNumber?: string;
  userType?: string;
  openToConnect?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType?: string;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: UserProfile;
}

export interface RegistrationData {
  email?: string;
  emailAddress?: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  userType?: string;
  acceptTerms?: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetCompletion {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
  roles?: Role[];
  permissions?: Permission[];
  exp: number;
  iat: number;
}

export interface User {
  id: string | number;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  permissions: Permission[];
  userType?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserPreferences {
  id: string | number;
  userId: string | number;
  theme?: string;
  language?: string;
  notifications?: boolean;
  dashboard?: Record<string, any>;
  [key: string]: any;
}
