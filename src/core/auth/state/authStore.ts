/**
 * Auth Store
 * 
 * Zustand store for managing authentication state.
 * Provides state, actions, and selector hooks for auth functionality.
 */
import { create } from 'zustand';

// Import from the modular store
import {
  AuthState,
  initialAuthState,
  createAuthActions,
  createRbacHelpers,
  useUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  useRbacHelpers,
  useAuthActions,
  useInitAuth
} from './store';

// Create the auth store
export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  ...initialAuthState,
  
  // State setters
  setUser: (user) => set({ user }),
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setIsLoading: (value) => set({ isLoading: value }),
  setError: (error) => set({ error }),
  
  // Auth actions
  ...createAuthActions(set, get),
  
  // RBAC helpers
  ...createRbacHelpers(get)
}));

// Re-export selector hooks
export {
  useUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  useRbacHelpers,
  useAuthActions,
  useInitAuth
};
