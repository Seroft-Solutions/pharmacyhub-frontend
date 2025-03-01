/**
 * Authentication guard component
 * 
 * This component protects routes by checking if a user is authenticated
 * and redirecting to the login page if not.
 */
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../core/AuthContext';
import { useAccess } from '@/features/rbac/hooks';

interface RequireAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  
  // RBAC parameters
  requiredRoles?: string[];
  requiredPermissions?: string[];
  requireAll?: boolean;
}

/**
 * Component that redirects to login if user is not authenticated
 * or if user doesn't have required roles or permissions
 */
export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  fallback = null,
  requiredRoles = [],
  requiredPermissions = [],
  requireAll = true
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasAccess } = useAccess();
  const router = useRouter();
  
  // Check if user has the required access
  const hasRequiredAccess = React.useMemo(() => {
    // If no roles or permissions are required, just check auth
    if (requiredRoles.length === 0 && requiredPermissions.length === 0) {
      return isAuthenticated;
    }
    
    // Otherwise, check if user has the required roles and permissions
    return isAuthenticated && hasAccess(requiredRoles, requiredPermissions, { requireAll });
  }, [isAuthenticated, hasAccess, requiredRoles, requiredPermissions, requireAll]);

  React.useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Save the current URL to redirect back after login
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          sessionStorage.setItem('redirectAfterLogin', currentPath);
        }
        
        // Redirect to login page
        router.push('/login');
      } else if (!hasRequiredAccess) {
        // User is authenticated but doesn't have required access
        // Redirect to unauthorized page or home
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, isLoading, hasRequiredAccess, router]);

  // Show nothing while checking auth
  if (isLoading) {
    return null;
  }

  // Show fallback or children based on auth and access status
  return (isAuthenticated && hasRequiredAccess) ? <>{children}</> : <>{fallback}</>;
};

export default RequireAuth;
