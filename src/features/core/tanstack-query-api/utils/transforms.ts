/**
 * Extracts user profile data from various API response formats
 * 
 * @param response The API response containing user profile data
 * @returns The normalized user profile object
 */
export const extractUserProfile = <T>(response: any): T | null => {
  if (!response) return null;
  
  // Various possible response formats
  
  // Format: { data: { user: {...} } }
  if (response.data && response.data.user) {
    return response.data.user as T;
  }
  
  // Format: { user: {...} }
  if (response.user) {
    return response.user as T;
  }
  
  // Format: { data: {...} } where data is the user object
  if (response.data && typeof response.data === 'object' && !('user' in response.data)) {
    return response.data as T;
  }
  
  // Format: { success: true, data: {...} } where data is the user object
  if (response.success && response.data && typeof response.data === 'object') {
    return response.data as T;
  }
  
  // Direct user object: {...}
  if (typeof response === 'object' && 
      !('data' in response) && 
      !('user' in response) &&
      !('success' in response)) {
    return response as T;
  }
  
  console.error('[API] Unknown user profile format', { response });
  return null;
};

/**
 * API Response Transformation Utilities
 * 
 * These utilities help transform API responses between different formats.
 */

/**
 * Normalizes an API response to a standard format.
 * Handles responses wrapped in a data property and unwrapped responses.
 * 
 * @param response The API response to normalize
 * @returns The normalized response object
 */
export const normalizeApiResponse = <T>(response: any): T => {
  // If response is null or undefined, return as is
  if (!response) return response;

  // Handle response wrapped in data property
  if (response.data !== undefined) {
    // Check for API response format with success/status wrapper
    if (
      response.success !== undefined && 
      response.status !== undefined && 
      typeof response.data === 'object'
    ) {
      // Return the inner data object
      return response.data as T;
    }
    
    // Otherwise, it might be an axios response or similar wrapper
    return response.data as T;
  }
  
  // If no data property exists, return the original response
  return response as T;
};

/**
 * Unwraps a nested API response that might have data: { tokens, user } structure
 * 
 * @param response The API response
 * @returns An object with tokens and user at the root level
 */
export const unwrapAuthResponse = (response: any): any => {
  // If null/undefined, return as is
  if (!response) return response;

  // If it's a wrapped response with data.tokens and data.user
  if (response.data?.tokens && response.data?.user) {
    return {
      tokens: response.data.tokens,
      user: response.data.user
    };
  }
  
  // If it's a direct response with tokens and user
  if (response.tokens && response.user) {
    return response;
  }
  
  // Return original if can't unwrap
  return response;
};

/**
 * Extracts data from a paginated API response
 * 
 * @param response The API response containing pagination data
 * @returns The content array from the paginated response
 */
export const extractPaginatedContent = <T>(response: any): T[] => {
  if (!response) return [];
  
  // Handle standard Spring Boot pagination format
  if (response.content && Array.isArray(response.content)) {
    return response.content as T[];
  }
  
  // Handle wrapped pagination format
  if (response.data?.content && Array.isArray(response.data.content)) {
    return response.data.content as T[];
  }
  
  // Handle direct array response
  if (Array.isArray(response)) {
    return response as T[];
  }
  
  // Handle wrapped array response
  if (Array.isArray(response.data)) {
    return response.data as T[];
  }
  
  return [];
};

export default {
  normalizeApiResponse,
  unwrapAuthResponse,
  extractPaginatedContent
};
