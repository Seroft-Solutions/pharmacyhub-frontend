import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { authService } from '@/shared/auth/authService';

/**
 * Create authorized axios instance with interceptors for handling authentication
 */
export const createAuthorizedApi = (baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL || '') => {
  // Create a new axios instance
  const api = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Request interceptor to add authorization headers
  api.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      // Add auth token to headers
      if (authService.isAuthenticated()) {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }
      }
      
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );
  
  // Response interceptor to handle authentication errors
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      // Handle 401 Unauthorized errors
      if (error.response?.status === 401) {
        // Get current window location (for redirect after login)
        const currentLocation = window.location.pathname;
        
        // Log the user out - token is invalid or expired
        await authService.logout();
        
        // Save the current path for redirect after login
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_redirect', currentLocation);
        }
        
        // Redirect to login page
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }
  );
  
  return api;
};

// Export a default API instance
export const authorizedApi = createAuthorizedApi();

/**
 * Helper to make authorized GET requests with proper error handling
 */
export const fetchWithAuth = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await authorizedApi.get<T>(url, config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw error;
  }
};

/**
 * Helper to make authorized POST requests with proper error handling
 */
export const postWithAuth = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await authorizedApi.post<T>(url, data, config);
    return response.data;
  } catch (error) {
    console.error(`Error posting data to ${url}:`, error);
    throw error;
  }
};

/**
 * Helper to make authorized PUT requests with proper error handling
 */
export const putWithAuth = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await authorizedApi.put<T>(url, data, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating data at ${url}:`, error);
    throw error;
  }
};

/**
 * Helper to make authorized DELETE requests with proper error handling
 */
export const deleteWithAuth = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await authorizedApi.delete<T>(url, config);
    return response.data;
  } catch (error) {
    console.error(`Error deleting data at ${url}:`, error);
    throw error;
  }
};