/**
 * Authentication configuration constants
 * 
 * This file contains all authentication-related configuration values
 * to ensure consistency across the application.
 */
import { AUTH_ROUTES } from './routes';

// Authentication configuration
export const AUTH_CONFIG = {
  // Session configuration
  sessionStorage: 'localStorage', // 'localStorage' or 'sessionStorage'
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  
  // Token configuration
  tokenExpiration: 60 * 60 * 1000, // 1 hour in milliseconds
  refreshThreshold: 5 * 60 * 1000, // 5 minutes in milliseconds
  
  // Authentication behavior
  redirectWhenAuthenticated: '/dashboard',
  redirectWhenUnauthenticated: '/login',
  
  // API endpoints (linked to AUTH_ROUTES for consistency)
  apiEndpoints: {
    login: AUTH_ROUTES.LOGIN,
    register: AUTH_ROUTES.REGISTER,
    refreshToken: AUTH_ROUTES.REFRESH_TOKEN,
    forgotPassword: AUTH_ROUTES.REQUEST_PASSWORD_RESET,
    resetPassword: AUTH_ROUTES.RESET_PASSWORD,
    verifyEmail: AUTH_ROUTES.VERIFY_EMAIL,
    logout: AUTH_ROUTES.LOGOUT,
    profile: AUTH_ROUTES.PROFILE,
  },
};

// Password validation configuration
export const PASSWORD_CONFIG = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxLength: 128,
};

// Export default configuration object
export default {
  AUTH_CONFIG,
  PASSWORD_CONFIG,
};
