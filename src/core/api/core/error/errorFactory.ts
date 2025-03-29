/**
 * Error Factory Functions
 * 
 * This module provides utility functions for creating appropriate error instances
 * from various inputs like Axios errors, HTTP responses, etc.
 */
import { AxiosError } from 'axios';
import { ApiError } from './baseError';
import {
  NetworkError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  ServerError,
  CanceledError,
  RateLimitError,
  UnknownError
} from './apiErrors';

/**
 * Extract validation errors from response data if available
 * 
 * @param data Response data
 * @returns Validation errors by field or undefined if not available
 */
function extractValidationErrors(data: any): Record<string, string[]> | undefined {
  // Handle Spring Boot validation error format
  if (data?.errors && Array.isArray(data.errors)) {
    const validationErrors: Record<string, string[]> = {};
    
    data.errors.forEach((error: any) => {
      if (error.field && error.message) {
        if (!validationErrors[error.field]) {
          validationErrors[error.field] = [];
        }
        validationErrors[error.field].push(error.message);
      }
    });
    
    return Object.keys(validationErrors).length > 0 ? validationErrors : undefined;
  }
  
  // Handle alternative validation error format
  if (data?.validationErrors && typeof data.validationErrors === 'object') {
    return data.validationErrors;
  }
  
  return undefined;
}

/**
 * Create an API error from response data
 * 
 * @param data Response data
 * @param status HTTP status code
 * @param originalError Original error that caused this error (optional)
 * @returns Appropriate error instance
 */
export function createErrorFromResponseData(
  data: any,
  status: number,
  originalError?: any
): ApiError {
  // Extract error message from different possible locations
  const message = data?.message || data?.error || 
                 (data?.errors && data.errors[0]?.message) || 
                 'Unknown error occurred';
                 
  // Create the appropriate error based on status code
  switch (status) {
    case 400:
      // Check if this is a validation error
      const validationErrors = extractValidationErrors(data);
      if (validationErrors) {
        return new ValidationError(message, validationErrors, data, originalError);
      }
      return new ValidationError(message, undefined, data, originalError);
      
    case 401:
      return new AuthenticationError(message, data, originalError);
      
    case 403:
      return new AuthorizationError(message, data, originalError);
      
    case 404:
      return new NotFoundError(message, data, originalError);
      
    case 429:
      // Extract retry-after header if available
      let retryAfter;
      if (originalError?.response?.headers?.['retry-after']) {
        retryAfter = parseInt(originalError.response.headers['retry-after'], 10);
      }
      return new RateLimitError(message, retryAfter, data, originalError);
      
    default:
      // Server errors (5xx)
      if (status >= 500 && status < 600) {
        return new ServerError(message, status, data, originalError);
      }
      
      // Other client errors (4xx)
      if (status >= 400 && status < 500) {
        return new ApiError(message, status, data, originalError);
      }
      
      // Unrecognized status code
      return new UnknownError(message, status, data, originalError);
  }
}

/**
 * Create an API error from an Axios error
 * 
 * @param error The Axios error
 * @returns Appropriate error instance
 */
export function createErrorFromAxiosError(error: AxiosError): ApiError {
  // Handle network errors
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return new NetworkError('Request timed out', error);
  }
  
  if (error.code === 'ECONNREFUSED') {
    return new NetworkError('Connection refused', error);
  }
  
  if (error.code === 'ERR_NETWORK') {
    return new NetworkError('Network error', error);
  }
  
  // Handle canceled requests
  if (axios.isCancel(error)) {
    return new CanceledError('Request canceled', error);
  }
  
  // If we have a response, process it based on status code
  if (error.response?.data && error.response?.status) {
    return createErrorFromResponseData(
      error.response.data,
      error.response.status,
      error
    );
  }
  
  // Fallback for unknown errors
  return new UnknownError(
    error.message || 'Unknown error occurred',
    error.response?.status,
    error.response?.data,
    error
  );
}

/**
 * Create an API error from any error type
 * Determines the appropriate error factory to use based on the input
 * 
 * @param error The error to process
 * @returns Appropriate error instance
 */
export function createApiError(error: any): ApiError {
  // If already an ApiError instance, return as is
  if (error instanceof ApiError) {
    return error;
  }
  
  // Process Axios errors
  if ((error as AxiosError).isAxiosError) {
    return createErrorFromAxiosError(error as AxiosError);
  }
  
  // Process Response-like objects
  if (error?.status && (error?.data !== undefined || error?.body !== undefined)) {
    return createErrorFromResponseData(
      error.data || error.body,
      error.status,
      error
    );
  }
  
  // Process Error instances
  if (error instanceof Error) {
    return new UnknownError(error.message, undefined, undefined, error);
  }
  
  // Process string errors
  if (typeof error === 'string') {
    return new UnknownError(error);
  }
  
  // Fallback
  return new UnknownError(
    'Unknown error occurred',
    undefined,
    typeof error === 'object' ? error : undefined
  );
}
