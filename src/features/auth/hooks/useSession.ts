/**
 * Custom hook for session management
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks';
import { ROUTES } from '@/features/auth/config/auth';
import { DEV_CONFIG } from '@/features/auth/constants/config';

interface UseSessionOptions {
  required?: boolean;
  redirectTo?: string;
  onUnauthenticated?: () => void;
}

export function useSession(options: UseSessionOptions = {}) {
  const { user, isLoadingUser, logout } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    // Initialize as true in dev mode if bypassing auth
    process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth
  );
  const router = useRouter();

  const {
    required = false,
    redirectTo = ROUTES.LOGIN,
    onUnauthenticated,
  } = options;

  useEffect(() => {
    // In development mode with auth bypass, always return authenticated
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      setIsAuthenticated(true);
      return;
    }
    
    // Still loading, don't do anything yet
    if (isLoadingUser) return;

    // Check authentication status
    const authenticated = !!user;
    setIsAuthenticated(authenticated);

    // Handle unauthenticated state
    if (required && !authenticated) {
      if (onUnauthenticated) {
        onUnauthenticated();
      } else if (redirectTo) {
        router.replace(redirectTo);
      }
    }
  }, [user, isLoadingUser, required, redirectTo, onUnauthenticated, router]);

  return {
    user,
    isLoadingUser,
    isAuthenticated,
    logout,
  };
}
