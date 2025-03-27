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

// API Response interface for Spring Boot backend response format
export interface ApiResponse<T> {
  status: number;
  message?: string;
  data: T;
  timestamp?: string;
  success?: boolean;
  error?: string;
  metadata?: any;
}

// API Error interface
export interface ApiError extends Error {
  status?: number;
  data?: any;
  originalError?: any;
}

// Create a reusable axios instance with custom configuration
export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Replace parameters in URL path - Fixed to handle various URL types properly
export const replaceUrlParams = (url: string | undefined, params: Record<string, any>): string => {
  // Check if url is valid and convert to string if needed
  if (url === undefined || url === null) {
    console.error('Invalid URL provided to replaceUrlParams: undefined or null');
    return '';
  }
  
  // Ensure url is a string
  const urlString = String(url);
  
  // Check if params is valid
  if (!params || typeof params !== 'object') {
    return urlString;
  }
  
  let processedUrl = urlString;
  
  // Replace path parameters (e.g., :id, :userId)
  Object.keys(params).forEach(key => {
    if (!key) return;
    
    // For ID parameters, ensure proper format for Java Long ID
    const isIdParam = key.toLowerCase().includes('id');
    let paramValue = '';
    
    if (params[key] != null) {
      if (isIdParam) {
        // For ID params, parse to int and back to string to ensure proper Long format
        try {
          paramValue = String(parseInt(params[key].toString()));
        } catch (e) {
          console.error(`Error converting ${key} to Long ID format:`, e);
          paramValue = params[key].toString();
        }
      } else {
        paramValue = params[key].toString();
      }
    }
    
    try {
      processedUrl = processedUrl.replace(
        new RegExp(`:${key}`, 'g'), 
        encodeURIComponent(paramValue)
      );
    } catch (e) {
      console.error(`Error replacing parameter ${key} in URL:`, e);
    }
  });
  
  return processedUrl;
};

// Safe URL includes helper - Fixed to handle various URL types properly
export const safeUrlIncludes = (url: any, searchString: string): boolean => {
  if (!url) return false;
  
  // Convert to string if needed
  const urlString = typeof url === 'string' ? url : String(url);
  return urlString.includes(searchString);
};

// Request interceptor for handling auth tokens
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Add timestamp for request timing
    config.__requestTime = Date.now();
    
    // Log request for debugging
    logApiRequest(config);
    
    // Debug URL format for relativeURL issues - Fixed to use safe includes
    if (DEBUG && config.url) {
      logger.debug('API Request URL analysis:', {
        url: config.url,
        urlType: typeof config.url,
        hasColon: safeUrlIncludes(config.url, ':'),
        segments: String(config.url).split('/'),
        params: config.params
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
    
    // Add session ID if available
    const sessionId = sessionStorage.getItem('sessionId');
    if (sessionId) {
      logger.debug('Adding session ID to request:', sessionId);
      config.headers = {
        ...config.headers,
        'X-Session-ID': sessionId
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
    
    // Fixed: Use safeUrlIncludes instead of direct includes
    const isUserMeEndpoint = safeUrlIncludes(response.config?.url, '/users/me') || 
                             safeUrlIncludes(response.config?.url, '/me');
    
    // For /me endpoint, log the complete response
    if (isUserMeEndpoint) {
      logger.debug('Me endpoint response:', {
        url: response.config.url,
        status: response.status,
        responseStructure: response.data ? Object.keys(response.data) : null,
        hasMetadata: response.data?.metadata !== undefined,
        metadata: response.data?.metadata,
        data: response.data?.data
      });
    }
    
    // Handle special response cases if needed
    // The backend wraps responses in ApiResponse<T> format
    // We need to preserve the metadata when unwrapping
    if (response.data && 
        (response.data.hasOwnProperty('status') || response.data.hasOwnProperty('success')) && 
        response.data.hasOwnProperty('data')) {
      
      // Check if this response has metadata we need to preserve
      const hasMetadata = response.data.hasOwnProperty('metadata');
      
      // Extract metadata if it exists
      const metadata = hasMetadata ? response.data.metadata : undefined;
      
      // For the /me endpoint, we want to modify the response to include roles from metadata
      if (isUserMeEndpoint && metadata && metadata.userType) {
        logger.debug('Processing /me endpoint with metadata:', {
          metadata,
          userType: metadata.userType,
          currentData: response.data.data
        });
        
        // Ensure data has a roles array
        if (!response.data.data.roles) {
          response.data.data.roles = [];
        }
        
        // Add ADMIN role if userType is ADMIN and it's not already in roles
        if (metadata.userType === 'ADMIN' && !response.data.data.roles.includes('ADMIN')) {
          logger.debug('Adding ADMIN role from metadata');
          response.data.data.roles.push('ADMIN');
        }
        
        // Add userType to the data object
        response.data.data.userType = metadata.userType;
      }
      
      // Now extract the data while preserving metadata
      const unwrappedData = response.data.data;
      
      // Create a modified data object with metadata attached
      if (hasMetadata) {
        // If unwrappedData is an object, attach metadata to it
        if (unwrappedData && typeof unwrappedData === 'object' && !Array.isArray(unwrappedData)) {
          response.data = {
            ...unwrappedData,
            __metadata: metadata
          };
        } else {
          // For non-objects like arrays or primitives, we can't attach directly
          // Instead, return a special wrapper object
          response.data = {
            data: unwrappedData,
            __metadata: metadata
          };
        }
      } else {
        // No metadata, just use the unwrapped data
        response.data = unwrappedData;
      }
      
      if (DEBUG) {
        logger.debug('Processed response:', {
          url: response.config.url,
          finalData: response.data
        });
      }
    }
    
    return response;
  },
  async (error: AxiosError) => {
    // Fixed: Use safeUrlIncludes instead of direct includes
    const isUserMeEndpoint = safeUrlIncludes(error.config?.url, '/users/me') || 
                             safeUrlIncludes(error.config?.url, '/me');
                             
    // Add better logging for specific endpoint errors
    if (isUserMeEndpoint) {
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
    
    // Handle token refresh and retry original request - Fixed: Use safeUrlIncludes
    if (error.response?.status === 401 && !safeUrlIncludes(error.config?.url, '/auth/token/refresh')) {
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

// safeUrlIncludes is already exported above
export default apiClient;