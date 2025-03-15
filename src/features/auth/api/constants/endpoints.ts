/**
 * Authentication API Endpoints
 * 
 * This module defines all API endpoints for authentication-related operations.
 * Using constants prevents typos and makes endpoint changes easier to manage.
 */

// Updated to match the backend URL structure
const BASE_AUTH_URL = '/api/auth';
const BASE_USERS_URL = '/api/users';

export const AUTH_ENDPOINTS = {
  // Auth operations
  login: `${BASE_AUTH_URL}/login`,
  register: `${BASE_AUTH_URL}/signup`,  // Changed to match backend endpoint
  logout: `${BASE_AUTH_URL}/logout`,
  refreshToken: `${BASE_AUTH_URL}/token/refresh`,
  verifyEmail: `${BASE_AUTH_URL}/verify`,  // Changed to match backend endpoint
  verifyEmailStatus: `${BASE_AUTH_URL}/verify-email/status`,
  requestPasswordReset: `${BASE_AUTH_URL}/password/reset-request`,
  resetPassword: `${BASE_AUTH_URL}/password/reset`,
  validateResetToken: `${BASE_AUTH_URL}/password/validate-token`,
  
  // Current user operations
  profile: `${BASE_USERS_URL}/me`,
  updateProfile: `${BASE_USERS_URL}/me`,
  updatePreferences: `${BASE_USERS_URL}/me/preferences`,
  changePassword: `${BASE_USERS_URL}/me/password`,
  
  // User CRUD operations
  list: `${BASE_USERS_URL}`,
  create: `${BASE_USERS_URL}`,
  detail: (id: number | string) => `${BASE_USERS_URL}/${id}`,
  update: (id: number | string) => `${BASE_USERS_URL}/${id}`,
  patch: (id: number | string) => `${BASE_USERS_URL}/${id}`,
  delete: (id: number | string) => `${BASE_USERS_URL}/${id}`,
};

export default AUTH_ENDPOINTS;
