/**
 * Constants for login validation
 */

export const LOGIN_VALIDATION_MESSAGES = {
  NEW_DEVICE: 'You are logging in from a new device. Please verify your identity.',
  SUSPICIOUS_LOCATION: 'Suspicious login detected from an unusual location. Please verify your identity.',
  TOO_MANY_DEVICES: 'You have reached the maximum number of active devices. Please log out from another device or contact support.',
  OTP_REQUIRED: 'Please enter the verification code sent to your registered email or phone.',
};

export const SESSION_LIMITS = {
  MAX_ACTIVE_SESSIONS: 3,
  SESSION_EXPIRY_DAYS: 30,
};

export const DEVICE_STORAGE_KEY = 'pharmhub_device_id';
