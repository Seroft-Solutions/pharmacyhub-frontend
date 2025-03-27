/**
 * Enhanced Token Manager with device ID support
 * 
 * This extends the existing token manager with device ID functionality
 * for the anti-sharing protection feature
 */

import { getDeviceId } from '../anti-sharing/core/deviceManager';
import { DEVICE_STORAGE_KEY } from '../anti-sharing/constants';

// Constants for token management
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Get access token from localStorage
 */
export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null; // Server-side rendering
  }
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null; // Server-side rendering
  }
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Store tokens in localStorage
 */
export const storeTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }
  
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  
  // Ensure device ID is set when storing tokens
  ensureDeviceId();
};

/**
 * Clear tokens from localStorage
 */
export const clearTokens = (): void => {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }
  
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  
  // Note: We don't clear the device ID on logout
  // This allows us to track the same device across sessions
};

/**
 * Check if we have valid tokens
 */
export const hasValidTokens = (): boolean => {
  return !!getAccessToken() && !!getRefreshToken();
};

/**
 * Ensure device ID is set in localStorage
 */
export const ensureDeviceId = (): string => {
  if (typeof window === 'undefined') {
    return ''; // Server-side rendering
  }
  
  let deviceId = localStorage.getItem(DEVICE_STORAGE_KEY);
  
  if (!deviceId) {
    deviceId = getDeviceId();
  }
  
  return deviceId;
};

/**
 * Get auth-related data including tokens and device ID
 */
export const getAuthData = () => {
  return {
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
    deviceId: ensureDeviceId(),
  };
};
