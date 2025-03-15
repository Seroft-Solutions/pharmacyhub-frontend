/**
 * API Client Configuration
 * 
 * This module sets up the Axios instance used throughout the application,
 * with proper interceptors for authentication, error handling, etc.
 */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { tokenManager } from '@/features/core/auth/core/tokenManager';
import { logger } from '@/shared/lib/logger';

// Debug flag
const DEBUG = process.env.NODE_ENV === 'development';

// Create a reusable axios instance with custom configuration
export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Replace parameters in URL path
export const replaceUrlParams = (url: string, params: Record<string, any>): string => {
  let processedUrl = url;
  
  // Replace path parameters (e.g., :id, :userId)
  Object.keys(params).forEach(key => {
    const paramValue = params[key]?.toString() || '';
    processedUrl = processedUrl.replace(`:${key}`, encodeURIComponent(paramValue));
  });
  
  return processedUrl;
};

// Request interceptor for handling auth tokens
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (DEBUG) {
      logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data
      });
    }
    
    // Add auth token if available
    const token = tokenManager.getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }
    
    return config;
  },
  (error: AxiosError) => {
    if (DEBUG) {
      logger.error('API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for handling common response cases
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (DEBUG) {
      logger.debug(`API Response: ${response.status} ${response.config.url}`, {
        headers: response.headers,
        data: response.data
      });
    }
    
    // Handle special response cases if needed
    return response;
  },
  async (error: AxiosError) => {
    if (DEBUG) {
      logger.error('API Response Error:', error.response);
    }
    
    // Handle token refresh and retry original request
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/token/refresh')) {
      try {
        // Try to refresh token
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          // Clear original auth header (will be re-added by interceptor)
          if (error.config?.headers) {
            delete error.config.headers.Authorization;
          }
          
          // Get a new token using the refresh token
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/token/refresh`,
            { refreshToken }
          );
          
          if (response.data?.accessToken) {
            // Store the new token
            tokenManager.setToken(response.data.accessToken);
            
            // Retry the original request
            return apiClient(error.config as AxiosRequestConfig);
          }
        }
      } catch (refreshError) {
        logger.error('Token refresh failed', refreshError);
        // Clear tokens on refresh failure
        tokenManager.removeToken();
        tokenManager.removeRefreshToken();
      }
    }
    
    // Enhance error with more details
    if (error.response?.data) {
      const originalError = error;
      const enhancedError = new Error(
        error.response.data.message || error.response.data.error || error.message
      ) as any;
      enhancedError.status = error.response.status;
      enhancedError.data = error.response.data;
      enhancedError.originalError = originalError;
      return Promise.reject(enhancedError);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
