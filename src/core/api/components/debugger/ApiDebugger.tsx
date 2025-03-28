"use client";

import React, { useState } from 'react';
import ApiDebuggerHeader from './ApiDebuggerHeader';
import ApiDebuggerEndpointList from './ApiDebuggerEndpointList';
import useEndpointTesting from '../../hooks/useEndpointTesting';

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
  
  // Use the custom hook for endpoint testing
  const { results, loading, testAllEndpoints } = useEndpointTesting({
    baseUrl,
    defaultEndpoints: endpointsToTest
  });
  
  // Toggle the expanded state
  const handleToggle = () => {
    setExpanded(!expanded);
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-full bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      <ApiDebuggerHeader 
        expanded={expanded}
        baseUrl={baseUrl}
        onToggle={handleToggle}
      />
      
      {expanded && (
        <ApiDebuggerEndpointList
          endpoints={endpointsToTest}
          baseUrl={baseUrl}
          results={results}
          loading={loading}
          onTestAll={() => testAllEndpoints(endpointsToTest)}
        />
      )}
    </div>
  );
};

export default ApiDebugger;
