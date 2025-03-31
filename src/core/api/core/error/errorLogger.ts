/**
 * Error Logging Utilities
 * 
 * This module provides standardized logging functions for different error types,
 * ensuring consistent error logging across the application.
 */
import { AxiosError } from 'axios';
import logger from '@/core/utils/logger';
import { ApiError } from './baseError';
import {
  NetworkError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  ServerError
} from './apiErrors';

/**
 * Format context object for logging
 * 
 * @param context Additional context information
 * @returns Formatted context object
 */
function formatContext(context?: Record<string, any>): Record<string, any> {
  if (!context) return {};
  
  // Filter out any sensitive information
  const safeContext = { ...context };
  
  // Remove tokens, passwords, etc.
  const sensitiveKeys = ['password', 'token', 'accessToken', 'refreshToken', 'authorization'];
  sensitiveKeys.forEach(key => {
    if (key in safeContext) {
      safeContext[key] = '[REDACTED]';
    }
  });
  
  return safeContext;
}

/**
 * Log network related errors
 * 
 * @param error The network error
 * @param context Additional context information
 */
function logNetworkError(
  error: NetworkError, 
  context?: Record<string, any>
): void {
  logger.error('Network Error:', {
    message: error.message,
    code: error.code,
    originalError: error.originalError?.message,
    ...formatContext(context)
  });
}

/**
 * Log validation errors with field details
 * 
 * @param error The validation error
 * @param context Additional context information
 */
function logValidationError(
  error: ValidationError, 
  context?: Record<string, any>
): void {
  logger.error('Validation Error:', {
    message: error.message,
    status: error.status,
    code: error.code,
    validationErrors: error.validationErrors,
    ...formatContext(context)
  });
}

/**
 * Log authentication errors
 * 
 * @param error The authentication error
 * @param context Additional context information
 */
function logAuthenticationError(
  error: AuthenticationError, 
  context?: Record<string, any>
): void {
  logger.error('Authentication Error:', {
    message: error.message,
    status: error.status,
    code: error.code,
    ...formatContext(context)
  });
}

/**
 * Log authorization errors
 * 
 * @param error The authorization error
 * @param context Additional context information
 */
function logAuthorizationError(
  error: AuthorizationError, 
  context?: Record<string, any>
): void {
  logger.error('Authorization Error:', {
    message: error.message,
    status: error.status,
    code: error.code,
    ...formatContext(context)
  });
}

/**
 * Log server errors
 * 
 * @param error The server error
 * @param context Additional context information
 */
function logServerError(
  error: ServerError, 
  context?: Record<string, any>
): void {
  logger.error('Server Error:', {
    message: error.message,
    status: error.status,
    code: error.code,
    ...formatContext(context)
  });
}

/**
 * Log generic API errors
 * 
 * @param error The API error
 * @param context Additional context information
 */
function logApiError(
  error: ApiError, 
  context?: Record<string, any>
): void {
  logger.error('API Error:', {
    message: error.message,
    status: error.status,
    code: error.code,
    data: error.data,
    ...formatContext(context)
  });
}

/**
 * Log Axios errors
 * 
 * @param error The Axios error
 * @param context Additional context information
 */
function logAxiosError(
  error: AxiosError, 
  context?: Record<string, any>
): void {
  logger.error('API Error:', {
    message: error.message,
    status: error.response?.status,
    statusText: error.response?.statusText,
    url: error.config?.url,
    method: error.config?.method?.toUpperCase(),
    data: error.response?.data,
    ...formatContext(context)
  });
}

/**
 * Log generic errors
 * 
 * @param error The error
 * @param context Additional context information
 */
function logGenericError(
  error: Error, 
  context?: Record<string, any>
): void {
  logger.error('Error:', {
    message: error.message,
    stack: error.stack,
    ...formatContext(context)
  });
}

/**
 * Log any error with appropriate detail level
 * Determines the appropriate logging function based on error type
 * 
 * @param error The error to log
 * @param context Additional context information
 */
export function logError(
  error: any, 
  context?: Record<string, any>
): void {
  // Use the appropriate logging function based on error type
  if (error instanceof NetworkError) {
    logNetworkError(error, context);
  } else if (error instanceof ValidationError) {
    logValidationError(error, context);
  } else if (error instanceof AuthenticationError) {
    logAuthenticationError(error, context);
  } else if (error instanceof AuthorizationError) {
    logAuthorizationError(error, context);
  } else if (error instanceof ServerError) {
    logServerError(error, context);
  } else if (error instanceof ApiError) {
    logApiError(error, context);
  } else if ((error as AxiosError).isAxiosError) {
    logAxiosError(error as AxiosError, context);
  } else if (error instanceof Error) {
    logGenericError(error, context);
  } else {
    // Unknown error type
    logger.error('Unknown Error:', {
      error,
      ...formatContext(context)
    });
  }
}

/**
 * Handle and log an error
 * 
 * @param error The error to handle
 * @param options Options for error handling
 * @returns The processed error
 */
export function handleError(
  error: any, 
  options: {
    rethrow?: boolean;
    context?: Record<string, any>;
  } = {}
): ApiError {
  const { rethrow = true, context = {} } = options;
  
  // Import here to avoid circular dependencies
  const { createApiError } = require('./errorFactory');
  
  // Create an ApiError from any error type
  const apiError = createApiError(error);
  
  // Log the error with context
  logError(apiError, context);
  
  // Rethrow if requested
  if (rethrow) {
    throw apiError;
  }
  
  return apiError;
}
