/**
 * Login Hook
 * 
 * Provides login functionality with error handling and loading state.
 */
import { useCallback } from 'react';
import { useAuthContext } from '../../core/AuthContext';
import { tokenManager } from '../../core/tokenManager';
import { logger } from '@/shared/lib/logger';
import { unwrapAuthResponse } from '@/core/api/utils/transforms';

// Import auth service placeholders
// These will be replaced when we move the API services
const authService = {
  useLogin: () => ({
    mutateAsync: async () => ({})
  })
};

/**
 * Hook for handling user login functionality
 * 
 * @returns Login function and loading/error states
 */
export const useLogin = () => {
  const { setUser, setIsAuthenticated } = useAuthContext();
  
  // Get login mutation from authService
  const { mutateAsync: loginMutation, isPending, error } = authService.useLogin();
  
  /**
   * Login function that handles authentication
   * 
   * @param username - User's email address
   * @param password - User's password
   * @param deviceInfo - Optional device information for anti-sharing
   * @returns User profile on successful login
   */
  const login = useCallback(async (
    username: string, 
    password: string, 
    deviceInfo?: Record<string, string>
  ) => {
    // In development mode with auth bypass, return the mock user
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_BYPASS_AUTH === 'true') {
      const mockUser = createMockUser();
      setUser(mockUser);
      setIsAuthenticated(true);
      return mockUser;
    }
    
    try {
      // Log login attempt for debugging
      logger.debug('[Auth] Login attempt', { 
        emailAddress: username, 
        deviceId: deviceInfo?.deviceId
      });
      
      // Get device info if not provided
      const deviceData = deviceInfo || tokenManager.getAuthDataForLogin();

      // Use the login mutation from authService with device info
      const response = await loginMutation({ 
        emailAddress: username,
        password,
        ...deviceData
      });
      
      // Log successful response
      logger.debug('[Auth] Login response received', { 
        hasData: !!response?.data,
        hasTokens: !!response?.data?.tokens,
        hasUser: !!response?.data?.user
      });
      
      // Unwrap the API response to handle different formats
      const unwrappedResponse = unwrapAuthResponse(response);
      
      // Validate the unwrapped response
      if (!unwrappedResponse || !unwrappedResponse.tokens || !unwrappedResponse.user) {
        logger.error('[Auth] Invalid login response structure after unwrapping', { 
          unwrappedResponse
        });
        throw new Error('Invalid login response: Missing tokens or user data');
      }

      // User data is now in the unwrapped response
      const userProfile = unwrappedResponse.user;
      
      // Initialize token manager with the response
      tokenManager.initializeFromAuthResponse(unwrappedResponse);
      
      // Update auth context
      setUser(userProfile);
      setIsAuthenticated(true);
      
      return userProfile;
    } catch (err) {
      logger.error('[Auth] Login error', { error: err });
      const error = err instanceof Error ? err : new Error('Login failed');
      setIsAuthenticated(false);
      throw error;
    }
  }, [loginMutation, setIsAuthenticated, setUser]);

  return {
    login,
    isLoggingIn: isPending,
    loginError: error
  };
};

/**
 * Create a mock user for development mode
 */
const createMockUser = () => {
  return {
    id: 'dev-user-id',
    username: 'developer',
    email: 'dev@example.com',
    firstName: 'Dev',
    lastName: 'User',
    roles: ['ADMIN', 'USER'],
    permissions: ['view_dashboard', 'manage_users'],
    userType: 'ADMIN'
  };
};

export default useLogin;
