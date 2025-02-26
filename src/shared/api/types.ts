/**
 * Core API types for the application
 */

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
}

export interface ApiError extends Error {
  status?: number;
  code?: string;
}

export interface RequestOptions extends Omit<RequestInit, 'credentials'> {
  requiresAuth?: boolean;
  autoRefreshToken?: boolean;
  credentials?: RequestCredentials;
}

export interface ApiClientConfig {
  baseURL: string;
  defaultHeaders?: Record<string, string>;
  onUnauthorized?: () => Promise<void>;
  logger?: ApiLogger;
}

export interface ApiLogger {
  info: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
  debug?: (message: string, meta?: Record<string, unknown>) => void;
}

export interface TokenManager {
  getToken: () => string | null;
  setToken: (token: string) => void;
  removeToken: () => void;
  refreshToken?: () => Promise<string | null>;
}