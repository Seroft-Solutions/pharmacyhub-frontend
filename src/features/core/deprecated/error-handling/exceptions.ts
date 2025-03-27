/**
 * @deprecated This file is deprecated. Use the new ErrorHandlingService instead.
 * 
 * Constants for exception handling
 */

export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  PERMISSION = 'permission',
  VALIDATION = 'validation',
  NETWORK = 'network'
}

export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

export interface ErrorDetails {
  code: string;
  message: string;
  action: string;
  severity: ErrorSeverity;
  recoverable: boolean;
}

// Error types by category and code
const ERROR_DETAILS: Record<ErrorCategory, Record<string, ErrorDetails>> = {
  [ErrorCategory.AUTHENTICATION]: {
    'INVALID_CREDENTIALS': {
      code: 'AUTH_001',
      message: 'Invalid username or password.',
      action: 'Please check your credentials and try again.',
      severity: ErrorSeverity.ERROR,
      recoverable: true,
    },
    'SESSION_EXPIRED': {
      code: 'AUTH_002',
      message: 'Your session has expired.',
      action: 'Please log in again to continue.',
      severity: ErrorSeverity.WARNING,
      recoverable: true,
    },
    'ACCOUNT_LOCKED': {
      code: 'AUTH_003',
      message: 'Your account has been locked due to too many failed login attempts.',
      action: 'Please contact support to unlock your account.',
      severity: ErrorSeverity.ERROR,
      recoverable: false,
    },
  },
  [ErrorCategory.PERMISSION]: {
    'INSUFFICIENT_PERMISSIONS': {
      code: 'PERM_001',
      message: 'You do not have permission to perform this action.',
      action: 'Please contact your administrator for access.',
      severity: ErrorSeverity.ERROR,
      recoverable: false,
    },
  },
  [ErrorCategory.VALIDATION]: {
    'INVALID_INPUT': {
      code: 'VAL_001',
      message: 'The provided input is invalid.',
      action: 'Please check your input and try again.',
      severity: ErrorSeverity.WARNING,
      recoverable: true,
    },
    'REQUIRED_FIELD': {
      code: 'VAL_002',
      message: 'Required field is missing.',
      action: 'Please fill in all required fields.',
      severity: ErrorSeverity.WARNING,
      recoverable: true,
    },
  },
  [ErrorCategory.NETWORK]: {
    'CONNECTION_FAILED': {
      code: 'NET_001',
      message: 'Unable to connect to the server.',
      action: 'Please check your internet connection and try again.',
      severity: ErrorSeverity.ERROR,
      recoverable: true,
    },
    'TIMEOUT': {
      code: 'NET_002',
      message: 'The request timed out.',
      action: 'Please try again. If the problem persists, contact support.',
      severity: ErrorSeverity.ERROR,
      recoverable: true,
    },
    'SERVER_ERROR': {
      code: 'NET_003',
      message: 'The server encountered an error.',
      action: 'Please try again later. If the problem persists, contact support.',
      severity: ErrorSeverity.ERROR,
      recoverable: false,
    },
  },
};

// Map of error codes to details for quick lookup
const ERROR_CODES: Record<string, ErrorDetails> = {};

// Build the error codes lookup table
Object.values(ERROR_DETAILS).forEach(categoryErrors => {
  Object.values(categoryErrors).forEach(details => {
    ERROR_CODES[details.code] = details;
  });
});

/**
 * Get error details by category and error type
 */
export const getErrorDetails = (
  category: ErrorCategory, 
  errorType: string
): ErrorDetails | null => {
  if (ERROR_DETAILS[category] && ERROR_DETAILS[category][errorType]) {
    return ERROR_DETAILS[category][errorType];
  }
  return null;
};

/**
 * Get error details by error code
 */
export const getErrorDetailsByCode = (code: string): ErrorDetails | null => {
  return ERROR_CODES[code] || null;
};
