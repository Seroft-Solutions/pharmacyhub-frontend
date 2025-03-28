/**
 * Hook for API endpoint testing
 * 
 * This hook provides functionality for testing API endpoints
 * and tracking the results.
 */
import { useState } from 'react';
import { apiClient } from '../core/apiClient';

interface EndpointResult {
  status: string;
  statusCode?: number;
  time?: string;
  message?: string;
  data?: any;
}

interface UseEndpointTestingOptions {
  baseUrl?: string;
  defaultEndpoints?: string[];
  timeout?: number;
}

/**
 * Hook for testing API endpoints
 * 
 * @param options Configuration options
 * @returns Functions and state for testing endpoints
 */
export function useEndpointTesting({
  baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '',
  defaultEndpoints = ['/api/health', '/api/auth/login', '/api/users/me'],
  timeout = 5000
}: UseEndpointTestingOptions = {}) {
  // State for tracking results and loading state
  const [results, setResults] = useState<Record<string, EndpointResult>>({});
  const [loading, setLoading] = useState<boolean>(false);
  
  // Function to test a single endpoint
  const testEndpoint = async (endpoint: string) => {
    setResults(prev => ({
      ...prev,
      [endpoint]: { status: 'loading' }
    }));
    
    try {
      const startTime = Date.now();
      const response = await apiClient.get(endpoint, { timeout });
      const endTime = Date.now();
      
      setResults(prev => ({
        ...prev,
        [endpoint]: {
          status: 'success',
          statusCode: response.status,
          time: `${endTime - startTime}ms`,
          data: response.data
        }
      }));
    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        [endpoint]: {
          status: 'error',
          statusCode: error.response?.status || 'N/A',
          message: error.message,
          data: error.response?.data
        }
      }));
    }
  };
  
  // Function to test all endpoints
  const testAllEndpoints = async (endpoints: string[] = defaultEndpoints) => {
    setLoading(true);
    
    for (const endpoint of endpoints) {
      await testEndpoint(endpoint);
    }
    
    setLoading(false);
  };
  
  return {
    results,
    loading,
    testEndpoint,
    testAllEndpoints
  };
}

export default useEndpointTesting;
