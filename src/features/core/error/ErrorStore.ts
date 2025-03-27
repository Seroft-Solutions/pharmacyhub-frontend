/**
 * Error store for managing error state in the application.
 * Uses the React Context API for state management.
 */

import { create } from 'zustand';
import { ErrorDetails, ErrorCategory, ErrorSeverity } from './ErrorHandlingService';

interface ErrorState {
  // Global errors
  globalError: ErrorDetails | null;
  setGlobalError: (error: ErrorDetails | null) => void;
  
  // Session errors
  sessionError: ErrorDetails | null;
  setSessionError: (error: ErrorDetails | null) => void;
  
  // Authentication errors
  authError: ErrorDetails | null;
  setAuthError: (error: ErrorDetails | null) => void;
  
  // Validation errors
  validationErrors: Record<string, ErrorDetails>;
  setValidationError: (key: string, error: ErrorDetails | null) => void;
  clearValidationErrors: () => void;
  
  // Toast notifications
  toastError: ErrorDetails | null;
  showToastError: (error: ErrorDetails, duration?: number) => void;
  hideToastError: () => void;
  
  // Recent errors for logging/history
  recentErrors: ErrorDetails[];
  addRecentError: (error: ErrorDetails) => void;
  clearRecentErrors: () => void;
  
  // Utilities
  clearAllErrors: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  // Global errors
  globalError: null,
  setGlobalError: (error) => set({ globalError: error }),
  
  // Session errors
  sessionError: null,
  setSessionError: (error) => set({ sessionError: error }),
  
  // Authentication errors
  authError: null,
  setAuthError: (error) => set({ authError: error }),
  
  // Validation errors
  validationErrors: {},
  setValidationError: (key, error) => set((state) => {
    const newValidationErrors = { ...state.validationErrors };
    if (error === null) {
      delete newValidationErrors[key];
    } else {
      newValidationErrors[key] = error;
    }
    return { validationErrors: newValidationErrors };
  }),
  clearValidationErrors: () => set({ validationErrors: {} }),
  
  // Toast notifications
  toastError: null,
  showToastError: (error, duration = 5000) => {
    set({ toastError: error });
    
    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => {
          // Only clear if it's still the same error
          if (state.toastError?.code === error.code) {
            return { toastError: null };
          }
          return state;
        });
      }, duration);
    }
  },
  hideToastError: () => set({ toastError: null }),
  
  // Recent errors for logging/history
  recentErrors: [],
  addRecentError: (error) => set((state) => {
    // Keep only the last 10 errors
    const newRecentErrors = [error, ...state.recentErrors].slice(0, 10);
    return { recentErrors: newRecentErrors };
  }),
  clearRecentErrors: () => set({ recentErrors: [] }),
  
  // Utilities
  clearAllErrors: () => set({
    globalError: null,
    sessionError: null,
    authError: null,
    validationErrors: {},
    toastError: null,
  }),
}));

// Helper functions to create error details objects
export const createErrorDetails = (
  code: string,
  message: string,
  resolution: string,
  category: ErrorCategory = ErrorCategory.CLIENT,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  recoverable: boolean = true,
  details?: Record<string, any>
): ErrorDetails => ({
  code,
  message,
  resolution,
  category,
  severity,
  recoverable,
  details,
});

export const createNetworkError = (
  message: string = 'Unable to connect to the server.',
  resolution: string = 'Please check your internet connection and try again.'
): ErrorDetails => createErrorDetails(
  'NET_001',
  message,
  resolution,
  ErrorCategory.NETWORK,
  ErrorSeverity.ERROR,
  true
);

export const createValidationError = (
  message: string,
  resolution: string = 'Please check the entered information and try again.',
  field?: string
): ErrorDetails => createErrorDetails(
  'VAL_001',
  message,
  resolution,
  ErrorCategory.VALIDATION,
  ErrorSeverity.WARNING,
  true,
  field ? { field } : undefined
);

export const createSessionError = (
  message: string = 'Your session has expired.',
  resolution: string = 'Please log in again to continue.'
): ErrorDetails => createErrorDetails(
  'SES_001',
  message,
  resolution,
  ErrorCategory.SESSION,
  ErrorSeverity.WARNING,
  true
);

export const createAuthError = (
  message: string = 'Authentication failed.',
  resolution: string = 'Please check your credentials and try again.'
): ErrorDetails => createErrorDetails(
  'AUTH_001',
  message,
  resolution,
  ErrorCategory.AUTHENTICATION,
  ErrorSeverity.WARNING,
  true
);

export const createServerError = (
  message: string = 'The server encountered an error.',
  resolution: string = 'Please try again later. If the problem persists, contact support.'
): ErrorDetails => createErrorDetails(
  'SRV_001',
  message,
  resolution,
  ErrorCategory.SERVER,
  ErrorSeverity.ERROR,
  false
);
