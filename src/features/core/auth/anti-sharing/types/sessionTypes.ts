/**
 * Types for the Anti-Sharing Protection feature
 */

/**
 * Enum for login validation status
 */
export enum LoginStatus {
  OK = 'OK',
  NEW_DEVICE = 'NEW_DEVICE',
  SUSPICIOUS_LOCATION = 'SUSPICIOUS_LOCATION',
  TOO_MANY_DEVICES = 'TOO_MANY_DEVICES',
  OTP_REQUIRED = 'OTP_REQUIRED',
}

/**
 * Interface for login validation result
 */
export interface LoginValidationResult {
  status: LoginStatus;
  message?: string;
  requiresOtp?: boolean;
  sessionId?: string;
}

/**
 * Interface for session data
 */
export interface SessionData {
  id: string;
  userId: string;
  deviceId: string;
  ipAddress: string;
  country?: string;
  userAgent: string;
  loginTime: string;
  active: boolean;
  lastActive?: string;
}

/**
 * Interface for session filter options
 */
export interface SessionFilterOptions {
  userId?: string;
  active?: boolean;
  fromDate?: string;
  toDate?: string;
  suspicious?: boolean;
}

/**
 * Interface for session action result
 */
export interface SessionActionResult {
  success: boolean;
  message?: string;
}
