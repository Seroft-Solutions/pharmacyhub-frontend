import { ApiClientConfig, ApiError, ApiResponse, RequestOptions } from './types';
import { tokenManager } from './tokenManager';
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

export class ApiClient {
  private readonly baseURL: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly onUnauthorized?: () => Promise<void>;

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = {
      ...DEFAULT_HEADERS,
      ...config.defaultHeaders
    };
    this.onUnauthorized = config.onUnauthorized;
  }

  /**
   * Core request method that handles all API calls
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      requiresAuth = true,
      autoRefreshToken = true,
      ...fetchOptions
    } = options;

    try {
      // Prepare request URL
      const url = this.getUrl(endpoint);

      // Prepare headers with defaults and auth
      const headers = this.prepareHeaders(fetchOptions.headers, requiresAuth);

      // Make the request
      const response = await fetch(url, {
        ...fetchOptions,
        credentials: 'include',
        mode: 'cors',
        headers
      });

      // Handle unauthorized responses
      if (response.status === 401 && autoRefreshToken) {
        const refreshedResponse = await this.handleUnauthorized<T>(endpoint, options);
        if (refreshedResponse) return refreshedResponse;
      }

      // Parse response
      return this.parseResponse<T>(response);
    } catch (error) {
      logger.error('API request error', {
        endpoint,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        data: null,
        error: error as Error,
        status: 0
      };
    }
  }

  private getUrl(endpoint: string): string {
    return this.baseURL + (endpoint.startsWith('/') ? endpoint : `/${endpoint}`);
  }

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
      const token = tokenManager.getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }
      headers.set('Authorization', token);
    }

    return headers;
  }

  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: T | null = null;
    
    try {
      // Only try to parse JSON for non-empty responses
      if (response.status !== 204 && response.headers.get('content-length') !== '0') {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          data = await response.json();
        }
      }
    } catch (error) {
      logger.error('Failed to parse response', { error });
    }

    if (!response.ok) {
      const error = new Error(response.statusText) as ApiError;
      error.status = response.status;
      return { data: null, error, status: response.status };
    }

    return { data, error: null, status: response.status };
  }

  private async handleUnauthorized<T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<ApiResponse<T> | null> {
    try {
      const newToken = await tokenManager.refreshToken();
      if (newToken) {
        // Retry the request with new token
        return this.request<T>(endpoint, {
          ...options,
          autoRefreshToken: false // Prevent infinite refresh loops
        });
      }
    } catch (error) {
      logger.error('Token refresh failed', { error });
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

// Create default client instance
export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api'
});

// Factory function for creating API clients
export const createApiClient = (config: ApiClientConfig): ApiClient => {
  return new ApiClient(config);
};

export default apiClient;