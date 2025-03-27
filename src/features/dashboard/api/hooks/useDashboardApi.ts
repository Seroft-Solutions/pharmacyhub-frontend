'use client';

/**
 * Dashboard API Hooks
 * 
 * TanStack Query hooks for fetching dashboard data.
 * These hooks use the dashboardService with proper query configuration.
 */

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { 
  Progress, 
  Analytics, 
  Recommendation 
} from '@/features/exams/progress/api/progressApi';
import { logger } from '@/shared/lib/logger';

// Query keys for dashboard data
export const DASHBOARD_KEYS = {
  all: ['dashboard'] as const,
  progress: (userId: string) => [...DASHBOARD_KEYS.all, 'progress', userId] as const,
  analytics: (userId: string, startDate?: string, endDate?: string) => 
    [...DASHBOARD_KEYS.all, 'analytics', userId, { startDate, endDate }] as const,
  recommendations: (userId: string) => 
    [...DASHBOARD_KEYS.all, 'recommendations', userId] as const,
};

/**
 * Hook for fetching user progress data
 */
export function useDashboardProgress(userId: string) {
  return useQuery<Progress>({
    queryKey: DASHBOARD_KEYS.progress(userId),
    queryFn: () => dashboardService.getUserProgress(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      logger.error('Error fetching dashboard progress:', error);
    }
  });
}

/**
 * Hook for fetching user analytics data
 */
export function useDashboardAnalytics(userId: string, startDate?: string, endDate?: string) {
  return useQuery<Analytics>({
    queryKey: DASHBOARD_KEYS.analytics(userId, startDate, endDate),
    queryFn: () => dashboardService.getUserAnalytics(userId, startDate, endDate),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      logger.error('Error fetching dashboard analytics:', error);
    }
  });
}

/**
 * Hook for fetching user recommendations
 */
export function useDashboardRecommendations(userId: string) {
  return useQuery<Recommendation[]>({
    queryKey: DASHBOARD_KEYS.recommendations(userId),
    queryFn: () => dashboardService.getUserRecommendations(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    onError: (error) => {
      logger.error('Error fetching dashboard recommendations:', error);
    }
  });
}

/**
 * Composite hook that combines all dashboard data fetching
 */
export function useDashboardData(
  userId: string,
  timeRange?: { startDate?: string; endDate?: string }
) {
  const progressQuery = useDashboardProgress(userId);
  const analyticsQuery = useDashboardAnalytics(
    userId, 
    timeRange?.startDate, 
    timeRange?.endDate
  );
  const recommendationsQuery = useDashboardRecommendations(userId);

  // Combine all queries into a single result
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