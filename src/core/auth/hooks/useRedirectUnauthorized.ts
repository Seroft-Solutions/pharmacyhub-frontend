/**
 * Hook for handling unauthorized user redirects
 * 
 * Provides logic for redirecting unauthenticated users to the login page
 * with an option to save the current URL for return after login.
 */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks';

interface UseRedirectUnauthorizedOptions {
  /** The path to redirect to when unauthorized (default: '/login') */
  redirectTo?: string;
  
  /** Whether to save the current URL for return after login (default: true) */
  saveReturnUrl?: boolean;
}

/**
 * Hook that handles redirection for unauthorized users
 * 
 * @param options - Configuration options for redirect behavior
 * @returns Object with authentication status and loading state
 */
export const useRedirectUnauthorized = ({
  redirectTo = '/login',
  saveReturnUrl = true
}: UseRedirectUnauthorizedOptions = {}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  // Handle authentication check and redirection
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Save the current URL to redirect back after login if enabled
      if (saveReturnUrl && typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }
      
      // Redirect to the specified page
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router, saveReturnUrl]);

  return {
    isAuthenticated,
    isLoading
  };
};

export default useRedirectUnauthorized;
