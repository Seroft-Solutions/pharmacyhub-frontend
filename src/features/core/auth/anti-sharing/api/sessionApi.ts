/**
 * API service for session management
 */

import { LoginValidationResult, SessionActionResult, SessionData, SessionFilterOptions } from '../types';
import { tokenManager } from '@/features/core/auth/core/tokenManager';
import { logger } from '@/shared/lib/logger';
import { apiClient } from '@/features/core/tanstack-query-api';
import { parseSessionError } from './sessionUtils';

// Base API path for session endpoints
const API_PATH = '/api/v1/sessions';

/**
 * Validate login attempt and check for suspicious activity
 * @param userId User ID
 * @param deviceId Device ID
 * @param ipAddress IP address (optional, will be detected server-side if not provided)
 * @param userAgent User agent string
 * @returns Login validation result
 */
export const validateLogin = async (
  userId: string,
  deviceId: string,
  userAgent: string,
  ipAddress?: string,
): Promise<LoginValidationResult> => {
  try {
    console.log('[Anti-Sharing] Validating login attempt:', {
      userId, 
      deviceId,
      hasIpAddress: !!ipAddress
    });
    
    // Get auth token and session ID
    const accessToken = localStorage.getItem('accessToken');
    const sessionId = tokenManager.getSessionId();
    
    logger.debug('[Anti-Sharing] Preparing API request headers', {
      hasAccessToken: !!accessToken,
      hasSessionId: !!sessionId
    });
    
    const response = await fetch(`${API_PATH}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken ? `Bearer ${accessToken}` : '',
        ...(sessionId ? { 'X-Session-ID': sessionId } : {})
      },
      body: JSON.stringify({
        userId,
        deviceId,
        ipAddress,
        userAgent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Anti-Sharing] Validation failed with status ${response.status}:`, errorText);
      
      // Try to parse as JSON first
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        // Not JSON, use as text
      }
      
      const error = new Error(`Login validation failed: ${response.status} ${response.statusText}`);
      // @ts-ignore - add response data for error parsing
      error.response = { status: response.status, data: errorData || errorText };
      throw error;
    }

    const result = await response.json();
    console.log('[Anti-Sharing] Validation result:', result);
    return result;
  } catch (error) {
    console.error('[Anti-Sharing] Error validating login:', error);
    
    // Enhanced error handling with session utils
    const { loginStatus, message } = parseSessionError(error);
    
    // Attach login status to the error if detected
    if (loginStatus) {
      // @ts-ignore - add status for better error handling
      error.loginStatus = loginStatus;
      // @ts-ignore - add user-friendly message
      error.userMessage = message;
    }
    
    throw error;
  }
};

/**
 * Get all sessions for a user
 * @param userId User ID
 * @param options Filter options
 * @returns Array of session data
 */
export const getUserSessions = async (
  userId: string,
  options?: SessionFilterOptions,
): Promise<SessionData[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (options) {
      if (options.active !== undefined) {
        queryParams.append('active', options.active.toString());
      }
      if (options.fromDate) {
        queryParams.append('fromDate', options.fromDate);
      }
      if (options.toDate) {
        queryParams.append('toDate', options.toDate);
      }
      if (options.suspicious) {
        queryParams.append('suspicious', 'true');
      }
    }

    // Get auth token and session ID
    const accessToken = localStorage.getItem('accessToken');
    const sessionId = tokenManager.getSessionId();
    
    const response = await fetch(`${API_PATH}/users/${userId}?${queryParams.toString()}`, {
      headers: {
        'Authorization': accessToken ? `Bearer ${accessToken}` : '',
        ...(sessionId ? { 'X-Session-ID': sessionId } : {})
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user sessions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    throw error;
  }
};

/**
 * Get all sessions (admin only)
 * @param options Filter options
 * @returns Array of session data
 */
export const getAllSessions = async (options?: SessionFilterOptions): Promise<SessionData[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (options) {
      if (options.userId) {
        queryParams.append('userId', options.userId);
      }
      if (options.active !== undefined) {
        queryParams.append('active', options.active.toString());
      }
      if (options.fromDate) {
        queryParams.append('fromDate', options.fromDate);
      }
      if (options.toDate) {
        queryParams.append('toDate', options.toDate);
      }
      if (options.suspicious) {
        queryParams.append('suspicious', 'true');
      }
    }

    // Get auth token and session ID
    const accessToken = localStorage.getItem('accessToken');
    const sessionId = tokenManager.getSessionId();
    
    const response = await fetch(`${API_PATH}?${queryParams.toString()}`, {
      headers: {
        'Authorization': accessToken ? `Bearer ${accessToken}` : '',
        ...(sessionId ? { 'X-Session-ID': sessionId } : {})
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
};

/**
 * Terminate a session
 * @param sessionId Session ID
 * @returns Session action result
 */
export const terminateSession = async (sessionId: string): Promise<SessionActionResult> => {
  try {
    // Get auth token and session ID
    const accessToken = localStorage.getItem('accessToken');
    const currentSessionId = tokenManager.getSessionId();
    
    const response = await fetch(`${API_PATH}/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': accessToken ? `Bearer ${accessToken}` : '',
        ...(currentSessionId ? { 'X-Session-ID': currentSessionId } : {})
      }
    });

    if (!response.ok) {
      throw new Error('Failed to terminate session');
    }

    return await response.json();
  } catch (error) {
    console.error('Error terminating session:', error);
    throw error;
  }
};

/**
 * Terminate all sessions for a user except the current one
 * @param userId User ID
 * @param currentSessionId Current session ID to keep active
 * @returns Session action result
 */
export const terminateOtherSessions = async (
  userId: string,
  currentSessionId: string,
): Promise<SessionActionResult> => {
  try {
    // Get auth token
    const accessToken = tokenManager.getToken();
    
    // Log the request details for debugging
    logger.debug('[Anti-Sharing] Terminating other sessions', {
      userId,
      currentSessionId,
      hasAccessToken: !!accessToken,
      endpoint: `${API_PATH}/users/${userId}/terminate-others`
    });
    
    const response = await fetch(`${API_PATH}/users/${userId}/terminate-others`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': accessToken ? `Bearer ${accessToken}` : '',
        'X-Session-ID': currentSessionId // Always include the current session ID here
      },
      body: JSON.stringify({
        currentSessionId,
      }),
    });

    // Log response status for debugging
    logger.debug('[Anti-Sharing] Terminate sessions response', {
      status: response.status,
      ok: response.ok
    });

    if (!response.ok) {
      // Get error details if available
      let errorMessage = 'Failed to terminate other sessions';
      let errorObj;
      try {
        errorObj = await response.json();
        errorMessage = errorObj.message || errorObj.error || errorMessage;
      } catch (e) {
        // Ignore JSON parsing errors
      }
      
      const error = new Error(errorMessage);
      // @ts-ignore - add response data for error parsing
      error.response = { status: response.status, data: errorObj };
      throw error;
    }

    const result = await response.json();
    logger.debug('[Anti-Sharing] Terminate sessions result', result);
    return result;
  } catch (error) {
    logger.error('[Anti-Sharing] Error terminating other sessions:', error);
    throw error;
  }
};

/**
 * Require OTP verification for a user's next login
 * @param userId User ID
 * @returns Session action result
 */
export const requireOtpVerification = async (userId: string): Promise<SessionActionResult> => {
  try {
    // Get auth token and session ID
    const accessToken = localStorage.getItem('accessToken');
    const sessionId = tokenManager.getSessionId();
    
    const response = await fetch(`${API_PATH}/users/${userId}/require-otp`, {
      method: 'POST',
      headers: {
        'Authorization': accessToken ? `Bearer ${accessToken}` : '',
        ...(sessionId ? { 'X-Session-ID': sessionId } : {})
      }
    });

    if (!response.ok) {
      throw new Error('Failed to require OTP verification');
    }

    return await response.json();
  } catch (error) {
    console.error('Error requiring OTP verification:', error);
    throw error;
  }
};
