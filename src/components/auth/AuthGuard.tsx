import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Permission, Role } from '@/types/auth';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  roles?: Role[];
  permissions?: Permission[];
  requireAll?: boolean; // If true, user must have all specified roles/permissions
}

export const AuthGuard = ({
  children,
  fallback = null,
  roles = [],
  permissions = [],
  requireAll = false
}: AuthGuardProps) => {
  const { isAuthenticated, hasRole, hasPermission } = useAuth();

  if (!isAuthenticated) {
    return fallback;
  }

  const checkRoles = () => {
    if (!roles.length) return true;
    return requireAll
      ? roles.every(role => hasRole(role))
      : roles.some(role => hasRole(role));
  };

  const checkPermissions = () => {
    if (!permissions.length) return true;
    return requireAll
      ? permissions.every(permission => hasPermission(permission))
      : permissions.some(permission => hasPermission(permission));
  };

  const hasAccess = checkRoles() && checkPermissions();

  return hasAccess ? <>{children}</> : fallback;
};

// Create a specialized guard for admin-only content
export const AdminGuard = ({ 
  children, 
  fallback = null 
}: Omit<AuthGuardProps, 'roles' | 'permissions'>) => (
  <AuthGuard
    roles={['SUPER_ADMIN', 'ADMIN']}
    fallback={fallback}
  >
    {children}
  </AuthGuard>
);

// Create a guard for manager-level access
export const ManagerGuard = ({ 
  children, 
  fallback = null 
}: Omit<AuthGuardProps, 'roles' | 'permissions'>) => (
  <AuthGuard
    roles={['SUPER_ADMIN', 'ADMIN', 'MANAGER']}
    fallback={fallback}
  >
    {children}
  </AuthGuard>
);

// Create a guard for specific feature access
export const FeatureGuard = ({ 
  children, 
  feature,
  fallback = null 
}: Omit<AuthGuardProps, 'permissions'> & { feature: Permission }) => (
  <AuthGuard
    permissions={[feature]}
    fallback={fallback}
  >
    {children}
  </AuthGuard>
);

/*
Usage Examples:

// Basic usage
<AuthGuard
  roles={['ADMIN']}
  permissions={['manage_users']}
  fallback={<AccessDenied />}
>
  <AdminPanel />
</AuthGuard>

// Simple permission check
<AuthGuard permissions={['view_reports']}>
  <ReportsButton />
</AuthGuard>

// Admin only content
<AdminGuard fallback={<AccessDenied />}>
  <SystemSettings />
</AdminGuard>

// Manager level access
<ManagerGuard>
  <InventoryManagement />
</ManagerGuard>

// Feature-specific guard
<FeatureGuard feature="manage_inventory">
  <StockControls />
</FeatureGuard>

// Require all permissions
<AuthGuard
  permissions={['view_reports', 'export_data']}
  requireAll={true}
  fallback={<RestrictedAccess />}
>
  <AdvancedReporting />
</AuthGuard>
*/