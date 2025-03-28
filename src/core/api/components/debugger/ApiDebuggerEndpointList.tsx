"use client";

import React from 'react';
import ApiDebuggerEndpointItem from './ApiDebuggerEndpointItem';

interface EndpointResult {
  status: string;
  statusCode?: number;
  time?: string;
  message?: string;
  data?: any;
}

interface ApiDebuggerEndpointListProps {
  endpoints: string[];
  baseUrl: string;
  results: Record<string, EndpointResult>;
  loading: boolean;
  onTestAll: () => void;
}

/**
 * API Debugger Endpoint List Component
 * 
 * This component renders the list of API endpoints and their test results.
 */
const ApiDebuggerEndpointList: React.FC<ApiDebuggerEndpointListProps> = ({
  endpoints,
  baseUrl,
  results,
  loading,
  onTestAll
}) => {
  return (
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
          onClick={onTestAll}
          disabled={loading}
        >
          {loading ? 'Testing Endpoints...' : 'Test API Connectivity'}
        </button>
      </div>
      
      <div className="space-y-2">
        {endpoints.map((endpoint) => (
          <ApiDebuggerEndpointItem
            key={endpoint}
            endpoint={endpoint}
            baseUrl={baseUrl}
            result={results[endpoint]}
          />
        ))}
      </div>
    </div>
  );
};

export default ApiDebuggerEndpointList;
