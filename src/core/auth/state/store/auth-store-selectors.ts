/**
 * Auth Store Selectors
 * 
 * Selector hooks for accessing auth state.
 */
import { useAuthStore } from '../authStore';

/**
 * Selector hook for accessing the current user
 */
export const useUser = () => useAuthStore(state => state.user);

/**
 * Selector hook for checking if the user is authenticated
 */
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);

/**
 * Selector hook for checking if auth operations are loading
 */
export const useAuthLoading = () => useAuthStore(state => state.isLoading);

/**
 * Selector hook for accessing auth errors
 */
export const useAuthError = () => useAuthStore(state => state.error);

/**
 * Selector for RBAC helpers
 */
export const useRbacHelpers = () => useAuthStore(state => ({
  hasRole: state.hasRole,
  hasPermission: state.hasPermission,
  hasAccess: state.hasAccess
}));

/**
 * Selector for auth actions
 */
export const useAuthActions = () => useAuthStore(state => ({
  login: state.login,
  logout: state.logout,
  refreshUserProfile: state.refreshUserProfile
}));
