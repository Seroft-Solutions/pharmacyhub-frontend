/**
 * Authentication State Management
 * 
 * This module exports the Zustand store for authentication state and selectors.
 */

// Export the auth store and all selectors
export { 
  useAuthStore,
  // State selectors
  useUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  // Action selectors
  useAuthActions,
  // RBAC selectors
  useRbacHelpers,
  // Initialization hook
  useInitAuth
} from './authStore';