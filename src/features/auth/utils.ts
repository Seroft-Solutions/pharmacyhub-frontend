import { ApiErrorResponse } from './types';

/**
 * Debug JWT token by decoding and logging its contents
 */
export function debugJwtToken(token: string | null): object | null {
  if (!token) return null;
  
  try {
    // Remove Bearer prefix if present
    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    // Split the token into parts
    const parts = actualToken.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT token format');
      return null;
    }
    
    // Decode the payload (middle part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Add expiry info for debugging
    if (payload.exp) {
      payload.expiryDate = new Date(payload.exp * 1000).toISOString();
      payload.isExpired = Date.now() >= payload.exp * 1000;
    }
    
    return payload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Format authentication errors for consistent error messaging
 */
export function formatAuthError(error: unknown): string {
  if (!error) return 'An unknown error occurred';
  
  if (error instanceof Error) {
    // Remove any "Error:" prefix
    return error.message.replace(/^Error:\s*/, '');
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle API error responses
  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiErrorResponse;
    return apiError.message || apiError.error || 'An unknown error occurred';
  }
  
  return 'An unknown error occurred';
}
