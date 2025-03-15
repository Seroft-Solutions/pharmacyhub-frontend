/**
 * Auth Feature
 * 
 * This module exports all components, hooks, and utilities
 * from the auth feature for easy access from other parts
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

// Export UI components - uncomment as needed
// export * from './ui/protection/RequireAuth';

// Export constants for backward compatibility
export { AUTH_ENDPOINTS as apiRoutes } from './api/constants';
