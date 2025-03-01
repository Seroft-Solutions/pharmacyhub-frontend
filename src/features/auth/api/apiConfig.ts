/**
 * API configuration for authentication
 * 
 * Contains constants and config values used throughout
 * the auth feature.
 */

// Base URL for authentication requests
export const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || '/api/auth';

// Local storage key constants for auth tokens
export const TOKEN_CONFIG = {
  // Main token keys (preferred)
  ACCESS_TOKEN_KEY: 'accessToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  TOKEN_EXPIRY_KEY: 'tokenExpiry',
  
  // Legacy token keys (for compatibility)
  LEGACY_ACCESS_TOKEN_KEY: 'auth_token',
  LEGACY_ACCESS_TOKEN_KEY2: 'access_token',
  LEGACY_REFRESH_TOKEN_KEY: 'refresh_token',
  LEGACY_TOKEN_EXPIRY_KEY: 'token_expiry',
};

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  REFRESH_TOKEN: '/token/refresh',
  VERIFY_EMAIL: '/verify-email',
  REQUEST_PASSWORD_RESET: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VALIDATE_RESET_TOKEN: '/reset-password/validate',
  ME: '/me',
};

// Token configuration
export const TOKEN_SETTINGS = {
  // Refresh token 5 minutes before expiry
  REFRESH_THRESHOLD: 5 * 60 * 1000,
  
  // Default expiry time if not provided by API (8 hours)
  DEFAULT_EXPIRY: 8 * 60 * 60 * 1000,
  
  // Refresh token storage time (30 days)
  REFRESH_TOKEN_LIFETIME: 30 * 24 * 60 * 60 * 1000,
};
