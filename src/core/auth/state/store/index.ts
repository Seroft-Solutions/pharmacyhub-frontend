/**
 * Auth Store Module
 * 
 * Main export file for the auth store modules.
 */

// Export types
export { type AuthState } from './auth-store-types';

// Export initialization utilities
export { 
  checkInitialAuthState,
  createMockUser,
  initialAuthState
} from './auth-store-init';

// Export action creators
export { createAuthActions } from './auth-store-actions';

// Export RBAC helper creators
export { createRbacHelpers } from './auth-store-rbac';

// Export selector hooks
export {
  useUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  useRbacHelpers,
  useAuthActions
} from './auth-store-selectors';

// Export initialization hook
export { useInitAuth } from './auth-store-init-hook';
