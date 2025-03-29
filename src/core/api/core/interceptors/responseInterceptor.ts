/**
 * API Response Interceptor
 * 
 * This module handles post-processing of API responses, including
 * data unwrapping, error handling, and token refresh logic.
 */
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { tokenManager } from '@/features/core/app-auth/core/tokenManager';
import { logger } from '@/shared/lib/logger';
import { logApiResponse } from '../../utils/debug/debug';
import { safeUrlIncludes } from './requestInterceptor';
import { createApiError, AuthenticationError } from '../error';

// Debug flag
const DEBUG = process.env.NODE_ENV === 'development';

/**
 * Process API response metadata
 * 
 * @param response The API response
 * @returns The processed response
 */
function processResponseMetadata(response: AxiosResponse): AxiosResponse {
  // Check if this is a special endpoint to customize
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
  
  return response;
}

/**
 * Process API response unwrapping
 * 
 * @param response The API response
 * @returns The processed response with unwrapped data
 */
function processResponseUnwrapping(response: AxiosResponse): AxiosResponse {
  // Check if unwrapping is needed
  if (!response.data || 
      (!(response.data.hasOwnProperty('status') || response.data.hasOwnProperty('success')) || 
       !response.data.hasOwnProperty('data'))) {
    return response;
  }
  
  // Check if this response has metadata we need to preserve
  const hasMetadata = response.data.hasOwnProperty('metadata');
  
  // Extract metadata if it exists
  const metadata = hasMetadata ? response.data.metadata : undefined;
  
  // Special handling for user profile endpoint
  const isUserMeEndpoint = safeUrlIncludes(response.config?.url, '/users/me') || 
                          safeUrlIncludes(response.config?.url, '/me');
                          
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
  
  return response;
}

/**
 * Success handler for response interceptor
 */
export function responseSuccessInterceptor(response: AxiosResponse): AxiosResponse {
  // Log response for debugging
  logApiResponse(response);
  
  // Process metadata
  response = processResponseMetadata(response);
  
  // Process data unwrapping
  response = processResponseUnwrapping(response);
  
  if (DEBUG) {
    logger.debug('Processed response:', {
      url: response.config.url,
      finalData: response.data
    });
  }
  
  return response;
}

/**
 * Handle token refresh logic
 * 
 * @param error The axios error
 * @param apiClient The axios instance to retry with
 * @returns Promise resolving to the retried request or rejecting with the error
 */
async function handleTokenRefresh(
  error: AxiosError,
  apiClient: any
): Promise<AxiosResponse | AxiosError> {
  // Only handle 401 errors for non-refresh endpoints
  if (error.response?.status !== 401 || 
      safeUrlIncludes(error.config?.url, '/auth/token/refresh')) {
    return Promise.reject(error);
  }
  
  try {
    // Try to refresh token
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      return Promise.reject(
        new AuthenticationError('Authentication failed - no refresh token available', 
          error.response?.data, error)
      );
    }
    
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
  } catch (refreshError) {
    logger.error('Token refresh failed', refreshError);
    // Clear tokens on refresh failure
    tokenManager.removeToken();
    tokenManager.removeRefreshToken();
    
    // Create and throw a specific error for token refresh failure
    throw new AuthenticationError(
      'Authentication failed - token refresh error',
      { originalError: refreshError },
      error
    );
  }
  
  return Promise.reject(
    new AuthenticationError(
      'Authentication failed - token refresh did not return a new token',
      error.response?.data,
      error
    )
  );
}

/**
 * Error handler for response interceptor
 */
export function responseErrorInterceptor(apiClient: any) {
  return async (error: AxiosError): Promise<AxiosResponse | AxiosError> => {
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
    
    // Try token refresh for 401 errors
    if (error.response?.status === 401) {
      try {
        return handleTokenRefresh(error, apiClient);
      } catch (refreshError) {
        // If refresh fails, return the refresh error
        return Promise.reject(refreshError);
      }
    }
    
    // Create a proper error instance using our factory
    const apiError = createApiError(error);
    
    // Return a rejected promise with the properly typed error
    return Promise.reject(apiError);
  };
}
