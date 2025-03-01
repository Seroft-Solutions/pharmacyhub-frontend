import { useApiMutation } from '@/features/tanstack-query-api';
import { AUTH_ROUTES } from '../../constants/routes';
import type { 
  AuthResponse, 
  AuthTokens, 
  LoginRequest, 
  RegisterRequest 
} from '../services/authService';

/**
 * Hook for handling login mutations
 */
export const useLoginMutation = () => {
  return useApiMutation<AuthResponse, LoginRequest>(
    AUTH_ROUTES.LOGIN,
    {
      onSuccess: (data) => {
        // Save tokens on successful login
        if (data.tokens) {
          // Store tokens using authService
          const authService = require('../services/authService').default;
          authService.storeTokens(data.tokens);
        }
      }
    }
  );
};

/**
 * Hook for handling registration mutations
 */
export const useRegisterMutation = () => {
  return useApiMutation<AuthResponse, RegisterRequest>(
    AUTH_ROUTES.REGISTER,
    {
      onSuccess: (data) => {
        // Save tokens on successful registration
        if (data.tokens) {
          const authService = require('../services/authService').default;
          authService.storeTokens(data.tokens);
        }
      }
    }
  );
};

/**
 * Hook for handling password reset request
 */
export const usePasswordResetRequestMutation = () => {
  return useApiMutation<{ success: boolean }, { email: string }>(
    AUTH_ROUTES.REQUEST_PASSWORD_RESET
  );
};

/**
 * Hook for handling password reset completion
 */
export const usePasswordResetCompleteMutation = () => {
  return useApiMutation<void, { token: string; newPassword: string; confirmPassword: string }>(
    AUTH_ROUTES.RESET_PASSWORD
  );
};

/**
 * Hook for handling logout
 */
export const useLogoutMutation = () => {
  return useApiMutation<void, void>(
    AUTH_ROUTES.LOGOUT,
    {
      onSuccess: () => {
        const authService = require('../services/authService').default;
        authService.clearTokens();
        window.location.href = '/login';
      }
    }
  );
};

/**
 * Hook for refreshing auth token
 */
export const useRefreshTokenMutation = () => {
  return useApiMutation<AuthTokens, { refreshToken: string }>(
    AUTH_ROUTES.REFRESH_TOKEN,
    {
      onSuccess: (data) => {
        if (data) {
          const authService = require('../services/authService').default;
          authService.storeTokens(data);
        }
      }
    }
  );
};
