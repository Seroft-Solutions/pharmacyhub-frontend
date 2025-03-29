/**
 * Token Constants
 * 
 * Configuration and constants for token management.
 */
import { DEVICE_STORAGE_KEY } from '../../constants/device';

/**
 * Token configuration object defining storage keys
 */
export const TOKEN_CONFIG = {
  // Primary storage keys
  ACCESS_TOKEN_KEY: 'accessToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  TOKEN_EXPIRY_KEY: 'tokenExpiry',
  DEVICE_ID_KEY: DEVICE_STORAGE_KEY,
  
  // Legacy keys for backward compatibility
  LEGACY: {
    ACCESS_TOKEN: ['auth_token', 'access_token'],
    REFRESH_TOKEN: ['refresh_token'],
    TOKEN_EXPIRY: ['token_expiry']
  }
};
