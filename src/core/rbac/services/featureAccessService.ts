/**
 * Feature Access Service
 * 
 * This service provides functionality for checking if a user has access to specific features
 * based on roles, permissions, and feature flags.
 */
import { 
  AccessCheckOptions,
  FeatureAccessParams,
  Permission,
  Role 
} from '../types';
import { featureFlagService } from './featureFlagService';
import { rbacService } from './rbacService';

/**
 * Service for managing feature access
 */
class FeatureAccessService {
  private accessRegistry: Record<string, FeatureAccessParams> = {};

  /**
   * Register access requirements for a feature
   * @param featureAccess Feature access parameters
   */
  registerFeatureAccess(featureAccess: FeatureAccessParams): void {
    this.accessRegistry[featureAccess.featureId] = featureAccess;
  }

  /**
   * Register access requirements for multiple features
   * @param featureAccessList Array of feature access parameters
   */
  registerFeatureAccessList(featureAccessList: FeatureAccessParams[]): void {
    featureAccessList.forEach(access => this.registerFeatureAccess(access));
  }

  /**
   * Check if a user has access to a feature
   * @param featureId Feature ID to check
   * @param options Access check options
   * @returns True if the user has access
   */
  hasFeatureAccess(
    featureId: string, 
    options: AccessCheckOptions = {}
  ): boolean {
    const { 
      all = false, 
      checkBoth = false,
      throwOnError = false 
    } = options;
    
    try {
      // First check if the feature is enabled via feature flags
      if (!featureFlagService.isFeatureEnabled(featureId)) {
        return false;
      }
      
      // If no access requirements are registered, default to allowed
      const accessParams = this.accessRegistry[featureId];
      if (!accessParams) {
        return true;
      }
      
      const { roles = [], permissions = [] } = accessParams;
      
      // If no roles or permissions are specified, default to allowed
      if (roles.length === 0 && permissions.length === 0) {
        return true;
      }
      
      // Check both roles and permissions if requested
      if (checkBoth) {
        return this.checkBothRolesAndPermissions(roles, permissions, all);
      }
      
      // Check roles first, then permissions
      if (roles.length > 0) {
        return this.checkRoles(roles, all);
      }
      
      if (permissions.length > 0) {
        return this.checkPermissions(permissions, all);
      }
      
      // Default to allowed if no checks were performed
      return true;
    } catch (error) {
      if (throwOnError) {
        throw error;
      }
      console.error(`Error checking access for feature ${featureId}:`, error);
      return false;
    }
  }

  /**
   * Check if a user has the required roles
   * @param roles Roles to check
   * @param all If true, require all roles
   * @returns True if the user has the required roles
   */
  private checkRoles(roles: Role[], all: boolean): boolean {
    return all 
      ? rbacService.hasAllRoles(roles) 
      : rbacService.hasAnyRole(roles);
  }

  /**
   * Check if a user has the required permissions
   * @param permissions Permissions to check
   * @param all If true, require all permissions
   * @returns True if the user has the required permissions
   */
  private checkPermissions(permissions: Permission[], all: boolean): boolean {
    return all 
      ? rbacService.hasAllPermissions(permissions) 
      : rbacService.hasAnyPermission(permissions);
  }

  /**
   * Check if a user has both the required roles and permissions
   * @param roles Roles to check
   * @param permissions Permissions to check
   * @param all If true, require all roles and permissions
   * @returns True if the user has the required roles and permissions
   */
  private checkBothRolesAndPermissions(
    roles: Role[], 
    permissions: Permission[], 
    all: boolean
  ): boolean {
    const hasRoles = this.checkRoles(roles, all);
    const hasPermissions = this.checkPermissions(permissions, all);
    
    return all ? (hasRoles && hasPermissions) : (hasRoles || hasPermissions);
  }

  /**
   * Get access requirements for a feature
   * @param featureId Feature ID
   * @returns Feature access parameters or undefined
   */
  getFeatureAccessRequirements(featureId: string): FeatureAccessParams | undefined {
    return this.accessRegistry[featureId];
  }

  /**
   * Get all registered access requirements
   * @returns Record of feature access parameters
   */
  getAllFeatureAccessRequirements(): Record<string, FeatureAccessParams> {
    return { ...this.accessRegistry };
  }
}

// Export as a singleton
export const featureAccessService = new FeatureAccessService();

export default featureAccessService;