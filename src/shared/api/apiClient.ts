/**
 * API Client
 * 
 * A wrapper around fetch that handles authentication tokens, 
 * refresh flows, and error handling.
 */

import keycloakService from '../auth/keycloakService';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  autoRefreshToken?: boolean;
}

interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
}

/**
 * Base API request function
 */
export async function apiRequest<T>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    requiresAuth = true,
    autoRefreshToken = true,
    ...fetchOptions
  } = options;
  
  try {
    // Get the request headers
    const headers = new Headers(fetchOptions.headers);
    
    // Add authentication token if required
    if (requiresAuth) {
      const token = await keycloakService.getAccessToken();
      
      if (!token) {
        throw new Error('Authentication required');
      }
      
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Set default content type if not specified
    if (!headers.has('Content-Type') && fetchOptions.method !== 'GET') {
      headers.set('Content-Type', 'application/json');
    }
    
    // Make the API request
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });
    
    // Handle token expiration
    if (response.status === 401 && autoRefreshToken) {
      const refreshed = await keycloakService.refreshToken();
      
      if (refreshed) {
        // Retry the request with the new token
        return apiRequest<T>(url, {
          ...options,
          autoRefreshToken: false, // Prevent infinite refresh loops
        });
      }
    }
    
    // Parse the response data
    let data: T | null = null;
    
    // Only try to parse JSON if there's content
    if (response.status !== 204 && response.headers.get('content-length') !== '0') {
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      }
    }
    
    // Handle error responses
    if (!response.ok) {
      return {
        data: null,
        error: new Error(response.statusText),
        status: response.status,
      };
    }
    
    return {
      data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error as Error,
      status: 0, // Network error or other client-side error
    };
  }
}

/**
 * Convenience method for GET requests
 */
export async function get<T>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: 'GET',
  });
}

/**
 * Convenience method for POST requests
 */
export async function post<T>(
  url: string,
  data: any,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Convenience method for PUT requests
 */
export async function put<T>(
  url: string,
  data: any,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * Convenience method for PATCH requests
 */
export async function patch<T>(
  url: string,
  data: any,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Convenience method for DELETE requests
 */
export async function del<T>(
  url: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  return apiRequest<T>(url, {
    ...options,
    method: 'DELETE',
  });
}

export default {
  request: apiRequest,
  get,
  post,
  put,
  patch,
  delete: del,
};
