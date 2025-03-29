/**
 * Profile Fetcher Hook
 * 
 * Custom hook for fetching and managing user profile data.
 */
import { useCallback, useRef, useState } from 'react';
import { logger } from '@/shared/lib/logger';
import { extractUserProfile } from '@/core/api/utils/transforms';

import { tokenManager } from './tokenManager';
import { UserProfile } from '../types';
import { DEV_CONFIG } from '../constants/config';

// Import auth service placeholders
// These will be replaced when we move the API services
const authApiService = {
  getUserProfile: async () => ({}),
};

/**
 * Create a mock user for development mode
 */
const createMockUser = (): UserProfile => {
  return {
    id: 'dev-user-id',
    username: 'developer',
    email: 'dev@example.com',
    firstName: 'Dev',
    lastName: 'User',
    roles: ['ADMIN', 'USER'],
    permissions: ['view_dashboard', 'manage_users', 'manage_exams', 'exams:view', 'exams:edit', 'exams:manage-questions'],
    userType: 'ADMIN'
  };
};

/**
 * Hook for fetching and managing user profile data
 * 
 * Encapsulates the logic for fetching user profile data, caching requests, and handling errors
 * 
 * @returns Object with profile data, loading state, errors, and fetch function
 */
export const useProfileFetcher = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const profileRequestRef = useRef<Promise<UserProfile | null> | null>(null);

  /**
   * Fetches user profile data from the API
   * Uses a request ref to deduplicate concurrent calls
   */
  const fetchProfile = useCallback(async (): Promise<UserProfile | null> => {
    // In development mode with auth bypass, return the mock user
    if (process.env.NODE_ENV === 'development' && DEV_CONFIG.bypassAuth) {
      const mockUser = createMockUser();
      setUser(mockUser);
      return mockUser;
    }
    
    // If a profile request is already in progress, return that promise
    if (profileRequestRef.current) {
      return profileRequestRef.current;
    }

    // Set loading state
    setIsLoading(true);
    setError(null);

    // Create a new promise for the profile request
    profileRequestRef.current = (async () => {
      try {
        if (!tokenManager.hasToken()) {
          setIsLoading(false);
          return null;
        }

        // Use the direct API service instead of hooks
        const response = await authApiService.getUserProfile();
        const responseData = response.data;

        logger.debug('[Auth] User profile fetch response', { 
          hasData: !!responseData,
          responseType: typeof responseData,
          hasWrappedData: responseData && 'data' in responseData,
          hasWrappedUser: responseData && responseData.data && 'user' in responseData.data
        });
        
        // Extract user profile from response using our utility
        const userData = extractUserProfile<UserProfile>(responseData);
        
        if (!userData) {
          logger.error('[Auth] Failed to extract user profile from response', { responseData });
          throw new Error('Failed to extract user profile from response');
        }
        
        logger.debug('[Auth] Setting user profile', { 
          user: { 
            id: userData.id,
            email: userData.email,
            roles: userData.roles
          }
        });
        
        setUser(userData);
        setIsLoading(false);
        return userData;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        logger.error('[Auth] Error fetching user profile', { 
          error: err,
          message: errorMessage,
          tokenExists: tokenManager.hasToken(),
          tokenExpiry: tokenManager.getTokenExpiry()
        });
        
        setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
        setIsLoading(false);
        
        // Clear the auth state to prevent inconsistency
        return null;
      } finally {
        // Clear the request ref when done
        profileRequestRef.current = null;
      }
    })();

    return profileRequestRef.current;
  }, []);

  return {
    user,
    setUser,
    isLoading,
    error,
    fetchProfile
  };
};

export default useProfileFetcher;
