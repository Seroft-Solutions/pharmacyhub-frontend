/**
 * Auth Feature Flags
 * 
 * Defines feature flags for the auth feature with clear, easy-to-configure settings.
 */

/**
 * Feature flags for authentication and user management
 */
export enum AuthFeatureFlag {
  // Authentication methods
  MULTI_FACTOR_AUTH = 'auth:multi-factor',
  SOCIAL_LOGIN = 'auth:social-login',
  
  // Security features
  PASSWORD_POLICIES = 'auth:password-policies',
  SESSION_MANAGEMENT = 'auth:session-management',
  ACCOUNT_VERIFICATION = 'auth:account-verification',
  ACCOUNT_LOCKING = 'auth:account-locking',
  
  // User management
  USER_INVITATIONS = 'auth:user-invitations',
  SELF_REGISTRATION = 'auth:self-registration'
}

/**
 * Default values for all feature flags
 * Each flag has a separate, clearly named constant for easier configuration
 */

// Basic authentication features
export const FEATURE_MULTI_FACTOR_AUTH_ENABLED = true;
export const FEATURE_SOCIAL_LOGIN_ENABLED = true;

// Security features
export const FEATURE_PASSWORD_POLICIES_ENABLED = true;
export const FEATURE_SESSION_MANAGEMENT_ENABLED = true;
export const FEATURE_ACCOUNT_VERIFICATION_ENABLED = true;
export const FEATURE_ACCOUNT_LOCKING_ENABLED = true;

// User management features
export const FEATURE_USER_INVITATIONS_ENABLED = true;
export const FEATURE_SELF_REGISTRATION_ENABLED = true;

/**
 * Feature flag metadata with names, descriptions, and default settings
 */
export const AUTH_FEATURE_FLAGS = {
  [AuthFeatureFlag.MULTI_FACTOR_AUTH]: {
    name: 'Multi-Factor Authentication',
    description: 'Enables additional security verification using SMS or authenticator apps',
    defaultEnabled: FEATURE_MULTI_FACTOR_AUTH_ENABLED
  },
  [AuthFeatureFlag.SOCIAL_LOGIN]: {
    name: 'Social Login',
    description: 'Allow users to log in using social media accounts',
    defaultEnabled: FEATURE_SOCIAL_LOGIN_ENABLED
  },
  [AuthFeatureFlag.PASSWORD_POLICIES]: {
    name: 'Password Policies',
    description: 'Enforce strong password requirements and periodic password changes',
    defaultEnabled: FEATURE_PASSWORD_POLICIES_ENABLED
  },
  [AuthFeatureFlag.SESSION_MANAGEMENT]: {
    name: 'Session Management',
    description: 'Allow users to view and manage their active sessions',
    defaultEnabled: FEATURE_SESSION_MANAGEMENT_ENABLED
  },
  [AuthFeatureFlag.ACCOUNT_VERIFICATION]: {
    name: 'Account Verification',
    description: 'Require email verification for new accounts',
    defaultEnabled: FEATURE_ACCOUNT_VERIFICATION_ENABLED
  },
  [AuthFeatureFlag.ACCOUNT_LOCKING]: {
    name: 'Account Locking',
    description: 'Automatically lock accounts after multiple failed login attempts',
    defaultEnabled: FEATURE_ACCOUNT_LOCKING_ENABLED
  },
  [AuthFeatureFlag.USER_INVITATIONS]: {
    name: 'User Invitations',
    description: 'Allow administrators to invite new users by email',
    defaultEnabled: FEATURE_USER_INVITATIONS_ENABLED
  },
  [AuthFeatureFlag.SELF_REGISTRATION]: {
    name: 'Self Registration',
    description: 'Allow users to register accounts themselves',
    defaultEnabled: FEATURE_SELF_REGISTRATION_ENABLED
  }
};
