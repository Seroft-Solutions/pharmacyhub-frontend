/**
 * Device Manager for Anti-Sharing Protection
 * 
 * Handles device ID generation, storage, and management
 */

import { DEVICE_STORAGE_KEY } from '../../constants/device';

/**
 * Generate a random UUIDv4
 * @returns {string} UUIDv4 string
 */
export const generateUUID = (): string => {
  // Implementation based on RFC4122 version 4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Get the device ID from localStorage, or generate and store a new one
 * @returns {string} Device ID
 */
export const getDeviceId = (): string => {
  if (typeof window === 'undefined') {
    return ''; // Server-side rendering, no localStorage
  }

  let deviceId = localStorage.getItem(DEVICE_STORAGE_KEY);
  
  // If no device ID exists, generate and store a new one
  if (!deviceId) {
    deviceId = generateUUID();
    localStorage.setItem(DEVICE_STORAGE_KEY, deviceId);
  }
  
  return deviceId;
};

/**
 * Get basic browser fingerprint information
 * @returns {object} Browser fingerprint information
 */
export const getBrowserFingerprint = (): Record<string, string> => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {}; // Server-side rendering
  }

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenWidth: window.screen.width.toString(),
    screenHeight: window.screen.height.toString(),
    colorDepth: window.screen.colorDepth.toString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
};

/**
 * Check if current device matches the given device ID
 * @param {string} deviceId Device ID to check
 * @returns {boolean} Whether the current device matches
 */
export const isCurrentDevice = (deviceId: string): boolean => {
  if (typeof window === 'undefined') {
    return false; // Server-side rendering
  }

  const currentDeviceId = localStorage.getItem(DEVICE_STORAGE_KEY);
  return currentDeviceId === deviceId;
};

/**
 * Clear the stored device ID
 */
export const clearDeviceId = (): void => {
  if (typeof window === 'undefined') {
    return; // Server-side rendering
  }

  localStorage.removeItem(DEVICE_STORAGE_KEY);
};
