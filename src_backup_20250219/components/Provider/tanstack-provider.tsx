"use client"

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

interface TanstackProviderProps{
  children: React.ReactNode;
}
export const TanstackProvider=({children}:TanstackProviderProps)=>{
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        retryDelay: 500
      }
    }
  });

  return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

}