/**
 * RBAC Types
 * Core types for the Role-Based Access Control system
 */

/**
 * Represents a feature in the application
 */
export interface Feature {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, string>;
  requiredRoles: string[];
  defaultEnabled: boolean;
  featureFlags: Record<string, {
    id: string;
    name: string;
    description: string;
    defaultEnabled: boolean;
  }>;
}

/**
 * Represents a user's access profile including roles and permissions
 */
export interface AccessProfile {
  userId: string;
  roles: string[];
  permissions: string[];
}

/**
 * Result of an access check operation
 */
export interface AccessCheckResult {
  granted: boolean;
  reason?: string;
}

/**
 * Permission check response from the backend
 */
export interface PermissionCheckResponse {
  [permission: string]: boolean;
}

/**
 * Access check options
 */
export interface AccessCheckOptions {
  requireAll?: boolean;
  verifyOnBackend?: boolean;
}

/**
 * Role check options
 */
export interface RoleCheckOptions {
  verifyOnBackend?: boolean;
}

/**
 * Component props for permission-based checks
 */
export interface PermissionGuardProps {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  verifyOnBackend?: boolean;
}

/**
 * Component props for role-based checks
 */
export interface RoleGuardProps {
  role: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  verifyOnBackend?: boolean;
}

/**
 * Component props for complex access checks
 */
export interface AccessGuardProps {
  roles?: string[];
  permissions?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  verifyOnBackend?: boolean;
}

/**
 * Component props for feature/resource access guards
 */
export interface FeatureGuardProps {
  permissions: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
  verifyOnBackend?: boolean;
}
