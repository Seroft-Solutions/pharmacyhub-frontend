export const AUTH_CONFIG = {
  // Token configuration
  TOKEN: {
    REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes in milliseconds
    ACCESS_TOKEN_COOKIE: 'access_token',
    REFRESH_TOKEN_COOKIE: 'refresh_token',
    EXPIRES_COOKIE: 'token_expires'
  },

  // Cookie configuration
  COOKIE: {
    SECURE: process.env.NODE_ENV === 'production',
    SAME_SITE: 'strict' as const,
    HTTP_ONLY: true,
    PATH: '/'
  },

  // Route configuration
  ROUTES: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    DASHBOARD: '/dashboard',
    UNAUTHORIZED: '/unauthorized',
    AUTH_CALLBACK: '/auth/callback'
  },

  // API endpoints
  API: {
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    VALIDATE: '/api/v1/auth/validate',
    REGISTER: '/api/v1/auth/register',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    CHANGE_PASSWORD: '/api/v1/auth/change-password',
    VERIFY_EMAIL: '/api/v1/auth/verify-email',
    PROFILE: '/api/v1/users/profile'
  },

  // Error messages
  ERRORS: {
    LOGIN_FAILED: 'Failed to login',
    REFRESH_FAILED: 'Failed to refresh token',
    REGISTER_FAILED: 'Failed to register',
    FORGOT_PASSWORD_FAILED: 'Failed to process forgot password request',
    RESET_PASSWORD_FAILED: 'Failed to reset password',
    CHANGE_PASSWORD_FAILED: 'Failed to change password',
    VERIFY_EMAIL_FAILED: 'Failed to verify email',
    UNAUTHORIZED: 'You are not authorized to access this resource',
    SESSION_EXPIRED: 'Your session has expired, please login again'
  },

  // Password requirements
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true
  },

  // Session configuration
  SESSION: {
    MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
    REFRESH_INTERVAL: 60 * 1000, // 1 minute
    IDLE_TIMEOUT: 30 * 60 * 1000 // 30 minutes
  },

  // Protected routes that require authentication
  PROTECTED_ROUTES: [
    '/dashboard',
    '/admin',
    '/profile',
    '/inventory',
    '/orders'
  ],

  // Role-based route access
  ROLE_ROUTES: {
    '/admin': ['SUPER_ADMIN', 'ADMIN'],
    '/inventory/manage': ['ADMIN', 'MANAGER'],
    '/reports': ['ADMIN', 'MANAGER']
  }
} as const;

// Utility type for type-safe access to config values
export type AuthConfig = typeof AUTH_CONFIG;

// Export individual sections for convenience
export const {
  TOKEN,
  COOKIE,
  ROUTES,
  API,
  ERRORS,
  PASSWORD,
  SESSION,
  PROTECTED_ROUTES,
  ROLE_ROUTES
} = AUTH_CONFIG;