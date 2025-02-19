'use client';

import { ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Permission, Role } from '@/types/auth';

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

// Usage example:
/*
const AdminDashboard = withAuth(Dashboard, {
  roles: ['ADMIN'],
  permissions: ['manage_users']
});

const InventoryPage = withAuth(Inventory, {
  permissions: ['manage_inventory']
});
*/