// Core auth components and types
export { AuthGuard, withAuth, type AuthGuardProps } from './AuthGuard';
export { AuthLoading } from './AuthLoading';
export { Unauthorized } from './Unauthorized';

// Role-based guards
export {
  AdminGuard,
  ManagerGuard,
  FeatureGuard,
  type GuardProps,
  type FeatureGuardProps
} from './RoleGuards';

// Higher-order auth components
import { ComponentType } from 'react';
import { Permission } from '@/types/auth';
import { withAuth } from './AuthGuard';

/**
 * HOC that requires admin privileges
 */
export const withAdminAuth = <P extends object>(Component: ComponentType<P>) =>
  withAuth(Component, ['ADMIN', 'SUPER_ADMIN']);

/**
 * HOC that requires manager privileges
 */
export const withManagerAuth = <P extends object>(Component: ComponentType<P>) =>
  withAuth(Component, ['MANAGER', 'ADMIN', 'SUPER_ADMIN']);

/**
 * HOC that requires specific feature permissions
 */
export const withFeatureAuth = <P extends object>(
  Component: ComponentType<P>,
  permissions: Permission[]
) => withAuth(Component, undefined, permissions);