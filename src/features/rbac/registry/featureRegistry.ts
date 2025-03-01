/**
 * Feature Registry
 * 
 * Centralized system for registering and managing application features,
 * their permissions, feature flags, and role requirements.
 * 
 * This is part of the RBAC feature for better portability.
 */

// Feature definition type
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

// Global registry of all features
const featureRegistry: Record<string, Feature> = {};

// Global registry of all permissions by feature
const permissionRegistry: Record<string, Record<string, string>> = {};

/**
 * Define a new feature
 */
export function defineFeature(
  id: string, 
  name: string, 
  description: string, 
  defaultEnabled = true
): Feature {
  const feature: Feature = {
    id,
    name,
    description,
    permissions: {},
    requiredRoles: [],
    defaultEnabled,
    featureFlags: {}
  };
  
  featureRegistry[id] = feature;
  return feature;
}

/**
 * Define and register permissions for a feature
 */
export function definePermissions(featureId: string, permissionsEnum: Record<string, string>): void {
  if (!featureRegistry[featureId]) {
    throw new Error(`Feature ${featureId} not registered`);
  }
  
  // Register permissions
  permissionRegistry[featureId] = permissionsEnum;
  featureRegistry[featureId].permissions = { ...permissionsEnum };
}

/**
 * Register required roles for a feature
 */
export function defineRequiredRoles(featureId: string, roles: string[]): void {
  if (!featureRegistry[featureId]) {
    throw new Error(`Feature ${featureId} not registered`);
  }
  
  featureRegistry[featureId].requiredRoles = roles;
}

/**
 * Register feature flags for a feature
 */
export function defineFeatureFlags(
  featureId: string, 
  flagsEnum: Record<string, string>,
  defaults: Record<string, { name: string; description: string; defaultEnabled: boolean }>
): void {
  if (!featureRegistry[featureId]) {
    throw new Error(`Feature ${featureId} not registered`);
  }
  
  // Convert enum to feature flags registry
  Object.entries(flagsEnum).forEach(([key, value]) => {
    const flagDefaults = defaults[value] || { 
      name: key, 
      description: '', 
      defaultEnabled: true 
    };
    
    featureRegistry[featureId].featureFlags[value] = {
      id: value,
      name: flagDefaults.name,
      description: flagDefaults.description,
      defaultEnabled: flagDefaults.defaultEnabled
    };
  });
}

/**
 * Get all registered features
 */
export function getAllFeatures(): Record<string, Feature> {
  return { ...featureRegistry };
}

/**
 * Get a specific feature by ID
 */
export function getFeature(featureId: string): Feature | undefined {
  return featureRegistry[featureId];
}

/**
 * Get all permissions for a specific feature
 */
export function getFeaturePermissions(featureId: string): Record<string, string> {
  return permissionRegistry[featureId] || {};
}

/**
 * Get all permissions from all features
 */
export function getAllPermissions(): Record<string, Record<string, string>> {
  return { ...permissionRegistry };
}

/**
 * Get feature by permission
 */
export function getFeatureByPermission(permission: string): Feature | undefined {
  const featureId = permission.split(':')[0];
  return featureRegistry[featureId];
}

/**
 * Helper to extract all permission values as a flat array
 */
export function getAllPermissionValues(): string[] {
  return Object.values(permissionRegistry).flatMap(permSet => Object.values(permSet));
}

/**
 * Check if a feature is registered
 */
export function isFeatureRegistered(featureId: string): boolean {
  return !!featureRegistry[featureId];
}

/**
 * Get all feature flags for a specific feature
 */
export function getFeatureFlags(featureId: string): Record<string, {
  id: string;
  name: string;
  description: string;
  defaultEnabled: boolean;
}> {
  return featureRegistry[featureId]?.featureFlags || {};
}

/**
 * Clear all registered features - useful for testing
 */
export function clearRegistry(): void {
  Object.keys(featureRegistry).forEach(key => delete featureRegistry[key]);
  Object.keys(permissionRegistry).forEach(key => delete permissionRegistry[key]);
}
