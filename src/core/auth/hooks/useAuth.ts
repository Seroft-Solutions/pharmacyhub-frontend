/**
 * Main Auth Hook
 * 
 * Combines all auth functionality into a single hook for convenience.
 * This hook acts as a facade for all auth-related operations.
 */
import { 
  useAuthStore, 
  useUser, 
  useIsAuthenticated, 
  useAuthLoading, 
  useAuthError,
  useRbacHelpers,
  useAuthActions 
} from '../state';
import { useRegister } from './register';
import { usePasswordReset } from './password';
import { useSocialAuth } from './social';

/**
 * Main auth hook that combines all auth-related functionality
 * This is the primary hook for auth functionality across the application
 * 
 * @returns All auth state and operations in a single object
 */
export const useAuth = () => {
  // Get state from Zustand store using selectors
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useAuthLoading();
  const error = useAuthError();
  const { hasRole, hasPermission, hasAccess } = useRbacHelpers();
  const { login, logout, refreshUserProfile } = useAuthActions();
  
  // Get specialized hooks for functionalities not yet migrated to Zustand
  const { register, isRegistering, registerError } = useRegister();
  const { 
    requestPasswordReset, 
    resetPassword,
    isRequestingReset,
    isResettingPassword,
    resetRequestError,
    resetPasswordError
  } = usePasswordReset();
  const { processSocialLogin } = useSocialAuth();

  // Determine login loading and error states
  // For backward compatibility with useLogin hook
  const isLoggingIn = useAuthStore(state => state.isLoading && !state.user);
  const loginError = useAuthStore(state => !state.isAuthenticated ? state.error : null);

  // Combine and return all auth functionality
  return {
    // Base state
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // RBAC helpers
    hasRole,
    hasPermission,
    hasAccess,
    
    // Auth actions
    login,
    logout,
    refreshUserProfile,
    
    // Login states (for backward compatibility)
    isLoggingIn,
    loginError,

    // Registration functionality
    register,
    isRegistering,
    registerError,

    // Password reset functionality
    requestPasswordReset,
    resetPassword,
    isRequestingReset,
    isResettingPassword,
    resetRequestError,
    resetPasswordError,

    // Social auth functionality
    processSocialLogin
  };
};

export default useAuth;