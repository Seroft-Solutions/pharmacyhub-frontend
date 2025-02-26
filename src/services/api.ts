import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

// Handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Handle token refresh logic here
      // This would typically call your refresh token endpoint
      // If successful, retry the original request
      
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

/**
 * Security API functions for permission checking
 */
export const securityService = {
  /**
   * Check if the current user has specified permissions
   * @param permissions Array of permission names to check
   * @returns Map of permission names to boolean values
   */
  checkPermissions: async (permissions: string[]): Promise<Record<string, boolean>> => {
    const response = await api.post('/security/check-permissions', permissions);
    return response.data;
  },
  
  /**
   * Check if the current user has access based on roles and permissions
   * @param roles Array of roles to check
   * @param permissions Array of permissions to check
   * @param requireAll If true, user must have all specified roles/permissions
   * @returns Boolean indicating if user has access
   */
  checkAccess: async (roles: string[] = [], permissions: string[] = [], requireAll = true): Promise<boolean> => {
    const response = await api.post('/security/check-access', {
      roles,
      permissions,
      requireAll
    });
    return response.data.hasAccess;
  },
  
  /**
   * Get all available permissions in the system (admin only)
   */
  getAvailablePermissions: async () => {
    const response = await api.post('/security/available-permissions');
    return response.data;
  }
};

/**
 * User profile API functions
 */
export const userService = {
  /**
   * Get the current user's complete profile
   */
  getUserProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  /**
   * Get a user profile by ID (admin only)
   * @param userId The ID of the user to fetch
   */
  getUserProfileById: async (userId: string) => {
    const response = await api.get(`/users/${userId}/profile`);
    return response.data;
  },
  
  /**
   * Refresh the current user's permissions and roles
   */
  refreshPermissions: async () => {
    const response = await api.post('/users/refresh-permissions');
    return response.data;
  }
};

export default api;