"use client";

import { useEffect, useRef } from 'react';
import { 
  useSession as useNextAuthSession, 
  signOut,
  getSession as getNextAuthSession
} from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface UseSessionOptions {
  required?: boolean;
  redirectTo?: string;
  onUnauthenticated?: () => void;
}

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export function useSession(options: UseSessionOptions = {}) {
  const { 
    required = false, 
    redirectTo = '/login',
    onUnauthenticated 
  } = options;

  const router = useRouter();
  const refreshTimeout = useRef<NodeJS.Timeout>();

  const { data: session, status, update } = useNextAuthSession({
    required,
    onUnauthenticated: () => {
      if (onUnauthenticated) {
        onUnauthenticated();
      } else if (required) {
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
        const callbackUrl = encodeURIComponent(currentPath);
        router.push(`${redirectTo}?callbackUrl=${callbackUrl}`);
      }
    }
  });

  useEffect(() => {
    // Clear any existing refresh timeout
    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current);
    }

    // If we have a session and an expiry time, set up refresh
    if (session?.user?.accessToken) {
      const expiresAt = session.expires ? new Date(session.expires).getTime() : 0;
      const timeUntilRefresh = expiresAt - Date.now() - TOKEN_REFRESH_THRESHOLD;

      if (timeUntilRefresh > 0) {
        refreshTimeout.current = setTimeout(async () => {
          try {
            await update(); // Trigger session refresh
          } catch (error) {
            console.error('Failed to refresh session:', error);
            await signOut({ redirect: true, callbackUrl: redirectTo });
          }
        }, timeUntilRefresh);
      } else {
        // Token is already close to expiring or expired
        signOut({ redirect: true, callbackUrl: redirectTo });
      }
    }

    return () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    };
  }, [session, status, update, router, redirectTo]);

  return {
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    user: session?.user,
    update
  };
}

/**
 * Hook that requires authentication
 * Will automatically redirect to login if user is not authenticated
 */
export function useRequiredSession(redirectTo?: string) {
  return useSession({ 
    required: true, 
    redirectTo,
    onUnauthenticated: () => {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const callbackUrl = encodeURIComponent(currentPath);
      window.location.href = `${redirectTo || '/login'}?callbackUrl=${callbackUrl}`;
    }
  });
}

/**
 * Get session data without hooks
 * Useful in server components or API routes
 */
export async function getSession() {
  return getNextAuthSession();
}