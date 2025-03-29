/**
 * Error Utilities
 * 
 * This file provides base utilities for consistent error handling.
 */

/**
 * Normalized error type for consistent error handling
 */
export interface NormalizedError {
  /**
   * Error message
   */
  message: string;
  
  /**
   * Original error object
   */
  originalError?: unknown;
  
  /**
   * Error code if available
   */
  code?: string;
  
  /**
   * Additional error details
   */
  details?: Record<string, unknown>;
}

/**
 * Normalize any error into a consistent format
 * @param error Any error object or message
 * @param defaultMessage Default message if none is available
 * @returns Normalized error object
 */
export function normalizeError(
  error: unknown, 
  defaultMessage = 'An unknown error occurred'
): NormalizedError {
  // If the error is already in the correct format, return it
  if (isNormalizedError(error)) {
    return error;
  }
  
  // If it's an Error object, convert it
  if (error instanceof Error) {
    return {
      message: error.message,
      originalError: error,
      code: (error as any).code,
    };
  }
  
  // If it's a string, use it as the message
  if (typeof error === 'string') {
    return {
      message: error,
    };
  }
  
  // For other types, use default message and store original
  return {
    message: defaultMessage,
    originalError: error,
  };
}

/**
 * Type guard to check if an object is a NormalizedError
 * @param error Object to check
 * @returns True if the object is a NormalizedError
 */
function isNormalizedError(error: unknown): error is NormalizedError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as NormalizedError).message === 'string'
  );
}

/**
 * Creates an error result for use in hooks
 * @param error The error object
 * @param defaultMessage Default message if none is available
 * @returns Error result object
 */
export function createErrorResult<T extends { error: NormalizedError | null }>(
  error: unknown,
  defaultMessage = 'An unknown error occurred'
): T {
  return {
    error: normalizeError(error, defaultMessage),
  } as T;
}

/**
 * Safely execute a function with error handling
 * @param fn Function to execute
 * @param defaultErrorMessage Default error message
 * @returns Result object with data and error
 */
export function safeExecute<T>(
  fn: () => T,
  defaultErrorMessage = 'An operation failed'
): { data: T | null; error: NormalizedError | null } {
  try {
    return {
      data: fn(),
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: normalizeError(error, defaultErrorMessage),
    };
  }
}