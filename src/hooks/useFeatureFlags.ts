import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

interface FeatureFlags {
  LICENSING_ENABLED: boolean;
  [key: string]: boolean;
}

export const useFeatureFlags = () => {
  const { data: session } = useSession();
  
  const { data: flags, isLoading } = useQuery<FeatureFlags>({
    queryKey: ['featureFlags', session?.user?.id],
    queryFn: async () => {
      const response = await fetch('/api/feature-flags');
      if (!response.ok) {
        throw new Error('Failed to fetch feature flags');
      }
      return response.json();
    },
    // Only fetch when we have a session
    enabled: !!session,
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
  });

  const isFeatureEnabled = (flag: keyof FeatureFlags): boolean => {
    return flags?.[flag] ?? false;
  };

  return {
    flags,
    isLoading,
    isFeatureEnabled,
  };
};