"use client";

import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { AUTH_ROUTES } from '@/shared/auth/apiConfig';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * Authentication Guard component to protect routes that require authentication
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    // If not authenticated and not on the login page, redirect to login
    if (!isAuthenticated && pathname !== AUTH_ROUTES.LOGIN) {
      // Store the intended destination to redirect back after login
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_redirect', pathname);
      }
      
      router.push(AUTH_ROUTES.LOGIN);
    }
  }, [isAuthenticated, router, pathname]);
  
  // Don't render anything while checking authentication
  if (!isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
};

export default AuthGuard;