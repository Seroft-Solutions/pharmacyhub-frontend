/**
 * Authentication API Endpoints
 * 
 * This module defines all API endpoints for authentication-related operations
 * using constants to prevent typos and make endpoint changes easier to manage.
 */

// Helper function to determine API paths based on environment variables
const getApiBasePath = (defaultPath: string): string => {
  // If a custom base path is defined in env variables, use it
  const customBasePath = process.env.NEXT_PUBLIC_API_PATH_PREFIX || '/api';
  
  // If the custom path already ends with a slash or is empty, don't add another one
  const prefix = customBasePath.endsWith('/') || customBasePath === '' 
    ? customBasePath.slice(0, -1)
    : customBasePath;
    
  // Remove leading slash from defaultPath if prefix is not empty
  const cleanPath = defaultPath.startsWith('/') ? defaultPath.slice(1) : defaultPath;
  
  return `${prefix}/${cleanPath}`;
};

// Base URLs for API endpoints
export const API_BASE_URLS = {
  AUTH: getApiBasePath('auth'),
  USERS: getApiBasePath('users'),
  SESSIONS: getApiBasePath('sessions')
};

/**
 * Authentication API Endpoints
 */
export const AUTH_ENDPOINTS = {
  // Auth operations
  LOGIN: `${API_BASE_URLS.AUTH}/login`,
  REGISTER: `${API_BASE_URLS.AUTH}/signup`,
  LOGOUT: `${API_BASE_URLS.AUTH}/logout`,
  REFRESH_TOKEN: `${API_BASE_URLS.AUTH}/token/refresh`,
  SOCIAL_LOGIN: `${API_BASE_URLS.AUTH}/social/callback`,
  VERIFY_EMAIL: `${API_BASE_URLS.AUTH}/verify`,
  VERIFY_EMAIL_STATUS: `${API_BASE_URLS.AUTH}/verify-email/status`,
  RESEND_VERIFICATION: `${API_BASE_URLS.AUTH}/resend-verification`,
  REQUEST_PASSWORD_RESET: `${API_BASE_URLS.AUTH}/password/reset-request`,
  RESET_PASSWORD: `${API_BASE_URLS.AUTH}/password/reset`,
  VALIDATE_RESET_TOKEN: `${API_BASE_URLS.AUTH}/password/validate-token`,
  VERIFY_OTP: `${API_BASE_URLS.AUTH}/verify-otp`,
  
  // Current user operations
  PROFILE: `${API_BASE_URLS.USERS}/me`,
  UPDATE_PROFILE: `${API_BASE_URLS.USERS}/me`,
  UPDATE_PREFERENCES: `${API_BASE_URLS.USERS}/me/preferences`,
  CHANGE_PASSWORD: `${API_BASE_URLS.USERS}/me/password`,
  
  // User CRUD operations
  USERS_LIST: `${API_BASE_URLS.USERS}`,
  USER_CREATE: `${API_BASE_URLS.USERS}`,
  USER_DETAIL: `${API_BASE_URLS.USERS}/:id`,
  USER_UPDATE: `${API_BASE_URLS.USERS}/:id`,
  USER_PATCH: `${API_BASE_URLS.USERS}/:id`,
  USER_DELETE: `${API_BASE_URLS.USERS}/:id`,
  
  // Session management endpoints
  VALIDATE_SESSION: `${API_BASE_URLS.SESSIONS}/validate`,
  USER_SESSIONS: `${API_BASE_URLS.SESSIONS}/users/:id`,
  TERMINATE_SESSION: `${API_BASE_URLS.SESSIONS}/:id`,
  TERMINATE_OTHER_SESSIONS: `${API_BASE_URLS.SESSIONS}/users/:id/terminate-others`,
  REQUIRE_OTP: `${API_BASE_URLS.SESSIONS}/users/:id/require-otp`,
  SESSION_MONITORING: `${API_BASE_URLS.SESSIONS}/monitoring`,
};

/**
 * Map for standard CRUD operations
 * Used with createApiHooks factory
 */
export const USER_ENDPOINTS_MAP = {
  list: AUTH_ENDPOINTS.USERS_LIST,
  detail: AUTH_ENDPOINTS.USER_DETAIL,
  create: AUTH_ENDPOINTS.USER_CREATE,
  update: AUTH_ENDPOINTS.USER_UPDATE,
  patch: AUTH_ENDPOINTS.USER_PATCH,
  delete: AUTH_ENDPOINTS.USER_DELETE
};

/**
 * Map for session management operations
 * Used with createApiHooks factory
 */
export const SESSION_ENDPOINTS_MAP = {
  list: AUTH_ENDPOINTS.SESSION_MONITORING,
  detail: AUTH_ENDPOINTS.USER_SESSIONS,
  validate: AUTH_ENDPOINTS.VALIDATE_SESSION,
  terminate: AUTH_ENDPOINTS.TERMINATE_SESSION,
  terminateOthers: AUTH_ENDPOINTS.TERMINATE_OTHER_SESSIONS,
  requireOtp: AUTH_ENDPOINTS.REQUIRE_OTP
};

export default AUTH_ENDPOINTS;
