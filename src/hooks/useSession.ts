"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { keycloakService } from '@/shared/auth';

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds
const SESSION_CHECK_INTERVAL = 2 * 60 * 1000; // 2 minutes
const DEFAULT_REDIRECT = '/login';

interface SessionOptions {
  required?: boolean;
  redirectTo?: string;
  shouldRedirect?: boolean;
}

/**
 * Custom hook to manage session state and automatic token refresh
 */
export function useSession(options: SessionOptions = {}) {
  const router = useRouter();
  const sessionCheckRef = useRef<NodeJS.Timeout>();
  const shouldRedirect = options.shouldRedirect ?? true;
  const redirectPath = options.redirectTo ?? DEFAULT_REDIRECT;

  useEffect(() => {
    // Clear any existing interval
    if (sessionCheckRef.current) {
      clearInterval(sessionCheckRef.current);
    }

    // Function to check and refresh session
    const checkSession = async () => {
      try {
        if (!keycloakService.isAuthenticated()) {
          if (options.required && shouldRedirect) {
            const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
            const callbackUrl = encodeURIComponent(currentPath);
            router.push(`${redirectPath}?callbackUrl=${callbackUrl}`);
          }
          return;
        }

        // Get the expiry time
        const expiry = localStorage.getItem('pharmacyhub_token_expiry');
        if (!expiry) return;

        const expiryTime = parseInt(expiry);
        const timeUntilExpiry = expiryTime - Date.now();

        // If token will expire soon, refresh it
        if (timeUntilExpiry < TOKEN_REFRESH_THRESHOLD) {
          const refreshed = await keycloakService.refreshToken();
          if (!refreshed && options.required && shouldRedirect) {
            router.push(redirectPath);
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
        if (options.required && shouldRedirect) {
          router.push(redirectPath);
        }
      }
    };

    // Initial check
    checkSession();

    // Set up interval for periodic checks
    sessionCheckRef.current = setInterval(checkSession, SESSION_CHECK_INTERVAL);

    // Clean up on unmount
    return () => {
      if (sessionCheckRef.current) {
        clearInterval(sessionCheckRef.current);
      }
    };
  }, [options.required, shouldRedirect, redirectPath, router]);

  useEffect(() => {
    // Check if session is required but user is not authenticated
    if (options.required && !keycloakService.isAuthenticated() && shouldRedirect) {
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      const callbackUrl = encodeURIComponent(currentPath);
      router.push(`${redirectPath}?callbackUrl=${callbackUrl}`);
    }
  }, [options.required, shouldRedirect, redirectPath, router]);

  return {
    isAuthenticated: keycloakService.isAuthenticated(),
    checkSession: async () => {
      try {
        if (!keycloakService.isAuthenticated()) {
          return false;
        }
        return await keycloakService.refreshToken();
      } catch (error) {
        console.error('Session check failed:', error);
        return false;
      }
    }
  };
}

/**
 * Hook that requires authentication
 * Will automatically redirect to login if user is not authenticated
 */
export function useRequiredSession(options: Omit<SessionOptions, 'required'> = {}) {
  return useSession({ ...options, required: true });
}
