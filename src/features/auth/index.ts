/**
 * Auth feature index file
 * 
 * This file exports all components, hooks, and utilities
 * from the auth feature for easy access from other parts
 * of the application.
 */

// Export core functionality
export * from './core/AuthContext';
export * from './core/tokenManager';

// Export API services
export * from './api/services/authService';

// Export types
export * from './types';

// Export constants 
// Note: RBAC permissions moved to @/features/rbac
export { AUTH_ENDPOINTS as apiRoutes } from './api/apiConfig';

// Export utility functions
export * from './utils';

// Export hooks
export * from './hooks';

// Export UI components
// Note: RBAC components moved to @/features/rbac
export * from './ui/protection/RequireAuth';
