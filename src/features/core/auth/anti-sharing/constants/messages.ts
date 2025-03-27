/**
 * Standard messages for anti-sharing error handling
 */

import { LoginStatus } from '../types';

/**
 * Standard validation messages for each login status
 */
export const LOGIN_VALIDATION_MESSAGES: Record<LoginStatus, string> = {
  [LoginStatus.OK]: 'Login successful. You will be redirected shortly.',
  [LoginStatus.NEW_DEVICE]: 'We have detected a login from a new device. For security purposes, please verify your identity.',
  [LoginStatus.SUSPICIOUS_LOCATION]: 'We have detected a login from a new location. For security purposes, please verify your identity.',
  [LoginStatus.TOO_MANY_DEVICES]: 'You are already logged in from another device. For security reasons, PharmacyHub only allows one active session at a time. Please log out from that device or click "Log Out Other Devices" to continue with this session.',
  [LoginStatus.OTP_REQUIRED]: 'For additional security, please enter the verification code sent to your email or mobile device.',
};

/**
 * Standard explanation texts for each login status
 */
export const LOGIN_VALIDATION_EXPLANATIONS: Record<LoginStatus, string | null> = {
  [LoginStatus.OK]: null,
  [LoginStatus.NEW_DEVICE]: 'We take security seriously and verify any new devices accessing your account.',
  [LoginStatus.SUSPICIOUS_LOCATION]: 'This additional verification helps protect your account from unauthorized access.',
  [LoginStatus.TOO_MANY_DEVICES]: 'Choosing "Log Out Other Devices" will immediately terminate all your other active sessions and allow you to continue with this session. If you did not attempt to log in from another device, please consider changing your password for added security.',
  [LoginStatus.OTP_REQUIRED]: 'This one-time password helps ensure that only you can access your account.',
};
