/**
 * API Request Interceptor
 * 
 * This module handles preprocessing of API requests, adding auth tokens,
 * timestamps, and other necessary headers.
 */
import { AxiosRequestConfig, AxiosError } from 'axios';
import { tokenManager } from '@/features/core/app-auth/core/tokenManager';
import { logger } from '@/shared/lib/logger';
import { logApiRequest } from '../../utils/debug/debug';

// Debug flag
const DEBUG = process.env.NODE_ENV === 'development';

/**
 * Safe URL includes helper
 * 
 * @param url Any URL or path value
 * @param searchString String to search for
 * @returns Boolean indicating if the URL includes the search string
 */
export function safeUrlIncludes(url: any, searchString: string): boolean {
  if (!url) return false;
  
  // Convert to string if needed
  const urlString = typeof url === 'string' ? url : String(url);
  return urlString.includes(searchString);
}

/**
 * Request interceptor for handling auth tokens
 * Adds authorization tokens, session IDs, and timestamps
 */
export function requestInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
  // Add timestamp for request timing
  if (!config) {
    return {} as AxiosRequestConfig;
  }
  
  config.__requestTime = Date.now();
  
  // Log request for debugging
  logApiRequest(config);
  
  // Debug URL format for relativeURL issues
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
}

/**
 * Error handler for request interceptor
 */
export function requestErrorInterceptor(error: AxiosError): Promise<AxiosError> {
  if (DEBUG) {
    logger.error('API Request Error:', error);
  }
  return Promise.reject(error);
}
