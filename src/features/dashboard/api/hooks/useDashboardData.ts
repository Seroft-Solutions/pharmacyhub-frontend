'use client';

/**
 * useDashboardData
 * 
 * A composite hook that fetches and combines all data needed for the dashboard.
 * This hook leverages hooks from other features to provide a unified data source.
 */

import { useCallback, useMemo, useState, useEffect } from 'react';
import { logger } from '@/shared/lib/logger';
import { useExamStats } from '@/features/exams/api/hooks/useExamApiHooks';
// Use our new dashboard API hooks instead of direct progress hooks
import { useDashboardProgress, useDashboardAnalytics, useDashboardRecommendations } from './useDashboardApi';
import usePremiumStatus from '@/features/payments/premium/hooks/usePremiumStatus';
import { useAuth } from '@/features/core/auth';
import { useModelPapers, usePastPapers, useSubjectPapers } from '@/features/exams/api/hooks/useExamPaperHooks';

export type TimeFilter = 'week' | 'month' | 'year' | 'all';

export function useDashboardData() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');
  const { user } = useAuth();
  const userId = user?.id || '';

  // Fetch all required data
  const { isPremium, isLoading: isPremiumLoading } = usePremiumStatus({ forceCheck: false });
  const { data: examStats, isLoading: isExamStatsLoading } = useExamStats();
  
  // Get time filter dates
  const { startDate, endDate } = getTimeFilterDates(timeFilter);
  
  // Use dashboard API hooks instead of direct progress hooks
  const { data: progress, isLoading: isProgressLoading } = useDashboardProgress(userId);
  const { data: analytics, isLoading: isAnalyticsLoading } = useDashboardAnalytics(
    userId, 
    startDate, 
    endDate
  );
  const { data: recommendations, isLoading: isRecommendationsLoading } = useDashboardRecommendations(userId);

  // Filter change handler
  const handleTimeFilterChange = useCallback((filter: TimeFilter) => {
    setTimeFilter(filter);
  }, []);

  // Fetch paper data
  const { data: modelPapers, isLoading: isModelPapersLoading } = useModelPapers();
  const { data: pastPapers, isLoading: isPastPapersLoading } = usePastPapers();
  const { data: subjectPapers, isLoading: isSubjectPapersLoading } = useSubjectPapers();

  // Individual loading states for better granularity
  const loadingStates = {
    premium: isPremiumLoading,
    examStats: isExamStatsLoading,
    progress: isProgressLoading,
    analytics: isAnalyticsLoading,
    recommendations: isRecommendationsLoading,
    modelPapers: isModelPapersLoading,
    pastPapers: isPastPapersLoading,
    subjectPapers: isSubjectPapersLoading
  };
  
  // Combined loading state for backward compatibility
  const isLoading = Object.values(loadingStates).some(state => state === true);
  
  // Specific section loading states for component-level loading indicators
  const isOverviewLoading = isPremiumLoading || isExamStatsLoading || isProgressLoading;
  const isPerformanceLoading = isAnalyticsLoading;
  const isPapersLoading = isModelPapersLoading || isPastPapersLoading || isSubjectPapersLoading;
  const isPremiumSectionLoading = isPremiumLoading;

  // Create and format the data for charts with better error handling
  const examScores = useMemo(() => {
    try {
      if (!analytics?.examScores || analytics.examScores.length === 0) {
        return [];
      }
      // Process and return the actual data
      return analytics.examScores.map(score => ({
        ...score,
        // Add fallbacks for essential properties
        name: score.name || `Exam ${score.id || 'Unknown'}`,
        score: typeof score.score === 'number' ? score.score : 0,
        average: typeof score.average === 'number' ? score.average : 0
      }));
    } catch (error) {
      logger.error('Error formatting exam scores:', error);
      return [];
    }
  }, [analytics]);

  const scoreDistribution = useMemo(() => {
    return analytics?.scoreDistribution || [];
  }, [analytics]);

  const studyHours = useMemo(() => {
    return analytics?.studyHours || [];
  }, [analytics]);

  const subjectPerformance = useMemo(() => {
    return analytics?.subjectPerformance || [];
  }, [analytics]);

  const recentExams = useMemo(() => {
    return analytics?.recentExams || [];
  }, [analytics]);

  const recentActivities = useMemo(() => {
    return analytics?.recentActivities || [];
  }, [analytics]);

  const paperCounts = useMemo(() => {
    // Use actual values from analytics if available
    if (analytics?.paperCounts) {
      return analytics.paperCounts;
    }
    // Otherwise calculate based on real data without multipliers
    return {
      model: { 
        total: modelPapers?.length || 0, 
        completed: modelPapers?.filter(p => p.completed)?.length || 0 
      },
      past: { 
        total: pastPapers?.length || 0, 
        completed: pastPapers?.filter(p => p.completed)?.length || 0 
      },
      subject: { 
        total: subjectPapers?.length || 0, 
        completed: subjectPapers?.filter(p => p.completed)?.length || 0 
      }
    };
  }, [analytics, modelPapers, pastPapers, subjectPapers]);

  const paperCompletionTimeline = useMemo(() => {
    return analytics?.paperCompletionTimeline || [];
  }, [analytics]);

  // Combined data object with better error handling
  const dashboardData = useMemo(() => {
    try {
      return {
        premium: {
          isPremium: isPremium || false,
          expiryDate: analytics?.premiumInfo?.expiryDate || '',
          planName: analytics?.premiumInfo?.planName || 'Premium Subscription',
          paymentMethod: analytics?.premiumInfo?.paymentMethod || '',
          remainingPercentage: analytics?.premiumInfo?.remainingPercentage || 0,
          nextPaymentDate: analytics?.premiumInfo?.nextPaymentDate || '',
          paymentHistory: analytics?.premiumInfo?.paymentHistory || [],
          loading: isPremiumLoading,
          error: false
        },
        examStats: examStats || {
          totalPapers: 0,
          avgDuration: 0,
          completionRate: 0,
          activeUsers: 0,
          loading: isExamStatsLoading,
          error: false
        },
        progress: progress || {
          completedExams: 0,
          inProgressExams: 0,
          averageScore: 0,
          totalTimeSpent: 0,
          loading: isProgressLoading,
          error: false
        },
        analytics: {
          studyHours: studyHours || [],
          examScores: examScores || [],
          scoreDistribution: scoreDistribution || [],
          subjectPerformance: subjectPerformance || [],
          recentExams: recentExams || [],
          recentActivities: recentActivities || [],
          paperCounts: paperCounts || {},
          paperCompletionTimeline: paperCompletionTimeline || [],
          activityData: analytics?.activityData || [],
          timeSpent: analytics?.timeSpent || {},
          loading: isAnalyticsLoading,
          error: false
        },
        recommendations: recommendations || [],
        timeFilter,
        papers: {
          model: Array.isArray(modelPapers) ? modelPapers : [],
          past: Array.isArray(pastPapers) ? pastPapers : [],
          subject: Array.isArray(subjectPapers) ? subjectPapers : [],
          loading: isModelPapersLoading || isPastPapersLoading || isSubjectPapersLoading,
          error: false
        }
      };
    } catch (error) {
      logger.error('Error creating dashboard data object:', error);
      // Return a safe fallback object with empty data
      return {
        premium: { isPremium: false, expiryDate: '', planName: '', paymentMethod: '', remainingPercentage: 0, nextPaymentDate: '', paymentHistory: [], loading: false, error: true },
        examStats: { totalPapers: 0, avgDuration: 0, completionRate: 0, activeUsers: 0, loading: false, error: true },
        progress: { completedExams: 0, inProgressExams: 0, averageScore: 0, totalTimeSpent: 0, loading: false, error: true },
        analytics: {
          studyHours: [], examScores: [], scoreDistribution: [], subjectPerformance: [],
          recentExams: [], recentActivities: [], paperCounts: {}, paperCompletionTimeline: [],
          activityData: [], timeSpent: {}, loading: false, error: true
        },
        recommendations: [],
        timeFilter,
        papers: { model: [], past: [], subject: [], loading: false, error: true }
      };
    }
  }, [analytics, examStats, isPremium, progress, recommendations, timeFilter, 
      studyHours, examScores, scoreDistribution, subjectPerformance, 
      recentExams, recentActivities, paperCounts, paperCompletionTimeline,
      modelPapers, pastPapers, subjectPapers,
      isPremiumLoading, isExamStatsLoading, isProgressLoading, isAnalyticsLoading,
      isModelPapersLoading, isPastPapersLoading, isSubjectPapersLoading]);

  return {
    dashboardData,
    isLoading,
    loadingStates,
    isOverviewLoading,
    isPerformanceLoading,
    isPapersLoading,
    isPremiumSectionLoading,
    timeFilter,
    setTimeFilter: handleTimeFilterChange,
  };
}

// Helper function to get date ranges based on time filter
function getTimeFilterDates(filter: TimeFilter): { startDate: string; endDate: string } {
  const now = new Date();
  const endDate = now.toISOString().split('T')[0]; // Today's date in YYYY-MM-DD
  let startDate: string;

  switch (filter) {
    case 'week':
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      startDate = lastWeek.toISOString().split('T')[0];
      break;
    case 'month':
      const lastMonth = new Date(now);
      lastMonth.setMonth(now.getMonth() - 1);
      startDate = lastMonth.toISOString().split('T')[0];
      break;
    case 'year':
      const lastYear = new Date(now);
      lastYear.setFullYear(now.getFullYear() - 1);
      startDate = lastYear.toISOString().split('T')[0];
      break;
    case 'all':
    default:
      // Default to beginning of time for "all"
      startDate = '2020-01-01'; // Arbitrary past date
      break;
  }

  return { startDate, endDate };
}
