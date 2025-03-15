'use client';

/**
 * TanStack Query Provider
 * 
 * This component sets up the TanStack Query context with our
 * pre-configured query client.
 */
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { queryClient } from '../core/queryClient';
import type { PropsWithChildren } from 'react';

interface QueryProviderProps {
  /**
   * Whether to show the TanStack Query DevTools
   * (only works in development mode)
   */
  showDevtools?: boolean;
}

/**
 * TanStack Query Provider component
 * 
 * Wraps your application with the TanStack Query context
 * using our pre-configured query client.
 * 
 * @example
 * ```tsx
 * // In your app layout or root component:
 * import { QueryProvider } from '@/features/core/tanstack-query-api';
 * 
 * function App() {
 *   return (
 *     <QueryProvider>
 *       <YourApp />
 *     </QueryProvider>
 *   );
 * }
 * ```
 */
export function QueryProvider({ 
  children, 
  showDevtools = true 
}: PropsWithChildren<QueryProviderProps>) {
  // We use useState to ensure the QueryClient is created only once per component lifecycle
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* Only show DevTools in development */}
      {process.env.NODE_ENV !== 'production' && showDevtools && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  );
}

export default QueryProvider;
