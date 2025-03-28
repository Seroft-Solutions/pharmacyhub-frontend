/**
 * URL Utilities
 * 
 * This module provides utilities for handling URLs and path parameters in API requests.
 */

/**
 * Replace parameters in URL path
 * 
 * @param url The URL string with parameter placeholders
 * @param params Object containing parameter values
 * @returns The URL with parameters replaced
 */
export function replaceUrlParams(url: string | undefined, params: Record<string, any>): string {
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
}

/**
 * Build query string from object
 * 
 * @param params Object containing query parameters
 * @returns URL-encoded query string
 */
export function buildQueryString(params: Record<string, any>): string {
  if (!params || typeof params !== 'object') {
    return '';
  }
  
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      // Handle array values
      if (Array.isArray(value)) {
        return value
          .map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
          .join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');
}

/**
 * Combine URL with query parameters
 * 
 * @param baseUrl The base URL
 * @param queryParams Object containing query parameters
 * @returns Complete URL with query string
 */
export function buildUrl(baseUrl: string, queryParams?: Record<string, any>): string {
  if (!queryParams || Object.keys(queryParams).length === 0) {
    return baseUrl;
  }
  
  const queryString = buildQueryString(queryParams);
  const separator = baseUrl.includes('?') ? '&' : '?';
  
  return queryString ? `${baseUrl}${separator}${queryString}` : baseUrl;
}
