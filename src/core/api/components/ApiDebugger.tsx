"use client";

/**
 * API Debugger Component
 * 
 * This component helps debug API connectivity issues by testing API endpoints.
 * It will ping the specified endpoints and show the results.
 * 
 * @deprecated Use the more modular components in the debugger directory instead.
 */
import React, { useState } from 'react';
import { apiClient } from '../core/apiClient';
import { formatEndpoint } from '../utils/debug/debug';
import { logger } from '@/shared/lib/logger';

interface ApiDebuggerProps {
  baseUrl?: string;
  endpoints?: string[];
  onlyInDevelopment?: boolean;
}

/**
 * API Debugger Component
 * 
 * This component helps debug API connectivity issues by testing API endpoints.
 * It will ping the specified endpoints and show the results.
 * 
 * @example
 * <ApiDebugger 
 *   baseUrl={process.env.NEXT_PUBLIC_API_BASE_URL}
 *   endpoints={['/api/auth/login', '/api/users/me']}
 *   onlyInDevelopment={true}
 * />
 */
const ApiDebugger: React.FC<ApiDebuggerProps> = ({
  baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '',
  endpoints = [],
  onlyInDevelopment = true
}) => {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  
  // Skip rendering in production if onlyInDevelopment is true
  if (onlyInDevelopment && process.env.NODE_ENV === 'production') {
    return null;
  }
  
  // Default endpoints if none provided
  const endpointsToTest = endpoints.length > 0 ? endpoints : [
    '/api/health',
    '/api/auth/login',
    '/api/users/me'
  ];
  
  const testEndpoint = async (endpoint: string) => {
    setResults(prev => ({
      ...prev,
      [endpoint]: { status: 'loading' }
    }));
    
    try {
      const startTime = Date.now();
      const response = await apiClient.get(endpoint, { timeout: 5000 });
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
  
  const testAllEndpoints = async () => {
    setLoading(true);
    
    for (const endpoint of endpointsToTest) {
      await testEndpoint(endpoint);
    }
    
    setLoading(false);
  };
  
  const getStatusColor = (status: string, statusCode?: number) => {
    if (status === 'loading') return 'bg-yellow-100 text-yellow-800';
    if (status === 'success') return 'bg-green-100 text-green-800';
    if (status === 'error') {
      if (statusCode === 401 || statusCode === 403) {
        return 'bg-blue-100 text-blue-800'; // Auth errors are less severe
      }
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      <div 
        className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-sm font-medium text-gray-700 flex items-center space-x-2">
          <span>🔌</span>
          <span>API Connectivity Debugger</span>
        </h3>
        <button
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? '▼' : '▲'}
        </button>
      </div>
      
      {expanded && (
        <div className="px-4 py-3">
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Base URL: {baseUrl || 'Not configured'}</p>
            <p className="text-xs text-gray-500">
              API Path Prefix: {process.env.NEXT_PUBLIC_API_PATH_PREFIX || '/api'}
            </p>
          </div>
          
          <div className="mb-3">
            <button
              className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={testAllEndpoints}
              disabled={loading}
            >
              {loading ? 'Testing Endpoints...' : 'Test API Connectivity'}
            </button>
          </div>
          
          <div className="space-y-2">
            {endpointsToTest.map((endpoint) => (
              <div 
                key={endpoint}
                className="p-2 rounded-md border border-gray-200 text-xs"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{endpoint}</span>
                  <span 
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      results[endpoint] 
                        ? getStatusColor(results[endpoint].status, results[endpoint].statusCode)
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {results[endpoint]?.status === 'loading' && 'Testing...'}
                    {results[endpoint]?.status === 'success' && `${results[endpoint].statusCode} OK`}
                    {results[endpoint]?.status === 'error' && `${results[endpoint].statusCode || 'Error'}`}
                    {!results[endpoint] && 'Not Tested'}
                  </span>
                </div>
                
                <div className="text-gray-500">
                  <p>Full URL: {formatEndpoint(baseUrl, endpoint)}</p>
                  {results[endpoint]?.status === 'success' && (
                    <p>Response Time: {results[endpoint].time}</p>
                  )}
                  {results[endpoint]?.status === 'error' && (
                    <p className="text-red-600">{results[endpoint].message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * @deprecated Use the more modular components from './debugger' instead
 */
export default ApiDebugger;
