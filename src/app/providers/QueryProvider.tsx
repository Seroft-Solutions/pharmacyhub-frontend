"use client";

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/features/core/app-api-handler/core/queryClient';

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
