/**
 * RBAC Service
 * 
 * This service provides core RBAC functionality for checking permissions,
 * managing roles, and handling access control.
 */
import { Permission, PermissionCheckOptions, Role, UserPermissions } from '../types';
import { ROLE_HIERARCHY, roleInheritsFrom } from '../constants/roles';

/**
 * Service for Role-Based Access Control
 */
class RbacService {
  private userPermissions: UserPermissions | null = null;

  /**
   * Initialize the RBAC service with user permissions
   * @param permissions User permissions object
   */
  initialize(permissions: UserPermissions): void {
    this.userPermissions = permissions;
  }

  /**
   * Reset the RBAC service
   */
  reset(): void {
    this.userPermissions = null;
  }

  /**
   * Check if the user has a specific permission
   * @param permission Permission to check
   * @returns True if the user has the permission
   */
  hasPermission(permission: Permission): boolean {
    if (!this.userPermissions) {
      return false;
    }

    return this.userPermissions.permissions.includes(permission);
  }

  /**
   * Check if the user has any of the specified permissions
   * @param permissions Array of permissions to check
   * @returns True if the user has any of the permissions
   */
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  /**
   * Check if the user has all of the specified permissions
   * @param permissions Array of permissions to check
   * @returns True if the user has all of the permissions
   */
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  /**
   * Check if the user has a specific role
   * @param role Role to check
   * @param checkInheritance Whether to check role inheritance
   * @returns True if the user has the role
   */
  hasRole(role: Role, checkInheritance = true): boolean {
    if (!this.userPermissions) {
      return false;
    }

    if (this.userPermissions.roles.includes(role)) {
      return true;
    }

    if (!checkInheritance) {
      return false;
    }

    // Check if any of the user's roles inherit the requested role
    return this.userPermissions.roles.some(userRole => 
      roleInheritsFrom(userRole, role)
    );
  }

  /**
   * Check if the user has any of the specified roles
   * @param roles Array of roles to check
   * @param checkInheritance Whether to check role inheritance
   * @returns True if the user has any of the roles
   */
  hasAnyRole(roles: Role[], checkInheritance = true): boolean {
    return roles.some(role => this.hasRole(role, checkInheritance));
  }

  /**
   * Check if the user has all of the specified roles
   * @param roles Array of roles to check
   * @param checkInheritance Whether to check role inheritance
   * @returns True if the user has all of the roles
   */
  hasAllRoles(roles: Role[], checkInheritance = true): boolean {
    return roles.every(role => this.hasRole(role, checkInheritance));
  }

  /**
   * Check if the user is authorized based on roles or permissions
   * @param rolesOrPermissions Array of roles or permissions
   * @param options Check options
   * @returns True if the user is authorized
   */
  isAuthorized(
    rolesOrPermissions: (Role | Permission)[], 
    options: PermissionCheckOptions = {}
  ): boolean {
    const { all = false } = options;
    
    if (all) {
      return rolesOrPermissions.every(item => 
        this.hasPermission(item) || this.hasRole(item)
      );
    }
    
    return rolesOrPermissions.some(item => 
      this.hasPermission(item) || this.hasRole(item)
    );
  }

  /**
   * Get all permissions for the current user
   * @returns Array of permission strings
   */
  getUserPermissions(): Permission[] {
    return this.userPermissions?.permissions || [];
  }

  /**
   * Get all roles for the current user
   * @returns Array of role strings
   */
  getUserRoles(): Role[] {
    return this.userPermissions?.roles || [];
  }

  /**
   * Check if the RBAC service is initialized
   * @returns True if initialized
   */
  isInitialized(): boolean {
    return this.userPermissions !== null;
  }
}

// Export as a singleton
export const rbacService = new RbacService();

export default rbacService;