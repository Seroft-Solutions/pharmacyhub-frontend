/**
 * Authentication configuration constants
 * 
 * This file contains all authentication-related configuration values
 * to ensure consistency across the application.
 */
import { AUTH_ROUTES } from './routes';

// Development mode configuration
export const DEV_CONFIG = {
  // Set to true to bypass authentication in development mode
  bypassAuth: true
};

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
    verifyEmail: AUTH_ROUTES.VERIFY_EMAIL
  }
};

// Password validation and recovery configuration
export const PASSWORD_CONFIG = {
  // Password requirements
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
  
  // Password reset functionality
  resetTokenExpiration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  maxResetAttempts: 3,
  
  // Additional validation
  preventPreviousPasswords: 3, // Prevent reuse of last 3 passwords
  
  // User-facing messages
  messages: {
    tooShort: `Password must be at least 8 characters long`,
    missingUppercase: `Password must contain at least one uppercase letter`,
    missingLowercase: `Password must contain at least one lowercase letter`,
    missingNumber: `Password must contain at least one number`,
    missingSpecialChar: `Password must contain at least one special character`,
    mismatch: `Passwords do not match`,
    resetTokenExpired: `Password reset link has expired`
  }
};
