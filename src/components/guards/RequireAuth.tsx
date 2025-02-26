'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Permission, Role } from '@/types/auth';
import { AUTH_ROUTES } from '@/shared/auth/apiConfig';

interface RequireAuthProps {
  children: React.ReactNode;
  roles?: Role[];
  permissions?: Permission[];
  requireAll?: boolean;
  redirectTo?: string;
}

/**
 * Middleware component for protecting routes with authentication and authorization
 * 
 * Usage example:
 * ```tsx
 * function DashboardLayout({ children }: { children: React.ReactNode }) {
 *   return (
 *     <RequireAuth roles={['ADMIN', 'MANAGER']}>
 *       {children}
 *     </RequireAuth>
 *   );
 * }
 * ```
 */
export function RequireAuth({
  children,
  roles,
  permissions,
  requireAll = false,
  redirectTo = AUTH_ROUTES.LOGIN
}: RequireAuthProps) {
  const { isAuthenticated, checkAccess } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check authentication first
    if (!isAuthenticated) {
      // Store the current path for redirect after login
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_redirect', pathname);
      }
      router.push(redirectTo);
      return;
    }

    // Then check authorization if roles or permissions are specified
    if ((roles && roles.length > 0) || (permissions && permissions.length > 0)) {
      const hasAccess = checkAccess(roles, permissions);
      if (!hasAccess) {
        router.push(AUTH_ROUTES.UNAUTHORIZED || '/unauthorized');
      }
    }
  }, [isAuthenticated, pathname, roles, permissions, requireAll, router, redirectTo, checkAccess]);

  return <>{children}</>;
}

export default RequireAuth;