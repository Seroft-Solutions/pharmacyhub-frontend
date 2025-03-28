/**
 * Auth API Hooks
 * 
 * This module exports all hooks for authentication-related operations.
 */
export {
  // Export all hooks
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
  
  // Export user CRUD hooks
  userApiHooks
} from './useAuthApi';
