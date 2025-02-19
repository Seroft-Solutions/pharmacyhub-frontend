export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface UserPermissions {
  roles: string[];
  permissions: string[];
}

export interface AuthUser extends UserProfile, UserPermissions {}

export interface TokenData {
  access: string | null;
  refresh: string | null;
  expires: number;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  token: TokenData;
}

export interface AuthError {
  code: string;
  message: string;
  action?: 'REFRESH_TOKEN' | 'LOGOUT' | 'RETRY';
}

export type Permission = 
  | 'manage_system'
  | 'manage_users'
  | 'manage_staff'
  | 'view_reports'
  | 'approve_orders'
  | 'manage_inventory'
  | 'view_products'
  | 'place_orders';

export type Role = 
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'USER';