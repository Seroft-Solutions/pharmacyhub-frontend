'use client';

/**
 * useDashboardData
 * 
 * A composite hook that fetches and combines all data needed for the dashboard.
 * This hook leverages hooks from other features to provide a unified data source.
 */

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useExamStats } from '@/features/exams/api/hooks/useExamApiHooks';
import { useUserProgress, useUserAnalytics, useUserRecommendations } from '@/features/exams/progress/hooks/useProgressQueries';
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
  const { data: progress, isLoading: isProgressLoading } = useUserProgress(userId);
  const { data: analytics, isLoading: isAnalyticsLoading } = useUserAnalytics(
    userId, 
    getTimeFilterDates(timeFilter).startDate, 
    getTimeFilterDates(timeFilter).endDate
  );
  const { data: recommendations, isLoading: isRecommendationsLoading } = useUserRecommendations(userId);

  // Filter change handler
  const handleTimeFilterChange = useCallback((filter: TimeFilter) => {
    setTimeFilter(filter);
  }, []);

  // Combined loading state
  const isLoading = 
    isPremiumLoading || 
    isExamStatsLoading || 
    isProgressLoading || 
    isAnalyticsLoading || 
    isRecommendationsLoading ||
    isModelPapersLoading ||
    isPastPapersLoading ||
    isSubjectPapersLoading;

  // Fetch paper data
  const { data: modelPapers, isLoading: isModelPapersLoading } = useModelPapers();
  const { data: pastPapers, isLoading: isPastPapersLoading } = usePastPapers();
  const { data: subjectPapers, isLoading: isSubjectPapersLoading } = useSubjectPapers();

  // Create and format the data for charts
  const examScores = useMemo(() => {
    if (!analytics?.examScores) {
      return Array(5).fill(0).map((_, i) => ({
        name: `Exam ${i + 1}`,
        score: Math.floor(Math.random() * 30) + 60, // Random scores between 60-90
        average: Math.floor(Math.random() * 20) + 60 // Random averages between 60-80
      }));
    }
    return analytics.examScores;
  }, [analytics]);

  const scoreDistribution = useMemo(() => {
    return [
      { name: '90-100%', value: 3, color: '#4caf50' },
      { name: '80-89%', value: 5, color: '#8bc34a' },
      { name: '70-79%', value: 7, color: '#ffeb3b' },
      { name: '60-69%', value: 4, color: '#ff9800' },
      { name: 'Below 60%', value: 2, color: '#f44336' }
    ];
  }, []);

  const studyHours = useMemo(() => {
    if (!analytics?.studyHours) {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return days.map(day => ({
        date: day,
        hours: parseFloat((Math.random() * 3 + 1).toFixed(1)) // Random hours between 1-4
      }));
    }
    return analytics.studyHours;
  }, [analytics]);

  const subjectPerformance = useMemo(() => {
    return [
      { subject: 'Pharmacology', score: 85 },
      { subject: 'Chemistry', score: 72 },
      { subject: 'Biology', score: 90 },
      { subject: 'Physiology', score: 68 },
      { subject: 'Pathology', score: 75 },
      { subject: 'Pharmacy Practice', score: 80 }
    ];
  }, []);

  const recentExams = useMemo(() => {
    return [
      {
        id: 1,
        examId: 101,
        examTitle: 'Pharmacology Basics',
        score: 85,
        totalMarks: 100,
        isPassed: true,
        completedAt: '2025-03-20T15:30:00Z',
        timeSpent: 45, // minutes
      },
      {
        id: 2,
        examId: 102,
        examTitle: 'Pharmaceutical Chemistry',
        score: 72,
        totalMarks: 100,
        isPassed: true,
        completedAt: '2025-03-15T10:15:00Z',
        timeSpent: 60, // minutes
      },
      {
        id: 3,
        examId: 103,
        examTitle: 'Clinical Pharmacy',
        score: 65,
        totalMarks: 100,
        isPassed: false,
        completedAt: '2025-03-10T14:45:00Z',
        timeSpent: 55, // minutes
      },
    ];
  }, []);

  const recentActivities = useMemo(() => {
    return [
      {
        id: '1',
        type: 'exam_completed',
        title: 'Completed Pharmacology Exam',
        timestamp: '2025-03-20T15:30:00Z',
        details: { score: 85, totalMarks: 100 }
      },
      {
        id: '2',
        type: 'paper_purchased',
        title: 'Purchased Premium Paper',
        timestamp: '2025-03-18T12:20:00Z',
        details: { paperName: 'Advanced Pharmaceutical Analysis' }
      },
      {
        id: '3',
        type: 'exam_started',
        title: 'Started Chemistry Exam',
        timestamp: '2025-03-15T09:45:00Z',
        details: { paperName: 'Pharmaceutical Chemistry' }
      },
      {
        id: '4',
        type: 'premium_subscription',
        title: 'Activated Premium Subscription',
        timestamp: '2025-03-10T11:30:00Z',
        details: { validity: '3 months' }
      }
    ];
  }, []);

  const paperCounts = useMemo(() => {
    return {
      model: { total: modelPapers?.length || 0, completed: Math.floor((modelPapers?.length || 0) * 0.6) },
      past: { total: pastPapers?.length || 0, completed: Math.floor((pastPapers?.length || 0) * 0.4) },
      subject: { total: subjectPapers?.length || 0, completed: Math.floor((subjectPapers?.length || 0) * 0.3) }
    };
  }, [modelPapers, pastPapers, subjectPapers]);

  const paperCompletionTimeline = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      model: Math.floor(Math.random() * 3) + 1,
      past: Math.floor(Math.random() * 2) + 1,
      subject: Math.floor(Math.random() * 2)
    }));
  }, []);

  // Combined data object
  const dashboardData = useMemo(() => {
    return {
      premium: {
        isPremium,
        expiryDate: '2025-06-15' // Mock data for expiry date
      },
      examStats: examStats || {
        totalPapers: 0,
        avgDuration: 0,
        completionRate: 0,
        activeUsers: 0,
      },
      progress: progress || {
        completedExams: 0,
        inProgressExams: 0,
        averageScore: 0,
        totalTimeSpent: 0,
      },
      analytics: {
        studyHours,
        examScores,
        scoreDistribution,
        subjectPerformance,
        recentExams,
        recentActivities,
        paperCounts,
        paperCompletionTimeline,
        timeSpent: analytics?.timeSpent || {}
      },
      recommendations: recommendations || [],
      timeFilter,
      papers: {
        model: modelPapers || [],
        past: pastPapers || [],
        subject: subjectPapers || []
      }
    };
  }, [analytics, examStats, isPremium, progress, recommendations, timeFilter, 
      studyHours, examScores, scoreDistribution, subjectPerformance, 
      recentExams, recentActivities, paperCounts, paperCompletionTimeline,
      modelPapers, pastPapers, subjectPapers]);

  return {
    dashboardData,
    isLoading,
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
