/**
 * API service for session management
 */

import { LoginValidationResult, SessionActionResult, SessionData, SessionFilterOptions } from '../types';

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
    // Get the existing session ID from storage if available
    const sessionId = sessionStorage.getItem('sessionId');
    
    // Set up headers with session ID if available
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add session ID to headers if available
    if (sessionId) {
      headers['X-Session-ID'] = sessionId;
    }
    
    const response = await fetch(`${API_PATH}/validate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        userId,
        deviceId,
        ipAddress,
        userAgent,
      }),
    });

    if (!response.ok) {
      throw new Error('Login validation failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error validating login:', error);
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

    const response = await fetch(`${API_PATH}/users/${userId}?${queryParams.toString()}`);

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

    const response = await fetch(`${API_PATH}?${queryParams.toString()}`);

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
    const response = await fetch(`${API_PATH}/${sessionId}`, {
      method: 'DELETE',
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
    const response = await fetch(`${API_PATH}/users/${userId}/terminate-others`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentSessionId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to terminate other sessions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error terminating other sessions:', error);
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
    const response = await fetch(`${API_PATH}/users/${userId}/require-otp`, {
      method: 'POST',
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
