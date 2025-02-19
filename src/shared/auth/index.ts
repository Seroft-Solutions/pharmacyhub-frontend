/**
 * Auth module exports
 * 
 * This file exports all authentication-related utilities,
 * making them available through a single import.
 */

// Export permission constants
export * from './permissions';

// Export Keycloak service
export { default as keycloakService } from './keycloakService';
export type { UserProfile, RegistrationData } from './keycloakService';

// Export authentication context and hook
export { AuthProvider, useAuth, default as AuthContext } from './AuthContext';

// Export permission guard components and hooks
export {
  PermissionGuard,
  AnyPermissionGuard,
  AllPermissionsGuard,
  RoleGuard,
  AnyRoleGuard,
  usePermission,
  useRole,
} from './PermissionGuard';

/**
 * Example usage:
 * 
 * ```tsx
 * import { useAuth, PERMISSIONS, PermissionGuard } from '@/shared/auth';
 * 
 * const MyComponent = () => {
 *   const { user, logout } = useAuth();
 *   
 *   return (
 *     <div>
 *       <h1>Welcome, {user?.firstName}!</h1>
 *       
 *       <PermissionGuard permission={PERMISSIONS.PHARMACY.CREATE}>
 *         <button>Create New Pharmacy</button>
 *       </PermissionGuard>
 *       
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * };
 * ```
 */
