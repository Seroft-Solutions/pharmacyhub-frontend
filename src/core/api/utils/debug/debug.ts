/**
 * API Debugging Utilities
 * 
 * This module provides utilities for debugging API requests and responses.
 * It's particularly useful during development to identify issues with API connectivity.
 */
import { logger } from '@/shared/lib/logger';

// Debug configuration
const DEBUG_CONFIG = {
  // Set to true to enable API debugging features
  ENABLED: process.env.NODE_ENV === 'development',
  
  // Set to true to log all API requests and responses
  LOG_ALL_REQUESTS: process.env.NODE_ENV === 'development',
  
  // Set to true to log all API errors
  LOG_ALL_ERRORS: true,
  
  // Set to true to add request timing information
  TIME_REQUESTS: process.env.NODE_ENV === 'development',
};

/**
 * Log API request details
 */
export const logApiRequest = (config: any): void => {
  if (!DEBUG_CONFIG.ENABLED || !DEBUG_CONFIG.LOG_ALL_REQUESTS) return;
  
  logger.debug('API Request', {
    method: config.method?.toUpperCase(),
    url: `${config.baseURL || ''}${config.url || ''}`,
    headers: config.headers,
    data: typeof config.data === 'string' 
      ? tryParseJson(config.data) 
      : config.data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Log API response details
 */
export const logApiResponse = (response: any): void => {
  if (!DEBUG_CONFIG.ENABLED || !DEBUG_CONFIG.LOG_ALL_REQUESTS) return;
  
  logger.debug('API Response', {
    status: response.status,
    statusText: response.statusText,
    url: response.config?.url,
    headers: response.headers,
    data: response.data,
    timestamp: new Date().toISOString(),
    time: response.config?.__requestTime 
      ? `${Date.now() - response.config.__requestTime}ms` 
      : undefined,
  });
};

/**
 * Log API error details
 */
export const logApiError = (error: any): void => {
  if (!DEBUG_CONFIG.ENABLED || !DEBUG_CONFIG.LOG_ALL_ERRORS) return;
  
  const errorData = {
    message: error.message,
    status: error.response?.status,
    statusText: error.response?.statusText,
    url: error.config?.url,
    method: error.config?.method?.toUpperCase(),
    headers: error.config?.headers,
    requestData: typeof error.config?.data === 'string' 
      ? tryParseJson(error.config.data) 
      : error.config?.data,
    responseData: error.response?.data,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    time: error.config?.__requestTime 
      ? `${Date.now() - error.config.__requestTime}ms` 
      : undefined,
  };
  
  logger.error('API Error', errorData);
  
  // Log more context info for 401 and 403 errors
  if (error.response?.status === 401 || error.response?.status === 403) {
    logger.debug('Auth context for 401/403 error', {
      tokenPresent: !!localStorage.getItem('accessToken'),
      tokenExpiry: localStorage.getItem('tokenExpiry'),
      request: {
        url: error.config?.url,
        method: error.config?.method,
        hasAuthHeader: !!error.config?.headers?.Authorization,
      }
    });
  }
};

/**
 * Try to parse JSON string, return original string if parsing fails
 */
const tryParseJson = (jsonString: string): any => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return jsonString;
  }
};

/**
 * Format API endpoint for debugging
 */
export const formatEndpoint = (baseUrl: string, endpoint: string): string => {
  // Remove trailing slash from baseUrl if present
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // Remove leading slash from endpoint if present
  const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  return `${base}/${path}`;
};
