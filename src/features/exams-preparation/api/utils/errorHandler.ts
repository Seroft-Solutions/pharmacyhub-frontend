/**
 * Exams Preparation Error Handling
 * 
 * This module provides standardized error handling utilities for the 
 * exams-preparation feature, leveraging the core API error handling.
 */
import { 
  createApiError, 
  handleError, 
  ApiError, 
  ValidationError, 
  AuthenticationError, 
  AuthorizationError,
  NotFoundError
} from '@/core/api/core/error';

// Re-export core error types for convenience
export { 
  ApiError, 
  ValidationError, 
  AuthenticationError, 
  AuthorizationError,
  NotFoundError
};

/**
 * Domain-specific error context for exams
 */
export interface ExamErrorContext {
  examId?: number;
  attemptId?: number;
  questionId?: number;
  paperId?: number;
  endpoint?: string;
  action?: string;
}

/**
 * Handle exams-specific errors
 * 
 * @param error The error to handle
 * @param context Exams-specific error context
 * @returns The processed API error
 */
export function handleExamError(
  error: any, 
  context: ExamErrorContext = {}
): ApiError {
  // Add feature-specific context
  const enhancedContext = {
    ...context,
    feature: 'exams-preparation'
  };
  
  // Use the core error handling with our enhanced context
  return handleError(error, {
    context: enhancedContext,
    rethrow: true
  });
}

/**
 * Check if an error is a validation error
 * 
 * @param error The error to check
 * @returns True if the error is a validation error
 */
export function isValidationError(error: any): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Check if an error is an authentication error
 * 
 * @param error The error to check
 * @returns True if the error is an authentication error
 */
export function isAuthenticationError(error: any): error is AuthenticationError {
  return error instanceof AuthenticationError;
}

/**
 * Check if an error is an authorization error
 * 
 * @param error The error to check
 * @returns True if the error is an authorization error
 */
export function isAuthorizationError(error: any): error is AuthorizationError {
  return error instanceof AuthorizationError;
}

/**
 * Check if an error is a not found error
 * 
 * @param error The error to check
 * @returns True if the error is a not found error
 */
export function isNotFoundError(error: any): error is NotFoundError {
  return error instanceof NotFoundError;
}

/**
 * Extract validation errors from an error
 * 
 * @param error The error to extract validation errors from
 * @returns Validation errors by field or undefined
 */
export function getValidationErrors(
  error: any
): Record<string, string[]> | undefined {
  if (error instanceof ValidationError) {
    return error.validationErrors;
  }
  return undefined;
}

/**
 * Get a user-friendly error message
 * 
 * @param error The error to get a message for
 * @returns A user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: any): string {
  // Create ApiError from any error type
  const apiError = createApiError(error);
  
  if (isValidationError(apiError)) {
    return 'Please check the form for errors.';
  }
  
  if (isAuthenticationError(apiError)) {
    return 'Your session has expired. Please sign in again.';
  }
  
  if (isAuthorizationError(apiError)) {
    return 'You do not have permission to perform this action.';
  }
  
  if (isNotFoundError(apiError)) {
    return 'The requested resource could not be found.';
  }
  
  if (apiError.status === 500) {
    return 'An unexpected error occurred. Please try again later.';
  }
  
  // Use the error message if available
  return apiError.message || 'An error occurred.';
}
