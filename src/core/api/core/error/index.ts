/**
 * API Error Handling Module
 * 
 * This module provides a comprehensive error handling system for API interactions.
 * It includes error classes, factory functions, and logging utilities.
 * 
 * @example
 * // Import the error handling utilities
 * import { createApiError, handleError } from '@/core/api/core/error';
 * 
 * try {
 *   // Your API code here
 * } catch (error) {
 *   // Create a typed API error from any error
 *   const apiError = createApiError(error);
 *   
 *   // Handle specific error types
 *   if (apiError instanceof ValidationError) {
 *     // Handle validation errors
 *     console.log(apiError.validationErrors);
 *   } else if (apiError instanceof AuthenticationError) {
 *     // Handle authentication errors
 *   }
 *   
 *   // Or use the handleError utility for logging and rethrowing
 *   handleError(error, { 
 *     context: { endpoint: '/api/users' },
 *     rethrow: true
 *   });
 * }
 */

// Re-export everything from the error modules
export * from './baseError';
export * from './apiErrors';
export * from './errorFactory';
export * from './errorLogger';

// Import specific items for backward compatibility
import { ApiError } from './baseError';
import { createApiError } from './errorFactory';
import { handleError as handleErrorWithOptions } from './errorLogger';

/**
 * Handle API errors in a consistent way (for backward compatibility)
 * 
 * @deprecated Use handleError from './errorLogger' instead
 * @param error The error to handle
 * @param options Options for error handling
 * @returns The processed error
 */
export function handleApiError(
  error: any, 
  options: {
    rethrow?: boolean;
    context?: Record<string, any>;
  } = {}
): ApiError {
  return handleErrorWithOptions(error, options);
}

/**
 * Log API error with appropriate detail level (for backward compatibility)
 * 
 * @deprecated Use logError from './errorLogger' instead
 * @param error The API error to log
 * @param context Optional additional context information
 */
export function logApiErrorWithContext(
  error: any, 
  context?: Record<string, any>
): void {
  const { logError } = require('./errorLogger');
  logError(error, context);
}

// Default export for backward compatibility
export default {
  createApiError,
  handleApiError,
  logApiErrorWithContext
};
