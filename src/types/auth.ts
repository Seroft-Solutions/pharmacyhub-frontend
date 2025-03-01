import type { Role, Permission, AuthUser as BaseAuthUser } from './auth-types';

export interface TokenData {
  access: string | null;
  refresh: string | null;
  expires: number;
}

export interface AuthState {
  user: BaseAuthUser | null;
  isAuthenticated: boolean;
  token: TokenData;
}

export interface AuthError {
  code: string;
  message: string;
  action?: 'REFRESH_TOKEN' | 'LOGOUT' | 'RETRY';
}

// Re-export the types from auth-types.ts for backward compatibility
export type { Role, Permission, BaseAuthUser as AuthUser };