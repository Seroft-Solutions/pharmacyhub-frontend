/**
 * API Error Handler
 * 
 * This module provides utilities for handling API errors consistently
 * across the application.
 */
import { AxiosError } from 'axios';
import { logger } from '@/shared/lib/logger';

// API Error interface
export interface ApiError extends Error {
  status?: number;
  data?: any;
  originalError?: any;
}

/**
 * Create enhanced error with additional context
 * 
 * @param error Original error from API
 * @returns Enhanced error with additional properties
 */
export function createApiError(error: AxiosError): ApiError {
  // If there's no response data, return the original error as is
  if (!error.response?.data) {
    const apiError = error as ApiError;
    apiError.status = error.response?.status;
    return apiError;
  }
  
  // Create enhanced error with more details
  const responseData = error.response.data;
  const enhancedError = new Error(
    responseData.message || responseData.error || error.message
  ) as ApiError;
  
  // Add additional properties for better context
  enhancedError.status = error.response.status;
  enhancedError.data = responseData;
  enhancedError.originalError = error;
  
  return enhancedError;
}

/**
 * Log API error with appropriate detail level
 * 
 * @param error The API error to log
 * @param context Optional additional context information
 */
export function logApiErrorWithContext(
  error: ApiError | AxiosError | Error, 
  context?: Record<string, any>
): void {
  // Determine what kind of error we're dealing with
  const isAxiosError = (error as AxiosError).isAxiosError;
  const isApiError = (error as ApiError).status !== undefined;
  
  if (isAxiosError) {
    const axiosError = error as AxiosError;
    logger.error('API Error:', {
      message: axiosError.message,
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      url: axiosError.config?.url,
      method: axiosError.config?.method?.toUpperCase(),
      data: axiosError.response?.data,
      ...context
    });
  } else if (isApiError) {
    const apiError = error as ApiError;
    logger.error('API Error:', {
      message: apiError.message,
      status: apiError.status,
      data: apiError.data,
      ...context
    });
  } else {
    // Generic error
    logger.error('Error:', {
      message: error.message,
      stack: error.stack,
      ...context
    });
  }
}

/**
 * Handle API errors in a consistent way
 * 
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
  const { rethrow = true, context = {} } = options;
  
  // Determine if this is an axios error and convert if needed
  const apiError = (error as AxiosError).isAxiosError
    ? createApiError(error as AxiosError)
    : (error as ApiError);
  
  // Log the error with context
  logApiErrorWithContext(apiError, context);
  
  // Rethrow if requested
  if (rethrow) {
    throw apiError;
  }
  
  return apiError;
}
