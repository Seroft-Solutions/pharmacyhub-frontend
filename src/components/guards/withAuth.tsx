"use client";

import { ComponentType } from 'react';
import AuthGuard from '@/components/guards/AuthGuard';
import RBACGuard from '@/components/guards/RBACGuard';
import { Role, Permission } from '@/types/auth';

interface WithAuthOptions {
  roles?: Role[];
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Higher-Order Component for protecting routes with authentication and authorization
 * 
 * @param Component - The component to wrap with auth protection
 * @param options - Auth options including roles, permissions, and fallback
 */
export const withAuth = <P extends object>(
  Component: ComponentType<P>,
  options: WithAuthOptions = {}
) => {
  const { roles, permissions, requireAll, fallback } = options;
  
  // Return a new component with auth protection
  const WithAuthComponent = (props: P) => {
    return (
      <AuthGuard>
        <RBACGuard
          roles={roles}
          permissions={permissions}
          requireAll={requireAll}
          fallback={fallback}
        >
          <Component {...props} />
        </RBACGuard>
      </AuthGuard>
    );
  };
  
  // Set display name for debugging
  const displayName = Component.displayName || Component.name || 'Component';
  WithAuthComponent.displayName = `withAuth(${displayName})`;
  
  return WithAuthComponent;
};

export default withAuth;