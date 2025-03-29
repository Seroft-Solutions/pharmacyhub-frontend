/**
 * Core Role-Based Access Control (RBAC) Module
 * 
 * This module handles all permission and role-based access functionality including:
 * - Permission checking
 * - Role management
 * - Permission-aware UI components
 */

// Re-export from components
export * from './components';

// Re-export from hooks
export * from './hooks';

// Re-export from state
export * from './state';

// Re-export from types
export * from './types';

// Re-export from services
export * from './services';

// Re-export from constants
export * from './constants';

// Re-export from contexts
export * from './contexts';

// Re-export from api
export * from './api';

// Re-export from registry
export * from './registry';

// Re-export from utils
export * from './utils';

// Re-export permissions
export * from './permissions';

/**
 * Initialize the RBAC feature
 * This should be called at application startup
 */
export function initializeRbac() {
  // Initialize all registered features
  import('./registry').then(({ initializeFeatures }) => {
    initializeFeatures();
  });
  
  // Initialize the feature flag service
  import('./services/featureFlagService').then(({ featureFlagService }) => {
    featureFlagService.initialize();
  });
}
