/**
 * Token Management
 * 
 * Main export file for the token management module.
 * Combines all token-related functionality into a unified interface.
 */
import { TOKEN_CONFIG } from './token-constants';
import { tokenStorage } from './token-storage';
import { tokenDevice } from './token-device';
import { tokenValidation } from './token-validation';
import { tokenInitialization } from './token-initialization';

/**
 * Combined token manager with all token-related functionality
 */
export const tokenManager = {
  // Token storage operations
  setToken: tokenStorage.setAccessToken,
  getToken: tokenStorage.getAccessToken,
  removeToken: tokenStorage.removeAccessToken,
  setRefreshToken: tokenStorage.setRefreshToken,
  getRefreshToken: tokenStorage.getRefreshToken,
  removeRefreshToken: tokenStorage.removeRefreshToken,
  setTokenExpiry: tokenStorage.setTokenExpiry,
  getTokenExpiry: tokenStorage.getTokenExpiry,
  
  // Device operations
  getDeviceId: tokenDevice.getDeviceId,
  getAuthDataForLogin: tokenDevice.getAuthDataForLogin,
  
  // Validation operations
  hasToken: tokenValidation.hasValidToken,
  getAuthHeader: tokenValidation.getAuthHeader,
  extractRolesFromToken: tokenValidation.extractRolesFromToken,
  
  // Initialization operations
  initializeFromAuthResponse: tokenInitialization.initializeFromAuthResponse,
  clearAll: tokenInitialization.clearAllTokens
};

// Re-export constants
export { TOKEN_CONFIG };

// Export individual modules for direct access if needed
export {
  tokenStorage,
  tokenDevice,
  tokenValidation,
  tokenInitialization
};

// Default export for backward compatibility
export default tokenManager;
