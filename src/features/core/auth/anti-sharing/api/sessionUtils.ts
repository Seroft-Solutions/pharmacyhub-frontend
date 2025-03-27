/**
 * Utility functions for session management and error handling
 */

import { LoginStatus } from '../types';
import { 
  ErrorCategory, 
  ErrorDetails, 
  SESSION_ERRORS 
} from '../constants/exceptions';
import { logger } from '@/shared/lib/logger';

/**
 * Parse error response from API during session operations
 */
export const parseSessionError = (error: any): {
  errorDetails: ErrorDetails | null;
  loginStatus?: LoginStatus;
  message: string;
} => {
  try {
    logger.debug('[SessionUtils] Parsing session error', error);
    
    // Default error message if we can't extract details
    let message = 'An error occurred during session validation';
    let errorDetails: ErrorDetails | null = null;
    let loginStatus: LoginStatus | undefined = undefined;
    
    // Try to extract error details from various possible structures
    if (error.response?.data) {
      // Extract from axios-like response
      const errorData = error.response.data;
      message = errorData.message || errorData.error || message;
      
      // Check for status code in error data
      if (errorData.status === 'TOO_MANY_DEVICES') {
        loginStatus = LoginStatus.TOO_MANY_DEVICES;
        errorDetails = SESSION_ERRORS.MULTIPLE_ACTIVE_SESSIONS;
      } else if (errorData.status === 'NEW_DEVICE') {
        loginStatus = LoginStatus.NEW_DEVICE;
        errorDetails = SESSION_ERRORS.NEW_DEVICE;
      } else if (errorData.status === 'SUSPICIOUS_LOCATION') {
        loginStatus = LoginStatus.SUSPICIOUS_LOCATION;
        errorDetails = SESSION_ERRORS.SUSPICIOUS_LOCATION;
      } else if (errorData.status === 'OTP_REQUIRED') {
        loginStatus = LoginStatus.OTP_REQUIRED;
        errorDetails = SESSION_ERRORS.OTP_REQUIRED;
      }
    } else if (error.status || error.statusCode) {
      // Extract from fetch/Response-like object
      message = error.message || message;
      const status = error.status || error.statusCode;
      
      if (status === 401) {
        loginStatus = LoginStatus.TOO_MANY_DEVICES;
        errorDetails = SESSION_ERRORS.MULTIPLE_ACTIVE_SESSIONS;
      }
    } else if (error instanceof Error) {
      // Extract from standard Error object
      message = error.message;
      
      // Look for specific terms in the error message
      if (message.toLowerCase().includes('already logged in') || 
          message.toLowerCase().includes('another device') ||
          message.toLowerCase().includes('too many devices')) {
        loginStatus = LoginStatus.TOO_MANY_DEVICES;
        errorDetails = SESSION_ERRORS.MULTIPLE_ACTIVE_SESSIONS;
      } else if (message.toLowerCase().includes('new device')) {
        loginStatus = LoginStatus.NEW_DEVICE;
        errorDetails = SESSION_ERRORS.NEW_DEVICE;
      } else if (message.toLowerCase().includes('suspicious') || 
                 message.toLowerCase().includes('unusual location')) {
        loginStatus = LoginStatus.SUSPICIOUS_LOCATION;
        errorDetails = SESSION_ERRORS.SUSPICIOUS_LOCATION;
      } else if (message.toLowerCase().includes('verify') || 
                message.toLowerCase().includes('otp')) {
        loginStatus = LoginStatus.OTP_REQUIRED;
        errorDetails = SESSION_ERRORS.OTP_REQUIRED;
      }
    }
    
    return {
      errorDetails,
      loginStatus,
      message
    };
  } catch (parseError) {
    logger.error('[SessionUtils] Error parsing session error', parseError);
    return {
      errorDetails: null,
      message: 'An unexpected error occurred during session validation'
    };
  }
};

/**
 * Detect if an error is related to multiple active sessions
 */
export const isMultipleSessionsError = (error: any): boolean => {
  const { loginStatus } = parseSessionError(error);
  return loginStatus === LoginStatus.TOO_MANY_DEVICES;
};

/**
 * Get a user-friendly message for a session error
 */
export const getSessionErrorMessage = (error: any): string => {
  const { message, errorDetails } = parseSessionError(error);
  return errorDetails?.message || message;
};

/**
 * Get a suggested action for a session error
 */
export const getSessionErrorAction = (error: any): string => {
  const { errorDetails } = parseSessionError(error);
  return errorDetails?.action || 'Please try again or contact support if the problem persists.';
};
