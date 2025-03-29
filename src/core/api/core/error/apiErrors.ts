/**
 * API Error Classes
 * 
 * This module provides specialized error classes for different API error scenarios,
 * allowing for more precise error handling and better error messages.
 */
import { ApiError } from './baseError';

/**
 * Network error (connection issues, timeouts, etc.)
 */
export class NetworkError extends ApiError {
  /**
   * Creates a new NetworkError
   * 
   * @param message Error message
   * @param originalError Original error that caused this error (optional)
   */
  constructor(message: string, originalError?: any) {
    super(
      message || 'Network error occurred',
      0, // No HTTP status for network errors
      undefined,
      originalError,
      'NETWORK_ERROR'
    );
  }
}

/**
 * Authentication error (401 Unauthorized)
 */
export class AuthenticationError extends ApiError {
  /**
   * Creates a new AuthenticationError
   * 
   * @param message Error message
   * @param data Response data (optional)
   * @param originalError Original error that caused this error (optional)
   */
  constructor(message: string, data?: any, originalError?: any) {
    super(
      message || 'Authentication failed',
      401,
      data,
      originalError,
      'AUTHENTICATION_ERROR'
    );
  }
}

/**
 * Authorization error (403 Forbidden)
 */
export class AuthorizationError extends ApiError {
  /**
   * Creates a new AuthorizationError
   * 
   * @param message Error message
   * @param data Response data (optional)
   * @param originalError Original error that caused this error (optional)
   */
  constructor(message: string, data?: any, originalError?: any) {
    super(
      message || 'Not authorized to access this resource',
      403,
      data,
      originalError,
      'AUTHORIZATION_ERROR'
    );
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends ApiError {
  /**
   * Creates a new NotFoundError
   * 
   * @param message Error message
   * @param data Response data (optional)
   * @param originalError Original error that caused this error (optional)
   */
  constructor(message: string, data?: any, originalError?: any) {
    super(
      message || 'Resource not found',
      404,
      data,
      originalError,
      'NOT_FOUND_ERROR'
    );
  }
}

/**
 * Validation error (400 Bad Request)
 */
export class ValidationError extends ApiError {
  /** Validation errors by field */
  validationErrors?: Record<string, string[]>;
  
  /**
   * Creates a new ValidationError
   * 
   * @param message Error message
   * @param validationErrors Validation errors by field (optional)
   * @param data Response data (optional)
   * @param originalError Original error that caused this error (optional)
   */
  constructor(
    message: string,
    validationErrors?: Record<string, string[]>,
    data?: any,
    originalError?: any
  ) {
    super(
      message || 'Validation failed',
      400,
      data,
      originalError,
      'VALIDATION_ERROR'
    );
    this.validationErrors = validationErrors;
  }

  /**
   * Converts the error to a plain object for logging or serialization
   * Includes validation-specific properties
   * 
   * @returns A plain object representation of the error
   */
  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      validationErrors: this.validationErrors
    };
  }
}

/**
 * Server error (5xx errors)
 */
export class ServerError extends ApiError {
  /**
   * Creates a new ServerError
   * 
   * @param message Error message
   * @param status HTTP status code (defaults to 500)
   * @param data Response data (optional)
   * @param originalError Original error that caused this error (optional)
   */
  constructor(
    message: string,
    status: number = 500,
    data?: any,
    originalError?: any
  ) {
    super(
      message || 'Server error occurred',
      status,
      data,
      originalError,
      'SERVER_ERROR'
    );
  }
}

/**
 * Request canceled error
 */
export class CanceledError extends ApiError {
  /**
   * Creates a new CanceledError
   * 
   * @param message Error message
   * @param originalError Original error that caused this error (optional)
   */
  constructor(message: string, originalError?: any) {
    super(
      message || 'Request was canceled',
      0, // No HTTP status for canceled requests
      undefined,
      originalError,
      'CANCELED_ERROR'
    );
  }
}

/**
 * Rate limit exceeded error (429 Too Many Requests)
 */
export class RateLimitError extends ApiError {
  /** When the rate limit will reset */
  retryAfter?: number;
  
  /**
   * Creates a new RateLimitError
   * 
   * @param message Error message
   * @param retryAfter Seconds until rate limit resets (optional)
   * @param data Response data (optional)
   * @param originalError Original error that caused this error (optional)
   */
  constructor(
    message: string,
    retryAfter?: number,
    data?: any,
    originalError?: any
  ) {
    super(
      message || 'Rate limit exceeded',
      429,
      data,
      originalError,
      'RATE_LIMIT_ERROR'
    );
    this.retryAfter = retryAfter;
  }

  /**
   * Converts the error to a plain object for logging or serialization
   * Includes rate limit specific properties
   * 
   * @returns A plain object representation of the error
   */
  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      retryAfter: this.retryAfter
    };
  }
}

/**
 * Unknown API error (for unrecognized error patterns)
 */
export class UnknownError extends ApiError {
  /**
   * Creates a new UnknownError
   * 
   * @param message Error message
   * @param status HTTP status code (optional)
   * @param data Response data (optional)
   * @param originalError Original error that caused this error (optional)
   */
  constructor(
    message: string,
    status?: number,
    data?: any,
    originalError?: any
  ) {
    super(
      message || 'Unknown error occurred',
      status,
      data,
      originalError,
      'UNKNOWN_ERROR'
    );
  }
}
