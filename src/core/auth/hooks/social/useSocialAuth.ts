/**
 * Social Authentication Hook
 * 
 * Provides functionality for social login processing.
 */
import { useCallback } from 'react';
import { logger } from '@/shared/lib/logger';
import { tokenManager } from '../../core/tokenManager';

// Import auth service placeholders
// These will be replaced when we move the API services
const authApiService = {
  processSocialLogin: async () => ({})
};

/**
 * Hook for handling social authentication functionality
 * 
 * @returns Social login function
 */
export const useSocialAuth = () => {
  /**
   * Process the authorization code from social login providers
   * 
   * @param code - Authorization code from OAuth provider
   * @param deviceInfo - Optional device information for anti-sharing
   * @returns Response from social login API
   */
  const processSocialLogin = useCallback(async (
    code: string, 
    deviceInfo?: Record<string, string>
  ): Promise<any> => {
    try {
      logger.debug('[Auth] Processing social login', { 
        hasCode: !!code,
        hasDeviceInfo: !!deviceInfo
      });
      
      // Get device info if not provided
      const deviceData = deviceInfo || tokenManager.getAuthDataForLogin();
      
      // Exchange authorization code for tokens
      const response = await authApiService.processSocialLogin(code, deviceData);
      
      logger.debug('[Auth] Social login processed successfully');
      
      return response;
    } catch (error) {
      logger.error('[Auth] Social login processing error', { error });
      throw error;
    }
  }, []);

  return {
    processSocialLogin
  };
};

export default useSocialAuth;
