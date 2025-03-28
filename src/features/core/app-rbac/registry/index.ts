/**
 * Feature Initializer
 * 
 * This module collects and registers all features, their permissions,
 * feature flags, and role requirements in the central registry.
 * 
 * Placing this in the RBAC feature ensures better portability and
 * cohesion with the access control system.
 */
import { 
  definePermissions, 
  defineRequiredRoles, 
  defineFeatureFlags,
  getAllFeatures,
  clearRegistry
} from './featureRegistry';

import { initializeRbacRegistry } from './rbacRegistry';

// Flag to track initialization status
let initialized = false;

// Registry for features to initialize
const featuresToInitialize: Array<{
  feature: any;
  permissions: any;
  roles: string[];
  featureFlags: any;
  flagDefaults: any;
}> = [];

/**
 * Register a feature for initialization
 * This should be called by each feature's module
 */
export function registerFeature(
  feature: any, 
  permissions: any, 
  roles: string[],
  featureFlags: any,
  flagDefaults: any
) {
  featuresToInitialize.push({
    feature,
    permissions,
    roles,
    featureFlags,
    flagDefaults
  });
  
  // If already initialized, update the registry
  if (initialized) {
    addFeatureToRegistry(
      feature,
      permissions,
      roles,
      featureFlags,
      flagDefaults
    );
    
    // Reinitialize RBAC registry to include new feature
    initializeRbacRegistry();
  }
}

/**
 * Add a single feature to the registry
 */
function addFeatureToRegistry(
  feature: any,
  permissions: any,
  roles: string[],
  featureFlags: any,
  flagDefaults: any
) {
  // Register permissions for the feature
  definePermissions(feature.id, permissions);
  
  // Register required roles for the feature
  defineRequiredRoles(feature.id, roles);
  
  // Register feature flags for the feature
  defineFeatureFlags(feature.id, featureFlags, flagDefaults);
}

/**
 * Initialize all registered features
 */
export function initializeFeatures() {
  if (initialized) {
    console.warn('Features already initialized, skipping');
    return;
  }
  
  // Process all registered features
  featuresToInitialize.forEach(({ feature, permissions, roles, featureFlags, flagDefaults }) => {
    addFeatureToRegistry(feature, permissions, roles, featureFlags, flagDefaults);
  });
  
  // Initialize the RBAC registry with the registered features
  initializeRbacRegistry();
  
  // Log all registered features
  console.log('Registered features:', Object.keys(getAllFeatures()));
  
  initialized = true;
}

/**
 * Check if features have been initialized
 */
export function areFeaturesInitialized(): boolean {
  return initialized;
}

/**
 * Reset and reinitialize all features
 * Useful for testing or when feature flags change at runtime
 */
export function reinitializeFeatures() {
  initialized = false;
  clearRegistry();
  initializeFeatures();
}

// Create a registry index to export all registry functionality
export * from './featureRegistry';
export * from './rbacRegistry';
