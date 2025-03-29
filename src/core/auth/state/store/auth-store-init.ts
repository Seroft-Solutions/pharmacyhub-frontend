/**
 * Auth Store Initialization
 * 
 * Functions for initializing auth store state.
 */
import { tokenManager } from '../../core/token';
import { UserProfile } from '../../types';

// DEV_CONFIG for development mode
const DEV_CONFIG = {
  bypassAuth: process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true'
};

/**
 * Check browser storage for existing auth state
 */
export const checkInitialAuthState = (): boolean => {
  // In development mode, bypass auth if configured
  if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
    return true;
  }
  
  return tokenManager.hasToken();
};

/**
 * Create a mock user for development mode
 */
export const createMockUser = (): UserProfile => {
  return {
    id: 'dev-user-id',
    username: 'developer',
    email: 'dev@example.com',
    firstName: 'Dev',
    lastName: 'User',
    roles: ['ADMIN', 'USER'],
    permissions: ['view_dashboard', 'manage_users'],
    userType: 'ADMIN'
  };
};

/**
 * Initial state for the auth store
 */
export const initialAuthState = {
  user: null,
  isAuthenticated: checkInitialAuthState(),
  isLoading: false,
  error: null,
};
