/**
 * API Request Utilities
 * 
 * This module provides utilities for handling API requests and responses.
 */
import { logger } from '@/shared/lib/logger';
import { ValidationError } from '../core/error';

/**
 * Handle API response and throw standardized errors if necessary
 * 
 * @param response The API response to process
 * @returns The data portion of the API response
 * @throws Error if the response contains an error
 */
export function handleApiResponse<TData>(response: any): TData {
  if (response?.error) {
    // Log the error details for debugging
    logger.error('API Error in response:', {
      error: response.error,
      status: response.status,
      url: response.config?.url,
    });
    
    // Throw the error to be caught by the caller
    throw response.error;
  }
  
  return response.data as TData;
}

/**
 * Process and validate an endpoint for API requests
 * 
 * @param endpoint The endpoint string or function that generates an endpoint
 * @param variables The variables to use when generating a dynamic endpoint
 * @returns The processed endpoint string
 * @throws ValidationError if the endpoint is invalid or couldn't be generated
 */
export function processEndpoint<TVariables>(
  endpoint: string | ((params: TVariables) => string), 
  variables: TVariables
): string {
  // Determine the actual endpoint
  let actualEndpoint: string;
  
  // Handle function endpoints
  if (typeof endpoint === 'function') {
    try {
      actualEndpoint = endpoint(variables);
      logger.debug('Generated dynamic endpoint:', actualEndpoint, 'from variables:', variables);
    } catch (err) {
      const errorMessage = `Failed to generate API endpoint: ${err instanceof Error ? err.message : 'Unknown error'}`;
      logger.error(errorMessage, err);
      throw new ValidationError(errorMessage, undefined, { variables }, err);
    }
  } else {
    actualEndpoint = endpoint;
  }
  
  // Validate the endpoint
  if (!actualEndpoint || typeof actualEndpoint !== 'string') {
    const errorMessage = 'Invalid API endpoint';
    logger.error(errorMessage, { endpoint: actualEndpoint });
    throw new ValidationError(errorMessage, undefined, { endpoint: actualEndpoint });
  }
  
  // Check for any remaining URL parameters that weren't replaced
  if (actualEndpoint.includes(':')) {
    logger.warn('Endpoint still contains unreplaced parameters:', actualEndpoint);
  }
  
  return actualEndpoint;
}

/**
 * Extract pagination parameters from various input formats
 * 
 * @param input The pagination input (object, number, or undefined)
 * @returns Standardized pagination parameters (page and size)
 */
export function extractPaginationParams(input: any): { page: number; size: number } {
  const defaultParams = { page: 0, size: 20 };
  
  // If no input, use defaults
  if (input === undefined || input === null) {
    return defaultParams;
  }
  
  // If input is a number, treat it as page number
  if (typeof input === 'number') {
    return { ...defaultParams, page: input };
  }
  
  // Input is an object
  const params = { ...defaultParams };
  
  // Extract page
  if ('page' in input && typeof input.page === 'number') {
    params.page = input.page;
  } else if ('pageNumber' in input && typeof input.pageNumber === 'number') {
    params.page = input.pageNumber;
  } else if ('pageIndex' in input && typeof input.pageIndex === 'number') {
    params.page = input.pageIndex;
  }
  
  // Extract size
  if ('size' in input && typeof input.size === 'number') {
    params.size = input.size;
  } else if ('pageSize' in input && typeof input.pageSize === 'number') {
    params.size = input.pageSize;
  } else if ('limit' in input && typeof input.limit === 'number') {
    params.size = input.limit;
  }
  
  return params;
}

/**
 * Convert an object to URL query parameters
 * 
 * @param params Object containing query parameters
 * @returns URL query string (without leading ?)
 */
export function objectToQueryString(params: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }
  
  const parts: string[] = [];
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }
    
    if (Array.isArray(value)) {
      // Handle arrays - use the same key multiple times
      value.forEach(item => {
        if (item !== undefined && item !== null) {
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
        }
      });
    } else if (typeof value === 'object') {
      // Handle objects - convert to JSON
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`);
    } else {
      // Handle primitives
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  });
  
  return parts.join('&');
}

/**
 * Append query parameters to a URL, handling existing parameters
 * 
 * @param url Base URL
 * @param params Query parameters object
 * @returns URL with appended query parameters
 */
export function appendQueryParams(url: string, params: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) {
    return url;
  }
  
  const queryString = objectToQueryString(params);
  if (!queryString) {
    return url;
  }
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${queryString}`;
}
