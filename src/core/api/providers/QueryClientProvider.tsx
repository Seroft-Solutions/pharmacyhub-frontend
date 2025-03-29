/**
 * QueryClient Provider
 * 
 * This component provides TanStack Query's QueryClient to the application,
 * with proper configuration for development and production environments.
 */
import React, { ReactNode, useState } from 'react';
import { QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createQueryClient } from '../core/queryClient';

/**
 * Props for the QueryClientProvider component
 */
interface QueryClientProviderProps {
  /**
   * Whether to include React Query Devtools
   * @default process.env.NODE_ENV === 'development'
   */
  includeDevtools?: boolean;
  
  /**
   * Default stale time for queries in milliseconds
   * @default 5 * 60 * 1000 (5 minutes)
   */
  defaultStaleTime?: number;
  
  /**
   * Default garbage collection time for queries in milliseconds
   * @default 10 * 60 * 1000 (10 minutes)
   */
  defaultGcTime?: number;
  
  /**
   * React nodes to render
   */
  children: ReactNode;
}

/**
 * QueryClient Provider Component
 * 
 * Provides the TanStack Query client to the application with proper configuration.
 */
export const QueryClientProvider: React.FC<QueryClientProviderProps> = ({ 
  includeDevtools = process.env.NODE_ENV === 'development',
  defaultStaleTime,
  defaultGcTime,
  children 
}) => {
  // Create a query client instance for the application
  const [queryClient] = useState(() => 
    createQueryClient({
      defaultStaleTime,
      defaultGcTime
    })
  );
  
  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
      {includeDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </TanStackQueryClientProvider>
  );
};

export default QueryClientProvider;