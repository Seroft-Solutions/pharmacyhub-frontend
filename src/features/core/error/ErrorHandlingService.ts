/**
 * Centralized service for handling errors in the application.
 * This replaces the scattered error handling code across components.
 */

// Import ErrorStore once it's implemented
// import { ErrorStore } from './ErrorStore';

export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  NETWORK = 'network',
  SERVER = 'server',
  CLIENT = 'client',
  SESSION = 'session'
}

export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

export interface ErrorDetails {
  code: string;
  message: string;
  resolution: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  recoverable: boolean;
  details?: Record<string, any>;
}

/**
 * Standard error response structure from backend
 */
export interface ApiErrorResponse {
  status: number;
  errorCode?: string;
  message?: string;
  resolution?: string;
  timestamp?: string;
  path?: string;
  details?: Record<string, any>;
}

// HTTP status code to ErrorCategory mapping
const STATUS_CODE_TO_CATEGORY: Record<number, ErrorCategory> = {
  400: ErrorCategory.VALIDATION,
  401: ErrorCategory.AUTHENTICATION,
  403: ErrorCategory.AUTHORIZATION,
  404: ErrorCategory.VALIDATION,
  409: ErrorCategory.VALIDATION,
  500: ErrorCategory.SERVER,
  502: ErrorCategory.NETWORK,
  503: ErrorCategory.NETWORK,
  504: ErrorCategory.NETWORK,
};

// HTTP status code to ErrorSeverity mapping
const STATUS_CODE_TO_SEVERITY: Record<number, ErrorSeverity> = {
  400: ErrorSeverity.WARNING,
  401: ErrorSeverity.WARNING,
  403: ErrorSeverity.WARNING,
  404: ErrorSeverity.WARNING,
  409: ErrorSeverity.WARNING,
  500: ErrorSeverity.ERROR,
  502: ErrorSeverity.ERROR,
  503: ErrorSeverity.ERROR,
  504: ErrorSeverity.ERROR,
};

export class ErrorHandlingService {
  // private errorStore: ErrorStore;

  constructor() {
    // this.errorStore = new ErrorStore();
  }

  /**
   * Parse error response from API
   */
  async parseApiError(error: any): Promise<ErrorDetails> {
    try {
      let apiError: ApiErrorResponse | undefined;
      
      // Handle Axios or Fetch API errors
      if (error.response) {
        // Axios-like error
        if (error.response.data) {
          apiError = error.response.data;
        } else {
          apiError = {
            status: error.response.status,
            message: error.response.statusText,
          };
        }
      } else if (error.status !== undefined) {
        // Fetch API error
        try {
          const data = await error.json();
          apiError = data;
        } catch (e) {
          apiError = {
            status: error.status,
            message: error.statusText,
          };
        }
      } else if (error instanceof Error) {
        // Standard JS error object
        if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
          // Network error
          return {
            code: 'NET_001',
            message: 'Unable to connect to the server.',
            resolution: 'Please check your internet connection and try again later.',
            category: ErrorCategory.NETWORK,
            severity: ErrorSeverity.ERROR,
            recoverable: true,
          };
        }
        
        // Generic error
        return {
          code: 'UNKNOWN_ERROR',
          message: error.message || 'An unknown error occurred.',
          resolution: 'Please try again. If the problem persists, contact support.',
          category: ErrorCategory.CLIENT,
          severity: ErrorSeverity.ERROR,
          recoverable: true,
        };
      } else {
        // Unknown error structure
        return {
          code: 'UNKNOWN_ERROR',
          message: 'An unknown error occurred.',
          resolution: 'Please try again. If the problem persists, contact support.',
          category: ErrorCategory.CLIENT,
          severity: ErrorSeverity.ERROR,
          recoverable: true,
        };
      }
      
      // Determine category and severity based on status code
      const status = apiError?.status || 500;
      const category = STATUS_CODE_TO_CATEGORY[status] || ErrorCategory.SERVER;
      const severity = STATUS_CODE_TO_SEVERITY[status] || ErrorSeverity.ERROR;
      
      // Create error details from API response
      return {
        code: apiError?.errorCode || `${category.toUpperCase()}_${status}`,
        message: apiError?.message || 'An unexpected error occurred.',
        resolution: apiError?.resolution || 'Please try again. If the problem persists, contact support.',
        category,
        severity,
        recoverable: status < 500, // Server errors are generally not recoverable by user actions
        details: apiError?.details,
      };
    } catch (e) {
      // Error when parsing the error (meta-error)
      console.error('Error parsing API error:', e);
      return {
        code: 'PARSE_ERROR',
        message: 'An error occurred while processing the response from the server.',
        resolution: 'Please try again. If the problem persists, contact support.',
        category: ErrorCategory.CLIENT,
        severity: ErrorSeverity.ERROR,
        recoverable: true,
      };
    }
  }

  /**
   * Handle session-related errors
   */
  async handleSessionError(error: any): Promise<ErrorDetails> {
    const errorDetails = await this.parseApiError(error);
    
    // Check if it's a session-related error
    if (errorDetails.code.includes('SESSION') || errorDetails.category === ErrorCategory.AUTHENTICATION) {
      errorDetails.category = ErrorCategory.SESSION;
      
      // Handle specific session error codes
      if (errorDetails.code === 'ERR_SESSION_EXPIRED') {
        errorDetails.message = 'Your session has expired.';
        errorDetails.resolution = 'Please log in again to continue.';
        errorDetails.recoverable = true;
      } else if (errorDetails.code === 'ERR_SESSION_CONFLICT') {
        errorDetails.message = 'You are already logged in from another device.';
        errorDetails.resolution = 'Please log out from other devices or continue with this session.';
        errorDetails.recoverable = true;
      }
      
      // TODO: Update error store with session error
      // this.errorStore.setSessionError(errorDetails);
    }
    
    return errorDetails;
  }

  /**
   * Handle authentication errors
   */
  async handleAuthError(error: any): Promise<ErrorDetails> {
    const errorDetails = await this.parseApiError(error);
    
    if (errorDetails.category === ErrorCategory.AUTHENTICATION) {
      // Handle specific authentication error codes
      if (errorDetails.code === 'ERR_AUTHENTICATION') {
        errorDetails.message = 'Authentication failed.';
        errorDetails.resolution = 'Please check your credentials and try again.';
      } else if (errorDetails.code === 'ERR_INVALID_TOKEN') {
        errorDetails.message = 'Your authentication token is invalid or expired.';
        errorDetails.resolution = 'Please log in again to continue.';
      } else if (errorDetails.code === 'ERR_ACCOUNT_DISABLED') {
        errorDetails.message = 'Your account is disabled.';
        errorDetails.resolution = 'Please contact support for assistance.';
        errorDetails.recoverable = false;
      }
      
      // TODO: Update error store with authentication error
      // this.errorStore.setAuthError(errorDetails);
    }
    
    return errorDetails;
  }

  /**
   * Get user-friendly error message
   */
  async getUserFriendlyErrorMessage(error: any): Promise<string> {
    const errorDetails = await this.parseApiError(error);
    return errorDetails.message;
  }

  /**
   * Get resolution instructions for an error
   */
  async getErrorResolution(error: any): Promise<string> {
    const errorDetails = await this.parseApiError(error);
    return errorDetails.resolution;
  }

  /**
   * Check if an error is recoverable
   */
  async isErrorRecoverable(error: any): Promise<boolean> {
    const errorDetails = await this.parseApiError(error);
    return errorDetails.recoverable;
  }

  /**
   * Log error to monitoring/analytics service
   */
  logError(error: any, context?: Record<string, any>): void {
    // TODO: Implement error logging to a service like Sentry or a custom endpoint
    console.error('Error logged:', error, context);
  }
}

// Create a singleton instance
export const errorHandlingService = new ErrorHandlingService();
