"use client";

import React from 'react';
import { formatEndpoint } from '../../utils/debug/debug';

interface EndpointResult {
  status: string;
  statusCode?: number;
  time?: string;
  message?: string;
}

interface ApiDebuggerEndpointItemProps {
  endpoint: string;
  baseUrl: string;
  result?: EndpointResult;
}

/**
 * API Debugger Endpoint Item Component
 * 
 * This component renders a single endpoint test result in the API Debugger.
 */
const ApiDebuggerEndpointItem: React.FC<ApiDebuggerEndpointItemProps> = ({
  endpoint,
  baseUrl,
  result
}) => {
  // Helper function to get the status color
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
    <div 
      className="p-2 rounded-md border border-gray-200 text-xs"
    >
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium">{endpoint}</span>
        <span 
          className={`px-2 py-0.5 rounded-full text-xs ${
            result 
              ? getStatusColor(result.status, result.statusCode)
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {result?.status === 'loading' && 'Testing...'}
          {result?.status === 'success' && `${result.statusCode} OK`}
          {result?.status === 'error' && `${result.statusCode || 'Error'}`}
          {!result && 'Not Tested'}
        </span>
      </div>
      
      <div className="text-gray-500">
        <p>Full URL: {formatEndpoint(baseUrl, endpoint)}</p>
        {result?.status === 'success' && (
          <p>Response Time: {result.time}</p>
        )}
        {result?.status === 'error' && (
          <p className="text-red-600">{result.message}</p>
        )}
      </div>
    </div>
  );
};

export default ApiDebuggerEndpointItem;
