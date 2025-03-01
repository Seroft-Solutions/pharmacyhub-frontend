import { Permission, Role } from '../constants/permissions';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  permissions: Permission[];
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  acceptTerms: boolean;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface LoginResponse {
  token: string;
  user: UserProfile;
  refreshToken?: string;
  expiresIn?: number;
}
