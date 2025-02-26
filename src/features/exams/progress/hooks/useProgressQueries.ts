import { useQuery } from '@tanstack/react-query';
import { progressApi, Progress, Analytics, Recommendation } from '../api/progressApi';

// Define query keys for progress data
export const PROGRESS_KEYS = {
  all: ['progress'] as const,
  user: (userId: string) => [...PROGRESS_KEYS.all, userId] as const,
  analytics: (userId: string, startDate?: string, endDate?: string) => 
    [...PROGRESS_KEYS.all, 'analytics', userId, { startDate, endDate }] as const,
  recommendations: (userId: string) => 
    [...PROGRESS_KEYS.all, 'recommendations', userId] as const,
};

/**
 * Hook for fetching user progress data
 */
export function useUserProgress(userId: string) {
  return useQuery<Progress>({
    queryKey: PROGRESS_KEYS.user(userId),
    queryFn: () => progressApi.getUserProgress(userId),
    enabled: !!userId,
  });
}

/**
 * Hook for fetching user analytics data
 */
export function useUserAnalytics(userId: string, startDate?: string, endDate?: string) {
  return useQuery<Analytics>({
    queryKey: PROGRESS_KEYS.analytics(userId, startDate, endDate),
    queryFn: () => progressApi.getAnalytics(userId, startDate, endDate),
    enabled: !!userId,
  });
}

/**
 * Hook for fetching user recommendations
 */
export function useUserRecommendations(userId: string) {
  return useQuery<Recommendation[]>({
    queryKey: PROGRESS_KEYS.recommendations(userId),
    queryFn: () => progressApi.getRecommendations(userId),
    enabled: !!userId,
  });
}

/**
 * Composite hook that fetches all progress-related data
 */
export function useProgress(userId: string) {
  const progressQuery = useUserProgress(userId);
  const analyticsQuery = useUserAnalytics(userId);
  const recommendationsQuery = useUserRecommendations(userId);

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
    refetch: () => {
      progressQuery.refetch();
      analyticsQuery.refetch();
      recommendationsQuery.refetch();
    }
  };
}