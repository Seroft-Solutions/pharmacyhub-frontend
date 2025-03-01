/**
 * Enhanced API client with improved TypeScript support and error handling
 */
import { TOKEN_CONFIG } from '@/shared/auth/apiConfig';
import { ApiError } from '@/lib/query/queryClient';

// Time to wait before timing out requests (in milliseconds)
const DEFAULT_TIMEOUT = 30000;

// Retry configuration for failed requests
const DEFAULT_RETRY_CONFIG = {
  attempts: 3,
  delay: 1000,
  statusCodesToRetry: [408, 429, 500, 502, 503, 504],
  shouldRetry: (status: number, attempts: number) => {
    return attempts < DEFAULT_RETRY_CONFIG.attempts &&
      DEFAULT_RETRY_CONFIG.statusCodesToRetry.includes(status);
  },
};

// Default headers to include with all requests
const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
};

// API Client configuration options
export interface ApiClientConfig {
  baseURL: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
  onUnauthorized?: () => Promise<void>;
  accessTokenKey?: string;
  refreshTokenKey?: string;
  expiryKey?: string;
}

// Request options for API calls
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  requiresAuth?: boolean;
  autoRefreshToken?: boolean;
  deduplicate?: boolean;
  timeout?: number;
  body?: any;
}

// Response wrapper for all API calls
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

/**
 * Enhanced API client class with improved error handling,
 * authentication, and request/response processing
 */
export class ApiClient {
  private readonly baseURL: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly timeout: number;
  private readonly onUnauthorized?: () => Promise<void>;
  private readonly accessTokenKey: string;
  private readonly refreshTokenKey: string;
  private readonly expiryKey: string;
  private activeRequests: Map<string, Promise<any>> = new Map();

  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = {
      ...DEFAULT_HEADERS,
      ...config.defaultHeaders
    };
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
    this.onUnauthorized = config.onUnauthorized;
    this.accessTokenKey = config.accessTokenKey || TOKEN_CONFIG.ACCESS_TOKEN_KEY;
    this.refreshTokenKey = config.refreshTokenKey || TOKEN_CONFIG.REFRESH_TOKEN_KEY;
    this.expiryKey = config.expiryKey || TOKEN_CONFIG.TOKEN_EXPIRY_KEY;
  }

  /**
   * Main request method handling all API calls with timeout, retries, and auth
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      requiresAuth = true,
      autoRefreshToken = true,
      deduplicate = true,
      timeout = this.timeout,
      ...fetchOptions
    } = options;

    // Create a cache key for deduplication
    const cacheKey = this.getCacheKey(endpoint, method, fetchOptions.body);
    
    // Return existing request if deduplicate is enabled
    if (deduplicate && method === 'GET' && this.activeRequests.has(cacheKey)) {
      return this.activeRequests.get(cacheKey) as Promise<ApiResponse<T>>;
    }

    // Execute the request with timeout handling
    const requestPromise = this.executeRequest<T>(endpoint, {
      ...options,
      method,
      requiresAuth,
      autoRefreshToken,
      timeout,
    });

    // Store promise for deduplication
    if (deduplicate && method === 'GET') {
      this.activeRequests.set(cacheKey, requestPromise);
      requestPromise.finally(() => {
        this.activeRequests.delete(cacheKey);
      });
    }

    return requestPromise;
  }

  /**
   * Execute the actual request with timeout handling
   */
  private async executeRequest<T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      requiresAuth = true,
      autoRefreshToken = true,
      timeout = this.timeout,
      ...fetchOptions
    } = options;

    try {
      // Prepare request URL and headers
      const url = this.getUrl(endpoint);
      const headers = await this.prepareHeaders(fetchOptions.headers, requiresAuth);
      
      // Create AbortController for timeout handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      // Prepare the fetch options
      const fetchConfig = {
        ...fetchOptions,
        method,
        headers,
        signal: controller.signal,
        credentials: 'include' as RequestCredentials,
        mode: 'cors' as RequestMode,
      };

      if (process.env.NODE_ENV !== 'production') {
        console.log(`[API] ${method} ${url}`, { 
          headers: Object.fromEntries([...headers.entries()]),
          body: fetchOptions.body ? JSON.parse(fetchOptions.body as string) : undefined,
        });
      }

      // Execute the request
      const response = await fetch(url, fetchConfig);
      clearTimeout(timeoutId);

      // Handle 401 Unauthorized with token refresh
      if (response.status === 401 && autoRefreshToken) {
        const refreshedResponse = await this.handleUnauthorized<T>(endpoint, options);
        if (refreshedResponse) return refreshedResponse;
      }

      // Parse the response
      return this.parseResponse<T>(response);
    } catch (error) {
      // Handle request errors
      console.error(`[API Error] ${method} ${endpoint}:`, error);
      
      // Check for timeout
      if (error instanceof DOMException && error.name === 'AbortError') {
        const timeoutError = new Error(`Request timeout after ${timeout}ms`) as ApiError;
        timeoutError.status = 408;
        return {
          data: null,
          error: timeoutError,
          status: 408
        };
      }

      const apiError = error instanceof Error ? error as ApiError : new Error('Unknown error') as ApiError;
      return {
        data: null,
        error: apiError,
        status: 0
      };
    }
  }

  /**
   * Get access token from storage
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem(this.accessTokenKey);
    if (!token) return null;
    
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }

  /**
   * Handle unauthorized responses by refreshing token
   */
  private async handleUnauthorized<T>(
    endpoint: string,
    options: RequestOptions
  ): Promise<ApiResponse<T> | null> {
    try {
      // Get refresh token
      const refreshToken = localStorage.getItem(this.refreshTokenKey);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      // Call refresh token endpoint
      const response = await fetch(`${this.baseURL}/auth/token/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`);
      }
      
      const data = await response.json();
      if (!data.token) {
        throw new Error('No token in refresh response');
      }
      
      // Save the new token
      localStorage.setItem(this.accessTokenKey, data.token);
      
      // Save new refresh token if provided
      if (data.refreshToken) {
        localStorage.setItem(this.refreshTokenKey, data.refreshToken);
      }
      
      // Save token expiry if provided
      if (data.expiresIn) {
        const expiryTime = Date.now() + (data.expiresIn * 1000);
        localStorage.setItem(this.expiryKey, expiryTime.toString());
      }
      
      // Retry the original request with the new token
      return this.request<T>(endpoint, {
        ...options,
        autoRefreshToken: false, // Prevent infinite loop
      });
    } catch (error) {
      console.error('Token refresh failed:', error);
      
      // Handle auth failure (redirect to login, etc.)
      if (this.onUnauthorized) {
        await this.onUnauthorized();
      }
      
      return null;
    }
  }

  /**
   * Generate a cache key for request deduplication
   */
  private getCacheKey(endpoint: string, method: string, body?: any): string {
    let key = `${method}:${endpoint}`;
    if (body && typeof body === 'string') {
      key += `:${this.hashString(body)}`;
    }
    return key;
  }

  /**
   * Generate a hash for a string (for cache keys)
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  /**
   * Get the full URL for an API endpoint
   */
  private getUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseURL}${cleanEndpoint}`;
  }

  /**
   * Prepare headers for the request with authentication
   */
  private async prepareHeaders(
    customHeaders: HeadersInit = {},
    requiresAuth: boolean
  ): Promise<Headers> {
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

    // Add authentication header if required
    if (requiresAuth) {
      const token = this.getToken();
      if (!token) {
        throw new Error('Authentication required but no token available');
      }
      headers.set('Authorization', token);
    }

    return headers;
  }

  /**
   * Parse response based on content type and status
   */
  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: T | null = null;
    
    try {
      // Parse JSON for non-empty responses
      if (response.status !== 204 && response.headers.get('content-length') !== '0') {
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          data = await response.json();
        } else {
          // Handle non-JSON responses
          const textContent = await response.text();
          console.log(`[API] Non-JSON response: ${textContent.substring(0, 100)}...`);
        }
      }
    } catch (error) {
      console.error('Failed to parse response:', error);
    }

    // Handle error responses
    if (!response.ok) {
      const error = new Error(response.statusText || 'Request failed') as ApiError;
      error.status = response.status;
      error.data = data as any;
      
      return { 
        data: null, 
        error, 
        status: response.status 
      };
    }

    return { 
      data, 
      error: null, 
      status: response.status 
    };
  }

  /**
   * Convenience method for GET requests
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * Convenience method for POST requests
   */
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

  /**
   * Convenience method for PUT requests
   */
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

  /**
   * Convenience method for PATCH requests
   */
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

  /**
   * Convenience method for DELETE requests
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Create default API client instance
export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api',
  onUnauthorized: async () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      window.location.href = '/login';
    }
  }
});

// Factory function for creating custom API clients
export const createApiClient = (config: ApiClientConfig): ApiClient => {
  return new ApiClient(config);
};

export default apiClient;
