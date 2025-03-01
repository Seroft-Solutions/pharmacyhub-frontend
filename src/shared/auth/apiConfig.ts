/**
 * Authentication API Configuration
 * 
 * This file centralizes all authentication-related configuration settings.
 * It's used throughout the auth module to ensure consistency.
 */

// API Service Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  TIMEOUT: 15000, // 15 seconds timeout
  RETRY_ATTEMPTS: 3,
  AUTH_HEADER_PREFIX: 'Bearer',
};

// Authentication Token Configuration
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: 'pharmacyhub_access_token',
  REFRESH_TOKEN_KEY: 'pharmacyhub_refresh_token',
  TOKEN_EXPIRY_KEY: 'pharmacyhub_token_expiry',
  USER_PROFILE_KEY: 'pharmacyhub_user_profile',
  USER_DATA_KEY: 'pharmacyhub_user_data',
  REFRESH_GRACE_PERIOD: 60, // seconds before expiry to attempt refresh
};

// Authentication Routes
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  CALLBACK: '/auth/callback',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
};

// Authentication API Endpoints - Direct backend calls
export const AUTH_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  VERIFY_EMAIL: '/api/auth/verify',
  USER_PROFILE: '/api/v1/users/profile',
  HEALTH: '/api/health',
};

// Session Configuration
export const SESSION_CONFIG = {
  MAX_AGE: 24 * 60 * 60, // 24 hours
  SECURE: process.env.NODE_ENV === 'production',
  SAME_SITE: 'lax' as const,
};

// User Types mapping (based on your UserType enum)
export const USER_TYPES = {
  PHARMACIST: 'PHARMACIST',
  PHARMACY_MANAGER: 'PHARMACY_MANAGER',
  PROPRIETOR: 'PROPRIETOR',
  SALESMAN: 'SALESMAN',
  ADMIN: 'ADMIN',
  USER: 'USER',
};
