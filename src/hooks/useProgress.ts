import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useProgress(userId: string) {
  const progressQuery = useQuery({
    queryKey: ['progress', userId],
    queryFn: () => api.getUserProgress(userId),
  });

  const analyticsQuery = useQuery({
    queryKey: ['analytics', userId],
    queryFn: () => api.getAnalytics(userId),
  });

  const recommendationsQuery = useQuery({
    queryKey: ['recommendations', userId],
    queryFn: () => api.getRecommendations(userId),
  });

  return {
    progress: progressQuery.data,
    analytics: analyticsQuery.data,
    recommendations: recommendationsQuery.data,
    isLoading: 
      progressQuery.isLoading || 
      analyticsQuery.isLoading || 
      recommendationsQuery.isLoading,
    error: 
      progressQuery.error || 
      analyticsQuery.error || 
      recommendationsQuery.error,
  };
}