/**
 * @deprecated This file is deprecated. Use the new ErrorHandlingService instead.
 * 
 * Utility for handling API errors and mapping them to our exception constants
 */

import { 
  ErrorCategory, 
  getErrorDetails, 
  getErrorDetailsByCode,
  ErrorDetails,
  ErrorSeverity
} from './exceptions';

// HTTP status code to ErrorCategory mapping
const STATUS_CODE_TO_CATEGORY: Record<number, ErrorCategory> = {
  400: ErrorCategory.VALIDATION,
  401: ErrorCategory.AUTHENTICATION,
  403: ErrorCategory.PERMISSION,
  404: ErrorCategory.VALIDATION,
  409: ErrorCategory.VALIDATION,
  500: ErrorCategory.NETWORK,
  502: ErrorCategory.NETWORK,
  503: ErrorCategory.NETWORK,
  504: ErrorCategory.NETWORK,
};

/**
 * Standard error response structure from backend
 */
interface ApiErrorResponse {
  status: number;
  errorCode?: string;
  message?: string;
  timestamp?: string;
  path?: string;
  details?: Record<string, any>;
}

/**
 * Parse error response from API
 */
export const parseApiError = async (error: any): Promise<ErrorDetails> => {
  try {
    let apiError: ApiErrorResponse | undefined;
    
    // Handle different types of errors
    if (error.response) {
      // The request was made and the server responded with an error status
      try {
        apiError = await error.response.json();
      } catch (e) {
        apiError = {
          status: error.response.status,
          message: error.response.statusText,
        };
      }
    } else if (error instanceof Error) {
      // Standard JS error object
      if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        // Network error
        return getErrorDetails(ErrorCategory.NETWORK, 'CONNECTION_FAILED') || {
          code: 'NET_001',
          message: 'Unable to connect to the server.',
          action: 'Please check your internet connection and try again.',
          severity: ErrorSeverity.ERROR,
          recoverable: true,
        };
      }
      
      // Generic error
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message || 'An unknown error occurred.',
        action: 'Please try again. If the problem persists, contact support.',
        severity: ErrorSeverity.ERROR,
        recoverable: true,
      };
    } else {
      // Unknown error structure
      return {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred.',
        action: 'Please try again. If the problem persists, contact support.',
        severity: ErrorSeverity.ERROR,
        recoverable: true,
      };
    }
    
    // If we have an error code from the API, use it directly
    if (apiError?.errorCode) {
      const errorDetails = getErrorDetailsByCode(apiError.errorCode);
      if (errorDetails) {
        return errorDetails;
      }
    }
    
    // Map status code to error category
    const category = STATUS_CODE_TO_CATEGORY[apiError?.status || 500] || ErrorCategory.NETWORK;
    
    // Map common status codes to specific errors
    if (apiError?.status === 401) {
      return getErrorDetails(category, 'INVALID_CREDENTIALS') || {
        code: 'AUTH_001',
        message: apiError.message || 'Authentication failed.',
        action: 'Please check your credentials and try again.',
        severity: ErrorSeverity.ERROR,
        recoverable: true,
      };
    }
    
    if (apiError?.status === 403) {
      return getErrorDetails(category, 'INSUFFICIENT_PERMISSIONS') || {
        code: 'PERM_001',
        message: apiError.message || 'You do not have permission to perform this action.',
        action: 'Please contact your administrator for access.',
        severity: ErrorSeverity.ERROR,
        recoverable: false,
      };
    }
    
    if (apiError?.status === 500) {
      return getErrorDetails(category, 'SERVER_ERROR') || {
        code: 'NET_003',
        message: apiError.message || 'The server encountered an error while processing your request.',
        action: 'Please try again later. If the problem persists, contact support.',
        severity: ErrorSeverity.ERROR,
        recoverable: false,
      };
    }
    
    // Default error details if no specific mapping found
    return {
      code: `${category.toUpperCase()}_UNKNOWN`,
      message: apiError?.message || 'An unexpected error occurred.',
      action: 'Please try again. If the problem persists, contact support.',
      severity: ErrorSeverity.ERROR,
      recoverable: true,
    };
  } catch (e) {
    // Error when parsing the error (meta-error)
    console.error('Error parsing API error:', e);
    return {
      code: 'PARSE_ERROR',
      message: 'An error occurred while processing the response from the server.',
      action: 'Please try again. If the problem persists, contact support.',
      severity: ErrorSeverity.ERROR,
      recoverable: true,
    };
  }
};

/**
 * Convert an error to a user-friendly message
 */
export const getUserFriendlyErrorMessage = async (error: any): Promise<string> => {
  const errorDetails = await parseApiError(error);
  return errorDetails.message;
};

/**
 * Get recommended action for an error
 */
export const getErrorAction = async (error: any): Promise<string> => {
  const errorDetails = await parseApiError(error);
  return errorDetails.action;
};

/**
 * Check if an error is recoverable
 */
export const isErrorRecoverable = async (error: any): Promise<boolean> => {
  const errorDetails = await parseApiError(error);
  return errorDetails.recoverable !== false;
};
