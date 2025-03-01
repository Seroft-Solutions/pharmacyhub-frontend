/**
 * Custom hook for session management
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks';
import { ROUTES } from '@/features/auth/config/auth';

interface UseSessionOptions {
  required?: boolean;
  redirectTo?: string;
  onUnauthenticated?: () => void;
}

export function useSession(options: UseSessionOptions = {}) {
  const { user, isLoadingUser, logout } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  const {
    required = false,
    redirectTo = ROUTES.LOGIN,
    onUnauthenticated,
  } = options;

  useEffect(() => {
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
