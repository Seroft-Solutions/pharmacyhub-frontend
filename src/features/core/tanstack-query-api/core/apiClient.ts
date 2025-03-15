/**
 * API Client Configuration
 * 
 * This module sets up the Axios instance used throughout the application,
 * with proper interceptors for authentication, error handling, etc.
 */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { tokenManager } from '@/features/core/auth/core/tokenManager';
import { logger } from '@/shared/lib/logger';
import { logApiRequest, logApiResponse, logApiError } from '../utils/debug';

// Debug flag
const DEBUG = process.env.NODE_ENV === 'development';

// Create a reusable axios instance with custom configuration
export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
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
    // Add timestamp for request timing
    config.__requestTime = Date.now();
    
    // Log request for debugging
    logApiRequest(config);
    
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
    // Log response for debugging
    logApiResponse(response);
    
    // Handle special response cases if needed
    return response;
  },
  async (error: AxiosError) => {
    // Add better logging for specific endpoint errors
    if (error.config?.url?.includes('/users/me') || error.config?.url?.includes('/me')) {
      logger.error('Profile request error:', { 
        url: error.config?.url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.config?.headers,
        message: error.message
      });
    }
    
    // Log error for debugging
    logApiError(error);
    
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
