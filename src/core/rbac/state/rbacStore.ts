/**
 * RBAC Store
 * 
 * Zustand store for managing RBAC state.
 * Provides state, actions, and selector hooks for RBAC functionality.
 */
import { create } from 'zustand';
import { rbacService } from '../services/rbacService';
import { Permission, PermissionCheckOptions, Role, UserPermissions, RbacState } from '../types';
import { devtools, persist } from 'zustand/middleware';

/**
 * Interface for the RBAC store
 */
interface RbacStore extends RbacState {
  // Actions
  initialize: (permissions: UserPermissions) => void;
  reset: () => void;

  // Permission methods
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;

  // Role methods
  hasRole: (role: Role, checkInheritance?: boolean) => boolean;
  hasAnyRole: (roles: Role[], checkInheritance?: boolean) => boolean;
  hasAllRoles: (roles: Role[], checkInheritance?: boolean) => boolean;

  // Authorization methods
  isAuthorized: (rolesOrPermissions: (Role | Permission)[], options?: PermissionCheckOptions) => boolean;
}

/**
 * Initial state for the RBAC store
 */
const initialState: RbacState = {
  isInitialized: false,
  isLoading: false,
  error: null,
  userPermissions: null
};

/**
 * Create the RBAC store
 */
export const useRbacStore = create<RbacStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Actions
        initialize: (permissions: UserPermissions) => {
          set({ isLoading: true });
          try {
            rbacService.initialize(permissions);
            set({ 
              isInitialized: true, 
              isLoading: false,
              userPermissions: permissions 
            });
          } catch (error) {
            set({ 
              isLoading: false, 
              error: {
                message: error instanceof Error ? error.message : 'Failed to initialize RBAC',
                code: 'RBAC_INIT_ERROR',
                original: error
              }
            });
          }
        },

        reset: () => {
          rbacService.reset();
          set({ ...initialState });
        },

        // Permission methods
        hasPermission: (permission: Permission) => {
          return rbacService.hasPermission(permission);
        },

        hasAnyPermission: (permissions: Permission[]) => {
          return rbacService.hasAnyPermission(permissions);
        },

        hasAllPermissions: (permissions: Permission[]) => {
          return rbacService.hasAllPermissions(permissions);
        },

        // Role methods
        hasRole: (role: Role, checkInheritance = true) => {
          return rbacService.hasRole(role, checkInheritance);
        },

        hasAnyRole: (roles: Role[], checkInheritance = true) => {
          return rbacService.hasAnyRole(roles, checkInheritance);
        },

        hasAllRoles: (roles: Role[], checkInheritance = true) => {
          return rbacService.hasAllRoles(roles, checkInheritance);
        },

        // Authorization methods
        isAuthorized: (rolesOrPermissions: (Role | Permission)[], options: PermissionCheckOptions = {}) => {
          return rbacService.isAuthorized(rolesOrPermissions, options);
        }
      }),
      {
        name: 'rbac-storage'
      }
    )
  )
);

/**
 * Selector hooks for accessing RBAC state
 */

// State selectors
export const useUserPermissions = () => useRbacStore(state => state.userPermissions);
export const useIsRbacInitialized = () => useRbacStore(state => state.isInitialized);
export const useIsRbacLoading = () => useRbacStore(state => state.isLoading);
export const useRbacError = () => useRbacStore(state => state.error);

// Permission selectors
export const usePermissionCheck = () => useRbacStore(state => ({
  hasPermission: state.hasPermission,
  hasAnyPermission: state.hasAnyPermission,
  hasAllPermissions: state.hasAllPermissions
}));

// Role selectors
export const useRoleCheck = () => useRbacStore(state => ({
  hasRole: state.hasRole,
  hasAnyRole: state.hasAnyRole,
  hasAllRoles: state.hasAllRoles
}));

// Authorization selectors
export const useAuthorization = () => useRbacStore(state => ({
  isAuthorized: state.isAuthorized
}));

// Action selectors
export const useRbacActions = () => useRbacStore(state => ({
  initialize: state.initialize,
  reset: state.reset
}));

/**
 * Helper function to get all user permissions
 * @returns Array of user permissions
 */
export const getUserPermissions = (): Permission[] => {
  const userPermissions = useRbacStore.getState().userPermissions;
  return userPermissions ? userPermissions.permissions : [];
};

/**
 * Helper function to get all user roles
 * @returns Array of user roles
 */
export const getUserRoles = (): Role[] => {
  const userPermissions = useRbacStore.getState().userPermissions;
  return userPermissions ? userPermissions.roles : [];
};
