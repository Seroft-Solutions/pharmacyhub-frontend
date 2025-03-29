/**
 * API Request Utilities
 * 
 * This module provides utilities for handling API requests and responses.
 */
import { logger } from '@/shared/lib/logger';

/**
 * Handle API response and throw standardized errors if necessary
 * 
 * @param response The API response to process
 * @returns The data portion of the API response
 * @throws Error if the response contains an error
 */
export function handleApiResponse<TData>(response: any): TData {
  if (response?.error) {
    // Log the error details for debugging
    logger.error('API Error in response:', {
      error: response.error,
      status: response.status,
      url: response.config?.url,
    });
    
    // Throw the error to be caught by the caller
    throw response.error;
  }
  
  return response.data as TData;
}

/**
 * Process and validate an endpoint for API requests
 * 
 * @param endpoint The endpoint string or function that generates an endpoint
 * @param variables The variables to use when generating a dynamic endpoint
 * @returns The processed endpoint string
 * @throws Error if the endpoint is invalid or couldn't be generated
 */
export function processEndpoint<TVariables>(
  endpoint: string | ((params: TVariables) => string), 
  variables: TVariables
): string {
  // Determine the actual endpoint
  let actualEndpoint: string;
  
  // Handle function endpoints
  if (typeof endpoint === 'function') {
    try {
      actualEndpoint = endpoint(variables);
      logger.debug('Generated dynamic endpoint:', actualEndpoint, 'from variables:', variables);
    } catch (err) {
      logger.error('Error generating endpoint:', err);
      throw new Error(`Failed to generate API endpoint: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  } else {
    actualEndpoint = endpoint;
  }
  
  // Validate the endpoint
  if (!actualEndpoint || typeof actualEndpoint !== 'string') {
    logger.error('Invalid endpoint:', actualEndpoint);
    throw new Error('Invalid API endpoint');
  }
  
  // Check for any remaining URL parameters that weren't replaced
  if (actualEndpoint.includes(':')) {
    logger.warn('Endpoint still contains unreplaced parameters:', actualEndpoint);
  }
  
  return actualEndpoint;
}
