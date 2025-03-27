/**
 * Error interceptor for HTTP requests.
 * This centralizes error handling for all HTTP requests in the application.
 */

import { errorHandlingService, ErrorCategory } from './ErrorHandlingService';

// Function to log errors but let them propagate to the caller
export const logErrorInterceptor = async (error: any) => {
  try {
    const errorDetails = await errorHandlingService.parseApiError(error);
    
    // Log error to monitoring/analytics
    errorHandlingService.logError(error, {
      category: errorDetails.category,
      code: errorDetails.code,
      url: error.config?.url || error.request?.url,
      method: error.config?.method || error.request?.method,
    });
  } catch (e) {
    console.error('Error in logErrorInterceptor:', e);
  }
  
  // Re-throw the error to propagate it to the caller
  throw error;
};

// Function to handle session-related errors
export const sessionErrorInterceptor = async (error: any) => {
  try {
    const errorDetails = await errorHandlingService.parseApiError(error);
    
    // If it's a session-related error, handle it
    if (
      errorDetails.category === ErrorCategory.SESSION ||
      errorDetails.category === ErrorCategory.AUTHENTICATION ||
      error.response?.status === 401
    ) {
      await errorHandlingService.handleSessionError(error);
      
      // TODO: If session expired, redirect to login page or show session expired dialog
      // if (errorDetails.code === 'ERR_SESSION_EXPIRED') {
      //   window.location.href = '/login?expired=true';
      // }
    }
  } catch (e) {
    console.error('Error in sessionErrorInterceptor:', e);
  }
  
  // Re-throw the error to propagate it to the caller
  throw error;
};

// Function to handle all errors in a comprehensive way
export const fullErrorInterceptor = async (error: any) => {
  try {
    // Parse and log the error
    const errorDetails = await errorHandlingService.parseApiError(error);
    
    // Log error to monitoring/analytics
    errorHandlingService.logError(error, {
      category: errorDetails.category,
      code: errorDetails.code,
      url: error.config?.url || error.request?.url,
      method: error.config?.method || error.request?.method,
    });
    
    // Handle session-related errors
    if (
      errorDetails.category === ErrorCategory.SESSION ||
      errorDetails.category === ErrorCategory.AUTHENTICATION ||
      error.response?.status === 401
    ) {
      await errorHandlingService.handleSessionError(error);
    }
    
    // Handle specific error categories
    switch (errorDetails.category) {
      case ErrorCategory.NETWORK:
        // TODO: Show offline notification or retry mechanism
        break;
      
      case ErrorCategory.SERVER:
        // TODO: Show server error notification
        break;
      
      case ErrorCategory.VALIDATION:
        // Let these propagate to the form components
        break;
      
      default:
        // General error handling
        break;
    }
  } catch (e) {
    console.error('Error in fullErrorInterceptor:', e);
  }
  
  // Re-throw the error to propagate it to the caller
  throw error;
};

/**
 * Configure Axios interceptors with the provided instance
 */
export const configureAxiosInterceptors = (axiosInstance: any) => {
  // Request interceptor can be used for adding headers, tokens, etc.
  axiosInstance.interceptors.request.use(
    (config: any) => {
      // You can modify the request config here
      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );
  
  // Response interceptor for handling errors
  axiosInstance.interceptors.response.use(
    (response: any) => {
      // Successful response
      return response;
    },
    (error: any) => {
      // Use the full error interceptor
      return fullErrorInterceptor(error).catch((interceptedError) => {
        return Promise.reject(interceptedError);
      });
    }
  );
  
  return axiosInstance;
};

/**
 * Create a fetch API wrapper with error handling
 */
export const createFetchWithErrorHandling = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const response = await originalFetch(input, init);
      
      if (!response.ok) {
        // Create an error object with the response
        const error = new Error(response.statusText);
        (error as any).response = response;
        (error as any).request = { url: input, ...init };
        
        // Use the full error interceptor
        await fullErrorInterceptor(error);
      }
      
      return response;
    } catch (error) {
      // Handle network errors
      await fullErrorInterceptor(error);
      throw error;
    }
  };
};
