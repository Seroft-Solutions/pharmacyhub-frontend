import { ApiClientConfig, ApiError, ApiResponse, RequestOptions } from './types';
import { tokenManager, TOKEN_CONSTANTS } from './tokenManager';
import { logger } from '../lib/logger';

/**
 * Default configuration for all API requests
 */
const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
};

/**
 * Improved API client with request deduplication, better error handling,
 * and consistent authentication management
 */
export class ApiClient {
  private readonly baseURL: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly onUnauthorized?: () => Promise<void>;
  private activeRequests: Map<string, Promise<any>> = new Map();

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = {
      ...DEFAULT_HEADERS,
      ...config.defaultHeaders
    };
    this.onUnauthorized = config.onUnauthorized;
    
    console.log('API Client initialized with base URL:', this.baseURL);
  }

  /**
   * Core request method that handles all API calls with deduplication
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      requiresAuth = true,
      autoRefreshToken = true,
      deduplicate = true, // Enable request deduplication by default
      ...fetchOptions
    } = options;

    // Create a cache key for this request to enable deduplication
    const cacheKey = this.getCacheKey(endpoint, method, fetchOptions.body);
    
    // If deduplication is enabled and there's already an identical request in progress, return it
    if (deduplicate && method === 'GET' && this.activeRequests.has(cacheKey)) {
      logger.debug('Using cached request for', { endpoint });
      return this.activeRequests.get(cacheKey) as Promise<ApiResponse<T>>;
    }

    // Create the request promise
    const requestPromise = this.executeRequest<T>(endpoint, {
      ...options,
      method,
      requiresAuth,
      autoRefreshToken
    });

    // Store the promise for GET requests to enable deduplication
    if (deduplicate && method === 'GET') {
      this.activeRequests.set(cacheKey, requestPromise);
      
      // Remove from active requests when completed
      requestPromise.finally(() => {
        this.activeRequests.delete(cacheKey);
      });
    }

    return requestPromise;
  }

  /**
   * Execute the actual API request
   */
  private async executeRequest<T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      requiresAuth = true,
      autoRefreshToken = true,
      ...fetchOptions
    } = options;

    try {
      // Prepare request URL
      const url = this.getUrl(endpoint);

      // Check authentication if required
      if (requiresAuth) {
        const token = tokenManager.getToken();
        if (!token) {
          console.error('Authentication required but no token available');
          return {
            data: null,
            error: new Error('Authentication required') as ApiError,
            status: 401
          };
        }
      }
      
      // Prepare headers with defaults and auth
      const headers = this.prepareHeaders(fetchOptions.headers, requiresAuth);

      // Log the request (only in development)
      console.log('API request', { 
        method, 
        url,
        requiresAuth,
        headers: Object.fromEntries([...headers.entries()])
      });

      // Make the request
      const response = await fetch(url, {
        ...fetchOptions,
        method,
        credentials: 'include',
        mode: 'cors',
        headers
      });

      console.log('API response status:', response.status);

      // Handle unauthorized responses with token refresh
      if (response.status === 401 && autoRefreshToken) {
        console.log('Unauthorized response, attempting token refresh');
        const refreshedResponse = await this.handleUnauthorized<T>(endpoint, options);
        if (refreshedResponse) return refreshedResponse;
      }

      // Parse response
      return this.parseResponse<T>(response);
    } catch (error) {
      console.error('API request error', {
        endpoint,
        method: options.method || 'GET',
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        data: null,
        error: error as Error,
        status: 0
      };
    }
  }

  /**
   * Generate a unique cache key for request deduplication
   */
  private getCacheKey(endpoint: string, method: string, body?: any): string {
    let key = `${method}:${endpoint}`;
    if (body && typeof body === 'string') {
      // For simplicity, just add a hash of the body
      // In a production app, you might want a more sophisticated approach
      key += `:${hashString(body)}`;
    }
    return key;
  }

  /**
   * Get the full URL for an API endpoint
   */
  private getUrl(endpoint: string): string {
    return this.baseURL + (endpoint.startsWith('/') ? endpoint : `/${endpoint}`);
  }

  /**
   * Prepare headers for the request, including auth if needed
   */
  private prepareHeaders(
    customHeaders: HeadersInit = {},
    requiresAuth: boolean
  ): Headers {
    const headers = new Headers();

    // Add default headers
    Object.entries(this.defaultHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });

    // Add custom headers
    if (customHeaders instanceof Headers) {
      customHeaders.forEach((value, key) => {
        headers.set(key, value);
      });
    } else if (typeof customHeaders === 'object') {
      Object.entries(customHeaders).forEach(([key, value]) => {
        if (typeof value === 'string') {
          headers.set(key, value);
        }
      });
    }

    // Add auth header if required
    if (requiresAuth) {
      // Try multiple token sources for better compatibility
      let token = tokenManager.getToken();
      
      // If token manager failed, try direct localStorage access
      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('auth_token') || 
               localStorage.getItem('access_token');
               
        if (token && !token.startsWith('Bearer ')) {
          token = `Bearer ${token}`;
        }
      }
      
      if (!token) {
        console.error('No authentication token available');
        throw new Error('No authentication token available');
      }
      
      headers.set('Authorization', token);
      console.log('Added auth header:', token.substring(0, 15) + '...');
    }

    return headers;
  }

  /**
   * Parse the response based on content type
   */
  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: T | null = null;
    
    try {
      // Only try to parse JSON for non-empty responses
      if (response.status !== 204 && response.headers.get('content-length') !== '0') {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          data = await response.json();
          console.log('Parsed JSON response:', data);
        } else {
          // Try to get text content for non-JSON responses
          const textContent = await response.text();
          console.log('Response text content:', textContent.substring(0, 200) + (textContent.length > 200 ? '...' : ''));
        }
      }
    } catch (error) {
      console.error('Failed to parse response:', error);
    }

    if (!response.ok) {
      const error = new Error(response.statusText || 'Request failed') as ApiError;
      error.status = response.status;
      error.data = data;
      return { data: null, error, status: response.status };
    }

    return { data, error: null, status: response.status };
  }

  /**
   * Handle unauthorized responses by refreshing token and retrying
   */
  private async handleUnauthorized<T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<ApiResponse<T> | null> {
    try {
      console.log('Attempting to refresh token for unauthorized request');
      const newToken = await tokenManager.refreshToken();
      
      if (newToken) {
        console.log('Token refreshed successfully, retrying request');
        // Retry the request with new token
        return this.request<T>(endpoint, {
          ...options,
          autoRefreshToken: false // Prevent infinite refresh loops
        });
      } else {
        console.log('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    // Handle unauthorized (e.g., redirect to login)
    if (this.onUnauthorized) {
      await this.onUnauthorized();
    }

    return null;
  }

  // Convenience methods for different HTTP methods
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

/**
 * Simple string hashing function for cache keys
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

// Create default client instance
export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api',
  onUnauthorized: async () => {
    console.log('Unauthorized access, redirecting to login');
    // Save current location to redirect back after login
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      window.location.href = '/login';
    }
  }
});

// Factory function for creating API clients
export const createApiClient = (config: ApiClientConfig): ApiClient => {
  return new ApiClient(config);
};

export default apiClient;
