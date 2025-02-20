/**
 * Authentication API Configuration
 * 
 * This file centralizes all authentication-related configuration settings.
 * It's used throughout the auth module to ensure consistency.
 */

/**
 * Get Keycloak base URL based on environment
 */
function getKeycloakBaseUrl(): string {
  if (typeof window === 'undefined') {
    // Server-side rendering - use environment variable or default
    return process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL || 'http://localhost:8080';
  }
  
  // Client-side - determine dynamically based on current URL
  const isLocalDev = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
                     
  if (isLocalDev) {
    // In local development, use the environment variable if available, otherwise use localhost:8080
    return process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL || 'http://localhost:8080';
  } else {
    // In production, derive from current origin by replacing port if in the same domain
    // This assumes Keycloak and the app are hosted in the same domain with different ports
    const productionUrl = window.location.origin.replace(/:\d+$/, ':8080');
    return productionUrl;
  }
}

// Keycloak Configuration
export const KEYCLOAK_CONFIG = {
  BASE_URL: getKeycloakBaseUrl(),
  REALM: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'pharmacyhub',
  CLIENT_ID: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'pharmacyhub-client',
  CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET || 'your-client-secret',
  // Master realm admin credentials
  ADMIN_USERNAME: process.env.KEYCLOAK_ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin123',
  // Realm-specific admin credentials
  REALM_ADMIN_USERNAME: 'admin',
  REALM_ADMIN_PASSWORD: 'admin123',
};

// API Service Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api',
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
  REFRESH_GRACE_PERIOD: 60, // seconds before expiry to attempt refresh
};

// Keycloak Endpoints
export const KEYCLOAK_ENDPOINTS = {
  TOKEN: `${KEYCLOAK_CONFIG.BASE_URL}/realms/${KEYCLOAK_CONFIG.REALM}/protocol/openid-connect/token`,
  AUTH: `${KEYCLOAK_CONFIG.BASE_URL}/realms/${KEYCLOAK_CONFIG.REALM}/protocol/openid-connect/auth`,
  LOGOUT: `${KEYCLOAK_CONFIG.BASE_URL}/realms/${KEYCLOAK_CONFIG.REALM}/protocol/openid-connect/logout`,
  USER_INFO: `${KEYCLOAK_CONFIG.BASE_URL}/realms/${KEYCLOAK_CONFIG.REALM}/protocol/openid-connect/userinfo`,
  ADMIN_USERS: `${KEYCLOAK_CONFIG.BASE_URL}/admin/realms/${KEYCLOAK_CONFIG.REALM}/users`,
  ADMIN_GROUPS: `${KEYCLOAK_CONFIG.BASE_URL}/admin/realms/${KEYCLOAK_CONFIG.REALM}/groups`,
  ADMIN_ROLES: `${KEYCLOAK_CONFIG.BASE_URL}/admin/realms/${KEYCLOAK_CONFIG.REALM}/roles`,
  REGISTRATION: `${KEYCLOAK_CONFIG.BASE_URL}/realms/${KEYCLOAK_CONFIG.REALM}/protocol/openid-connect/registrations`,
};

// Authentication Routes
export const AUTH_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',
  CALLBACK: '/api/auth/callback',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
};

// Session Configuration
export const SESSION_CONFIG = {
  COOKIE_NAME: 'pharmacyhub_session',
  MAX_AGE: 24 * 60 * 60, // 24 hours
  SECURE: process.env.NODE_ENV === 'production',
  SAME_SITE: 'lax' as const,
};

// Social Login Providers
export const SOCIAL_PROVIDERS = {
  GOOGLE: 'google',
  MICROSOFT: 'azure',
};
