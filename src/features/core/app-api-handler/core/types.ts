/**
 * Core API types for standardized request and response handling
 */

/**
 * Standard API error format
 */
export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, any>;
}

/**
 * Standard API response format
 * All responses from the API should follow this structure
 */
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

/**
 * Options for API requests
 */
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  requiresAuth?: boolean;
  autoRefreshToken?: boolean;
  deduplicate?: boolean;
  timeout?: number;
  body?: any;
}

/**
 * Pagination parameters for paginated requests
 */
export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

/**
 * Pagination metadata for paginated responses
 */
export interface PaginationMetadata {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Configuration for the API client
 */
export interface ApiClientConfig {
  baseURL: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
  onUnauthorized?: () => Promise<void>;
  tokenConfig?: {
    accessTokenKey?: string;
    refreshTokenKey?: string;
    expiryKey?: string;
  };
}

/**
 * Basic interface for entities that have an ID property
 */
export interface Entity {
  id: string | number;
}
