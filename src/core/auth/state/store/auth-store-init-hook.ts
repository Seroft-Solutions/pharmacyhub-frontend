/**
 * Auth Store Initialization Hook
 * 
 * Hook for initializing the auth store.
 */
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../authStore';

// Auth service placeholder
const authService = {
  queryKeys: {
    all: () => ['auth']
  }
};

/**
 * Hook to initialize the auth store
 * 
 * This hook should be called at the root level of the application
 * to ensure the auth state is initialized properly.
 */
export const useInitAuth = () => {
  const refreshUserProfile = useAuthStore(state => state.refreshUserProfile);
  const queryClient = useQueryClient();
  
  // Register a listener for logout to clear query cache
  useAuthStore.subscribe(
    (state) => state.isAuthenticated,
    (isAuthenticated, previousIsAuthenticated) => {
      // If the user just logged out
      if (previousIsAuthenticated && !isAuthenticated) {
        // Clear user data from query cache
        queryClient.removeQueries({ 
          queryKey: authService.queryKeys.all()
        });
      }
    }
  );
  
  return { refreshUserProfile };
};
