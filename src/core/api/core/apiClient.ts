/**
 * API Client Configuration
 * 
 * This module sets up the Axios instance used throughout the application,
 * with proper interceptors for authentication, error handling, etc.
 */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { 
  requestInterceptor, 
  requestErrorInterceptor 
} from './interceptors/requestInterceptor';
import { 
  responseSuccessInterceptor, 
  responseErrorInterceptor 
} from './interceptors/responseInterceptor';
import { replaceUrlParams } from './utils/urlUtils';
import { ApiError } from './error/errorHandler';

// Export URL utility
export { replaceUrlParams };

/**
 * API Response interface for Spring Boot backend response format
 */
export interface ApiResponse<T> {
  status: number;
  message?: string;
  data: T;
  timestamp?: string;
  success?: boolean;
  error?: string;
  metadata?: any;
}

/**
 * Retry configuration for API requests
 */
export interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  statusCodesToRetry: number[];
}

/**
 * API Client configuration options
 */
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  retryConfig?: RetryConfig;
}

/**
 * Request options for API calls
 */
export interface RequestOptions {
  requiresAuth?: boolean;
  deduplicate?: boolean;
  timeout?: number;
  headers?: Record<string, string>;
  [key: string]: any;
}

/**
 * Creates and configures an axios instance for API communication
 * 
 * @param config API client configuration options
 * @returns Configured axios instance
 */
export function createApiClient(config: ApiClientConfig): AxiosInstance {
  // Create axios instance with default configuration
  const client = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || 30000, // 30 seconds default
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...config.headers
    }
  });

  // Apply request interceptor
  client.interceptors.request.use(
    requestInterceptor,
    requestErrorInterceptor
  );

  // Apply response interceptor
  client.interceptors.response.use(
    responseSuccessInterceptor,
    responseErrorInterceptor(client)
  );

  return client;
}

/**
 * Default API client instance
 */
export const apiClient: AxiosInstance = createApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  timeout: 30000 // 30 seconds
});

export default apiClient;
