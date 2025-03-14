/**
 * Auth API Feature
 * 
 * This module exports all auth-related API components, hooks, and types.
 */

// Export API endpoints
export { AUTH_ENDPOINTS } from './constants';

// Export API hooks
export {
  authApiHooks,
  useLogin,
  useRegister,
  useLogout,
  useRefreshToken,
  useUserProfile,
  useUpdateProfile,
  useRequestPasswordReset,
  useValidateResetToken,
  useCompletePasswordReset,
  useChangePassword,
  useUpdatePreferences,
  useEmailVerificationStatus,
  useVerifyEmail,
  userApiHooks
} from './hooks';

// Export types
export type {
  User,
  UserProfile,
  UserPreferences,
  UserUpdatePayload,
  LoginRequest,
  RegisterRequest,
  AuthTokens,
  AuthResponse,
  PasswordResetRequest,
  PasswordResetCompletion,
  PasswordChangeRequest
} from './types';
