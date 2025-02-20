"use client";

import { useEffect, useRef } from 'react';
import { 
  useSession as useNextAuthSession, 
  signOut,
  getSession as getNextAuthSession
} from 'next-auth/react';
import { Session } from 'next-auth';

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds
const DEFAULT_REDIRECT = '/login';

interface AuthSessionOptions {
  required?: boolean;
}

interface AuthSession {
  session: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  isLoading: boolean;
  isAuthenticated: boolean;
  user: Session['user'] | undefined;
  update: () => Promise<Session | null>;
}

export function useSession(options: AuthSessionOptions = {}): AuthSession {
  const refreshTimeout = useRef<NodeJS.Timeout>();

  const { data: session, status, update } = useNextAuthSession<boolean>({
    required: options.required ?? false,
    onUnauthenticated: () => {
      if (options.required) {
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
        const callbackUrl = encodeURIComponent(currentPath);
        window.location.href = `${DEFAULT_REDIRECT}?callbackUrl=${callbackUrl}`;
      }
    }
  });

  useEffect(() => {
    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current);
    }

    if (session?.accessToken) {
      const expiresAt = session?.expires ? new Date(session.expires).getTime() : 0;
      const timeUntilRefresh = expiresAt - Date.now() - TOKEN_REFRESH_THRESHOLD;

      if (timeUntilRefresh > 0) {
        refreshTimeout.current = setTimeout(async () => {
          try {
            await update();
          } catch (error) {
            console.error('Failed to refresh session:', error);
            await signOut({ redirect: true, callbackUrl: DEFAULT_REDIRECT });
          }
        }, timeUntilRefresh);
      } else {
        signOut({ redirect: true, callbackUrl: DEFAULT_REDIRECT });
      }
    }

    return () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    };
  }, [session, status, update]);

  return {
    session: session as Session | null,
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
export function useRequiredSession(): AuthSession {
  return useSession({ required: true });
}

/**
 * Get session data without hooks
 * Useful in server components or API routes
 */
export async function getSession() {
  return getNextAuthSession();
}

// Type guard to validate session object
export function isValidSession(session: unknown): session is Session {
  return (
    session !== null &&
    typeof session === 'object' &&
    'user' in session &&
    typeof (session as { user: unknown }).user === 'object' &&
    (session as { user: unknown }).user !== null
  );
}