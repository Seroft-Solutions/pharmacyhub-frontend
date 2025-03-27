/**
 * Constants for exception handling in the anti-sharing feature
 */

import { LoginStatus } from '../../types';

/**
 * Enum for error severity levels
 */
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Interface for error details
 */
export interface ErrorDetails {
  code: string;
  message: string;
  action: string;
  severity: ErrorSeverity;
  recoverable: boolean;
  icon?: string; // Optional icon identifier
}

/**
 * Categories of errors
 */
export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  SESSION = 'session',
  NETWORK = 'network',
  VALIDATION = 'validation',
  PERMISSION = 'permission',
}

/**
 * Type for error map structure
 */
export type ErrorMap = Record<string, ErrorDetails>;

/**
 * Authentication errors
 */
export const AUTHENTICATION_ERRORS: ErrorMap = {
  INVALID_CREDENTIALS: {
    code: 'AUTH_001',
    message: 'The username or password you entered is incorrect.',
    action: 'Please check your credentials and try again.',
    severity: ErrorSeverity.ERROR,
    recoverable: true,
    icon: 'shield-alert',
  },
  ACCOUNT_LOCKED: {
    code: 'AUTH_002',
    message: 'Your account has been locked due to multiple failed login attempts.',
    action: 'Please contact support to unlock your account.',
    severity: ErrorSeverity.ERROR,
    recoverable: false,
    icon: 'shield-off',
  },
  TOKEN_EXPIRED: {
    code: 'AUTH_003',
    message: 'Your session has expired.',
    action: 'Please log in again to continue.',
    severity: ErrorSeverity.WARNING,
    recoverable: true,
    icon: 'clock',
  },
  INVALID_TOKEN: {
    code: 'AUTH_004',
    message: 'Your authentication token is invalid.',
    action: 'Please log in again to continue.',
    severity: ErrorSeverity.ERROR,
    recoverable: true,
    icon: 'shield-alert',
  },
};

/**
 * Session errors
 */
export const SESSION_ERRORS: ErrorMap = {
  MULTIPLE_ACTIVE_SESSIONS: {
    code: 'SESS_001',
    message: 'You are already logged in from another device.',
    action: 'Log out from the other device or click "Log Out Other Devices" to continue with this session.',
    severity: ErrorSeverity.WARNING,
    recoverable: true,
    icon: 'log-out',
  },
  SUSPICIOUS_LOCATION: {
    code: 'SESS_002',
    message: 'We detected a login attempt from an unusual location.',
    action: 'Verify your identity to continue or contact support if you didn\'t attempt to log in.',
    severity: ErrorSeverity.WARNING,
    recoverable: true,
    icon: 'shield-alert',
  },
  SESSION_TERMINATED: {
    code: 'SESS_003',
    message: 'Your session was terminated from another device.',
    action: 'Please log in again to continue. If you didn\'t terminate your session, consider changing your password.',
    severity: ErrorSeverity.WARNING,
    recoverable: true,
    icon: 'log-out',
  },
  NEW_DEVICE: {
    code: 'SESS_004',
    message: 'We detected a login attempt from a new device.',
    action: 'Verify your identity to continue using this new device.',
    severity: ErrorSeverity.INFO,
    recoverable: true,
    icon: 'shield',
  },
  OTP_REQUIRED: {
    code: 'SESS_005',
    message: 'Additional verification is required for your security.',
    action: 'Please enter the verification code sent to your email or mobile device.',
    severity: ErrorSeverity.INFO,
    recoverable: true,
    icon: 'shield',
  },
  MAX_DEVICES_REACHED: {
    code: 'SESS_006',
    message: 'You have reached the maximum number of allowed devices.',
    action: 'Please remove an existing device from your account settings before adding a new one.',
    severity: ErrorSeverity.WARNING,
    recoverable: true,
    icon: 'shield-alert',
  },
  SESSION_EXPIRED: {
    code: 'SESS_007',
    message: 'Your session has expired due to inactivity.',
    action: 'Please log in again to continue.',
    severity: ErrorSeverity.INFO,
    recoverable: true,
    icon: 'clock',
  },
};

/**
 * Network errors
 */
export const NETWORK_ERRORS: ErrorMap = {
  CONNECTION_FAILED: {
    code: 'NET_001',
    message: 'Unable to connect to the server.',
    action: 'Please check your internet connection and try again.',
    severity: ErrorSeverity.ERROR,
    recoverable: true,
    icon: 'wifi-off',
  },
  REQUEST_TIMEOUT: {
    code: 'NET_002',
    message: 'The request timed out.',
    action: 'Please try again. If the problem persists, contact support.',
    severity: ErrorSeverity.WARNING,
    recoverable: true,
    icon: 'clock',
  },
  SERVER_ERROR: {
    code: 'NET_003',
    message: 'The server encountered an error while processing your request.',
    action: 'Please try again later. If the problem persists, contact support.',
    severity: ErrorSeverity.ERROR,
    recoverable: false,
    icon: 'server-off',
  },
};

/**
 * Validation errors
 */
export const VALIDATION_ERRORS: ErrorMap = {
  INVALID_INPUT: {
    code: 'VAL_001',
    message: 'Some of the information you provided is invalid.',
    action: 'Please check your input and try again.',
    severity: ErrorSeverity.WARNING,
    recoverable: true,
    icon: 'alert-circle',
  },
  MISSING_REQUIRED_FIELD: {
    code: 'VAL_002',
    message: 'Required information is missing.',
    action: 'Please fill in all required fields and try again.',
    severity: ErrorSeverity.WARNING,
    recoverable: true,
    icon: 'alert-circle',
  },
};

/**
 * Permission errors
 */
export const PERMISSION_ERRORS: ErrorMap = {
  INSUFFICIENT_PERMISSIONS: {
    code: 'PERM_001',
    message: 'You do not have permission to perform this action.',
    action: 'Please contact your administrator for access.',
    severity: ErrorSeverity.ERROR,
    recoverable: false,
    icon: 'lock',
  },
  ROLE_RESTRICTED: {
    code: 'PERM_002',
    message: 'This feature is restricted to users with specific roles.',
    action: 'Please contact your administrator for role assignment.',
    severity: ErrorSeverity.ERROR,
    recoverable: false,
    icon: 'lock',
  },
};

/**
 * Combined map of all errors
 */
export const ALL_ERRORS: Record<ErrorCategory, ErrorMap> = {
  [ErrorCategory.AUTHENTICATION]: AUTHENTICATION_ERRORS,
  [ErrorCategory.SESSION]: SESSION_ERRORS,
  [ErrorCategory.NETWORK]: NETWORK_ERRORS,
  [ErrorCategory.VALIDATION]: VALIDATION_ERRORS,
  [ErrorCategory.PERMISSION]: PERMISSION_ERRORS,
};

/**
 * Get error details by category and error code
 */
export const getErrorDetails = (
  category: ErrorCategory, 
  errorKey: string
): ErrorDetails | undefined => {
  return ALL_ERRORS[category]?.[errorKey];
};

/**
 * Get error details by full error code (e.g., 'SESS_001')
 */
export const getErrorDetailsByCode = (code: string): ErrorDetails | undefined => {
  for (const category in ALL_ERRORS) {
    for (const key in ALL_ERRORS[category as ErrorCategory]) {
      if (ALL_ERRORS[category as ErrorCategory][key].code === code) {
        return ALL_ERRORS[category as ErrorCategory][key];
      }
    }
  }
  return undefined;
};

/**
 * Map from LoginStatus to session error keys
 */
export const LOGIN_STATUS_TO_ERROR_KEY: Record<string, string> = {
  [LoginStatus.NEW_DEVICE]: 'NEW_DEVICE',
  [LoginStatus.SUSPICIOUS_LOCATION]: 'SUSPICIOUS_LOCATION',
  [LoginStatus.TOO_MANY_DEVICES]: 'MULTIPLE_ACTIVE_SESSIONS',
  [LoginStatus.OTP_REQUIRED]: 'OTP_REQUIRED',
};

/**
 * Get error details for a login status
 */
export const getErrorDetailsForLoginStatus = (
  loginStatus: LoginStatus
): ErrorDetails | undefined => {
  const errorKey = LOGIN_STATUS_TO_ERROR_KEY[loginStatus];
  if (errorKey) {
    return getErrorDetails(ErrorCategory.SESSION, errorKey);
  }
  return undefined;
};
