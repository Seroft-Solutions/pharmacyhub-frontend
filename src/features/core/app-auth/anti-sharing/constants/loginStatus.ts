/**
 * Constants for login validation
 */

export const LOGIN_VALIDATION_MESSAGES = {
  NEW_DEVICE: 'You are logging in from a new device. Please verify your identity.',
  SUSPICIOUS_LOCATION: 'Suspicious login detected from an unusual location. Please verify your identity.',
  TOO_MANY_DEVICES: 'You are already logged in on another device. Only one active session is allowed per account. Would you like to log out from other devices and continue?',
  OTP_REQUIRED: 'Please enter the verification code sent to your registered email or phone.',
};

export const SESSION_LIMITS = {
  MAX_ACTIVE_SESSIONS: 1, // Changed from 3 to 1 for single-session policy
  SESSION_EXPIRY_DAYS: 30,
};

export const DEVICE_STORAGE_KEY = 'pharmhub_device_id';
