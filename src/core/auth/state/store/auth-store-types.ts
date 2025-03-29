/**
 * Auth Store Types
 * 
 * Type definitions for the authentication store.
 */
import { UserProfile } from '../../types';

/**
 * Auth store state interface
 */
export interface AuthState {
  // State
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: Error | null) => void;
  login: (username: string, password: string, deviceInfo?: Record<string, string>) => Promise<UserProfile>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<UserProfile | null>;
  
  // RBAC helpers
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAccess: (roles: string[], permissions: string[]) => boolean;
}
