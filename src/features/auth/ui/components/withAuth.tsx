'use client';

import { ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Permission, Role } from '@/features/auth/model/types';

interface WithAuthProps {
  roles?: Role[];
  permissions?: Permission[];
}

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  { roles, permissions }: WithAuthProps = {}
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, checkAccess } = useAuth();
    const router = useRouter();

    if (!isAuthenticated) {
      router.replace('/login');
      return null;
    }

    if (roles || permissions) {
      const hasAccess = checkAccess(roles, permissions);
      if (!hasAccess) {
        router.replace('/unauthorized');
        return null;
      }
    }

    return <WrappedComponent {...props} />;
  };
}