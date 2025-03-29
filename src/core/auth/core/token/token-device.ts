/**
 * Token Device Operations
 * 
 * Handles device-related token operations such as device ID management.
 */
import { logger } from '@/shared/lib/logger';
import { TOKEN_CONFIG } from './token-constants';
import { generateUUID } from '../../utils/device/deviceManager';

/**
 * Token device management functions
 */
export const tokenDevice = {
  /**
   * Get the device ID from localStorage or generate a new one
   */
  getDeviceId: (): string => {
    if (typeof window === 'undefined') return '';
    
    try {
      let deviceId = localStorage.getItem(TOKEN_CONFIG.DEVICE_ID_KEY);
      
      if (!deviceId) {
        deviceId = generateUUID();
        localStorage.setItem(TOKEN_CONFIG.DEVICE_ID_KEY, deviceId);
        logger.debug('[Auth] Generated new device ID');
      }
      
      return deviceId;
    } catch (error) {
      logger.error('[Auth] Error getting device ID', error);
      return '';
    }
  },
  
  /**
   * Get auth data for login request
   * Includes device information for anti-sharing protection
   */
  getAuthDataForLogin: (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    
    return {
      deviceId: tokenDevice.getDeviceId(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
    };
  }
};
