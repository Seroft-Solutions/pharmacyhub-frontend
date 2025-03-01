/**
 * Authentication guard component
 * 
 * This component protects routes by checking if a user is authenticated
 * and redirecting to the login page if not.
 */
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../core/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component that redirects to login if user is not authenticated
 */
export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  fallback = null 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Save the current URL to redirect back after login
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }
      
      // Redirect to login page
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show nothing while checking auth
  if (isLoading) {
    return null;
  }

  // Show fallback or children based on auth status
  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
};

export default RequireAuth;
