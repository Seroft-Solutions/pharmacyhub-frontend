/**
 * Configuration for API client
 */
export interface ApiClientConfig {
  baseURL: string;
  defaultHeaders?: Record<string, string>;
  onUnauthorized?: () => Promise<void>;
}

/**
 * Enhanced API error with additional data
 */
export interface ApiError extends Error {
  status?: number;
  data?: any;
}

/**
 * API response structure
 */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

/**
 * Enhanced retry configuration
 */
export interface RetryConfig {
  attempts: number;
  delay: number;
  statusCodes: number[];
}

/**
 * Options for API requests
 */
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  requiresAuth?: boolean;
  autoRefreshToken?: boolean;
  deduplicate?: boolean;
  retry?: RetryConfig;
  body?: any;
}

/**
 * Interface for token management
 */
export interface TokenManager {
  getToken(): string | null;
  setToken(token: string): void;
  removeToken(): void;
  refreshToken(): Promise<string | null>;
  hasToken(): boolean;
}

/**
 * Interface for API service
 */
export interface ApiService {
  get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
  put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
  patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
  delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>>;
}
