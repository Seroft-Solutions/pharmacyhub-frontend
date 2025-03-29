/**
 * Route Guard Component
 * 
 * Protects routes by checking authentication status and redirecting
 * to the login page if the user is not authenticated.
 */
import React from 'react';
import { useRedirectUnauthorized } from '../../../hooks';

// Define the component props
interface RouteGuardProps {
  /** The protected content to render if authenticated */
  children: React.ReactNode;
  /** Content to render while checking authentication or if access is denied */
  fallback?: React.ReactNode;
  /** The path to redirect to if not authenticated */
  redirectTo?: string;
  /** Whether to save the current URL for return after login */
  saveReturnUrl?: boolean;
}

/**
 * Component that redirects to a specified page (default: login) if user is not authenticated
 * 
 * This component handles the basic authentication check and redirect behavior,
 * separate from any role or permission checks.
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  fallback = null,
  redirectTo = '/login',
  saveReturnUrl = true
}) => {
  // Use the custom hook to handle redirect logic
  const { isAuthenticated, isLoading } = useRedirectUnauthorized({
    redirectTo,
    saveReturnUrl
  });

  // Show nothing while checking auth
  if (isLoading) {
    return <>{fallback}</>;
  }

  // Show children or fallback based on auth status
  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
};

export default RouteGuard;
