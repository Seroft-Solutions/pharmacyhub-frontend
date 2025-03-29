/**
 * Base Error Classes
 * 
 * This module provides the foundation for all custom error classes
 * in the application, with enhanced error handling capabilities.
 */

/**
 * Base class for all custom errors in the application
 * Extends the native Error class with improved serialization
 */
export class BaseError extends Error {
  /**
   * Constructor for BaseError
   * 
   * @param message The error message
   * @param options Additional error options
   */
  constructor(message: string, options: ErrorOptions = {}) {
    super(message, options);
    
    // Ensure the name is correctly set for better debugging
    this.name = this.constructor.name;
    
    // This fixes the prototype chain in transpiled JavaScript
    Object.setPrototypeOf(this, new.target.prototype);
    
    // Capture stack trace if available
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Converts the error to a plain object for logging or serialization
   * 
   * @returns A plain object representation of the error
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack
    };
  }
}

/**
 * Base class for all API-related errors
 * Extends BaseError with additional properties for API context
 */
export class ApiError extends BaseError {
  /** HTTP status code */
  status?: number;
  
  /** Response data from the API */
  data?: any;
  
  /** Original error that caused this error */
  originalError?: any;
  
  /** Error code for more specific error identification */
  code?: string;
  
  /**
   * Constructor for ApiError
   * 
   * @param message The error message
   * @param status HTTP status code (optional)
   * @param data Response data (optional)
   * @param originalError Original error that caused this error (optional)
   * @param code Error code for more specific error identification (optional)
   */
  constructor(
    message: string,
    status?: number,
    data?: any,
    originalError?: any,
    code?: string
  ) {
    super(message);
    this.status = status;
    this.data = data;
    this.originalError = originalError;
    this.code = code;
  }

  /**
   * Converts the error to a plain object for logging or serialization
   * Includes API-specific properties
   * 
   * @returns A plain object representation of the error
   */
  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      status: this.status,
      code: this.code,
      data: this.data,
      originalError: this.originalError instanceof Error 
        ? (this.originalError as Error).message 
        : this.originalError
    };
  }
}
