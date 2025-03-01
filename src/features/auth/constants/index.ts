/**
 * Auth Feature Constants
 * 
 * Defines the auth feature's permissions, feature flags, and requirements.
 */
import { defineFeature } from '@/features/rbac/registry';
import { Role } from '@/features/rbac/constants/roles';
import { registerFeature } from '@/features/rbac/registry';

// Feature definition
export const AUTH_FEATURE = defineFeature(
  'auth',
  'Authentication & Authorization',
  'User authentication, session management, and access control'
);

import {
  AuthPermission,
  AUTH_ADMIN_PERMISSIONS,
  AUTH_COMMON_PERMISSIONS
} from './permissions';


import {
  AuthFeatureFlag,
  AUTH_FEATURE_FLAGS
} from './flags';


import { AUTH_REQUIRED_ROLES } from './roles';

// Export all auth-related constants
export * from './routes';
export * from './config';


/**
 * Feature initializer
 * Call this to register the feature with the registry
 */
export function initializeAuthFeature() {
  // Register this feature with the registry
  registerFeature(
    AUTH_FEATURE,
    AuthPermission,
    AUTH_REQUIRED_ROLES,
    AuthFeatureFlag,
    AUTH_FEATURE_FLAGS
  );
  
  console.log('Auth feature registered');
}
