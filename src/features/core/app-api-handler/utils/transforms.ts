/**
 * Extracts user profile data from various API response formats
 * 
 * @param response The API response containing user profile data
 * @returns The normalized user profile object
 */
export const extractUserProfile = <T>(response: any): T | null => {
  if (!response) return null;
  
  let userProfile: T | null = null;
  
  // Various possible response formats
  
  // Format: { data: { user: {...} } }
  if (response.data && response.data.user) {
    userProfile = response.data.user as T;
  }
  
  // Format: { user: {...} }
  else if (response.user) {
    userProfile = response.user as T;
  }
  
  // Format: { data: {...} } where data is the user object
  else if (response.data && typeof response.data === 'object' && !('user' in response.data)) {
    userProfile = response.data as T;
  }
  
  // Format: { success: true, data: {...} } where data is the user object
  else if (response.success && response.data && typeof response.data === 'object') {
    userProfile = response.data as T;
  }
  
  // Direct user object: {...}
  else if (typeof response === 'object' && 
      !('data' in response) && 
      !('user' in response) &&
      !('success' in response)) {
    userProfile = response as T;
  }
  
  // If we couldn't extract the user profile, log an error and return null
  if (!userProfile) {
    console.error('[API] Unknown user profile format', { response });
    return null;
  }
  
  // Check for roles in metadata
  if (response.metadata && typeof response.metadata === 'object') {
    // If metadata has userType field, use it to derive roles
    if (response.metadata.userType) {
      const userType = response.metadata.userType;
      
      // Cast to the expected type first
      const profileWithRoles = userProfile as any;
      
      // Initialize roles array if it doesn't exist
      if (!profileWithRoles.roles || !Array.isArray(profileWithRoles.roles)) {
        profileWithRoles.roles = [];
      }
      
      // If userType is ADMIN, add ADMIN role
      if (userType === 'ADMIN' && !profileWithRoles.roles.includes('ADMIN')) {
        console.log(`[API] Adding ADMIN role from metadata.userType: ${userType}`);
        profileWithRoles.roles.push('ADMIN');
      }
      
      // If userType is SUPER_ADMIN, add SUPER_ADMIN role
      if (userType === 'SUPER_ADMIN' && !profileWithRoles.roles.includes('SUPER_ADMIN')) {
        console.log(`[API] Adding SUPER_ADMIN role from metadata.userType: ${userType}`);
        profileWithRoles.roles.push('SUPER_ADMIN');
      }
      
      // Also store userType directly
      profileWithRoles.userType = userType;
      
      // Convert back to generic type
      userProfile = profileWithRoles as T;
    }
  }
  
  return userProfile;
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
    // Copy metadata if it exists
    const metadata = response.metadata || {};
    
    return {
      tokens: response.data.tokens,
      user: {
        ...response.data.user,
        // Include userType from metadata if available
        userType: metadata.userType || response.data.user.userType
      },
      metadata
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