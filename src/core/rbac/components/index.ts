/**
 * RBAC Components
 * 
 * This module exports all RBAC-related UI components.
 */

// Export guard components
export { default as PermissionGuard } from './PermissionGuard';
export { default as RoleGuard } from './RoleGuard';
export { default as FeatureAccessGuard } from './FeatureAccessGuard';
export { default as FeatureGuard } from './FeatureGuard';
export { default as BaseGuard } from './BaseGuard';

// Export providers
export { default as FeatureProvider } from './FeatureProvider';
