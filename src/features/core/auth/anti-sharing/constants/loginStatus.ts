/**
 * Constants for login validation
 */

export const LOGIN_VALIDATION_MESSAGES = {
  NEW_DEVICE: 'You are logging in from a new device. Please verify your identity to continue.',
  SUSPICIOUS_LOCATION: 'We detected a login from a location that differs from your usual activity. This is a security measure to protect your account.',
  TOO_MANY_DEVICES: 'Your account is currently active on another device or browser. For security reasons, we only allow one active session at a time. You can either log out from that device or click "Log Out Other Devices" to continue here.',
  OTP_REQUIRED: 'For additional security, please enter the verification code we sent to your registered email address.',
};

export const SESSION_LIMITS = {
  MAX_ACTIVE_SESSIONS: 1, // Changed from 3 to 1 for single-session policy
  SESSION_EXPIRY_DAYS: 30,
};

export const DEVICE_STORAGE_KEY = 'pharmhub_device_id';
