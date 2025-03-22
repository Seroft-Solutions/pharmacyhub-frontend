/**
 * Custom hook for session management
 * A lightweight alternative to useAuth that focuses on session state
 */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../core/AuthContext';
import { DEV_CONFIG } from '../constants/config';
import { logger } from '@/shared/lib/logger';

interface UseSessionOptions {
  required?: boolean;
  redirectTo?: string;
  onUnauthenticated?: () => void;
}

export function useSession(options: UseSessionOptions = {}) {
  const { user, isLoading, isAuthenticated, logout } = useAuthContext();
  const router = useRouter();

  const {
    required = false,
    redirectTo = '/login',
    onUnauthenticated,
  } = options;

  useEffect(() => {
    // In development mode with auth bypass, always return authenticated
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      return;
    }
    
    // Still loading, don't do anything yet
    if (isLoading) return;

    // Handle unauthenticated state
    if (required && !isAuthenticated) {
      if (onUnauthenticated) {
        onUnauthenticated();
      } else if (redirectTo) {
        router.replace(redirectTo);
      }
    }
  }, [isAuthenticated, isLoading, required, redirectTo, onUnauthenticated, router]);

  // Log session details for debugging
  useEffect(() => {
    // Skip during server-side rendering
    if (typeof window === 'undefined') return;
    
    // Log session state
    logger.debug('[useSession] Session state:', {
      isLoading,
      isAuthenticated,
      user: user ? {
        id: user.id,
        email: user.email,
        roles: user.roles,
        userType: user.userType
      } : null,
      pathname: window.location.pathname
    });
  }, [user, isLoading, isAuthenticated]);

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
  };
}

export default useSession;