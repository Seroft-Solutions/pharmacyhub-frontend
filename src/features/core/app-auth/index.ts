/**
 * Auth Feature
 * 
 * @deprecated This module has been migrated to `@/core/auth`. Please update your imports.
 * 
 * This module exports all components, hooks, and utilities
 * related to authentication for easy access from other parts
 * of the application.
 */

// Export core functionality
export * from './core';

// Export API functionality
export * from './api';

// Export hooks
export * from './hooks';

// Export types
export * from './types';

// Export protection components
export * from './components/protection';

// Export constants for backward compatibility
export { AUTH_ENDPOINTS as apiRoutes } from './api/constants';

// Note: RBAC functionality has been moved to @/features/rbac
