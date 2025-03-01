import { 
  useApiQuery, 
  ApiResponse,
  apiQueryKeys 
} from '@/lib/api';
import { apiClient } from '@/lib/api/apiClient';
import { UseApiQueryOptions } from '@/lib/api/hooks';

/**
 * Dashboard statistics interface
 */
export interface DashboardStats {
  recentExams: {
    id: string;
    title: string;
    completedDate: string;
    score: number;
    passingScore: number;
    passed: boolean;
  }[];
  examProgress: {
    total: number;
    completed: number;
    inProgress: number;
    passed: number;
    failed: number;
  };
  performanceByCategory: {
    categoryName: string;
    attemptedQuestions: number;
    correctAnswers: number;
    score: number;
  }[];
  studyTime: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
  upcomingDeadlines: {
    id: string;
    title: string;
    type: 'EXAM' | 'ASSIGNMENT' | 'DEADLINE';
    dueDate: string;
    daysLeft: number;
  }[];
  leaderboard: {
    userId: string;
    userName: string;
    score: number;
    rank: number;
  }[];
}

/**
 * Fetch dashboard statistics
 */
async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return apiClient.get<DashboardStats>('/dashboard/stats');
}

/**
 * Hook for fetching dashboard statistics
 */
export function useDashboardStats(
  options?: UseApiQueryOptions<DashboardStats>
) {
  return useApiQuery<DashboardStats>(
    apiQueryKeys.dashboard.stats(),
    '/dashboard/stats',
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options
    }
  );
}

/**
 * Progress timeline interface
 */
export interface ProgressTimeline {
  timeline: {
    date: string;
    exams: {
      id: string;
      title: string;
      score: number;
      passed: boolean;
    }[];
    studyTime: number; // in minutes
  }[];
  totalStudyTime: number;
  averageScore: number;
  examsTaken: number;
  examsPassed: number;
}

/**
 * Fetch progress timeline
 */
async function getProgressTimeline(
  period: 'week' | 'month' | 'year' = 'month'
): Promise<ApiResponse<ProgressTimeline>> {
  return apiClient.get<ProgressTimeline>(`/dashboard/timeline?period=${period}`);
}

/**
 * Hook for fetching progress timeline
 */
export function useProgressTimeline(
  period: 'week' | 'month' | 'year' = 'month',
  options?: UseApiQueryOptions<ProgressTimeline>
) {
  return useApiQuery<ProgressTimeline>(
    apiQueryKeys.dashboard.timeline(period),
    `/dashboard/timeline?period=${period}`,
    {
      staleTime: 15 * 60 * 1000, // 15 minutes
      ...options
    }
  );
}

/**
 * Recommendations interface
 */
export interface Recommendations {
  recommendedExams: {
    id: string;
    title: string;
    difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    category: string;
    reason: string;
  }[];
  recommendedTopics: {
    topic: string;
    category: string;
    reason: string;
    resources: {
      title: string;
      type: 'VIDEO' | 'ARTICLE' | 'QUIZ';
      url?: string;
      id?: string;
    }[];
  }[];
}

/**
 * Fetch personalized recommendations
 */
async function getRecommendations(): Promise<ApiResponse<Recommendations>> {
  return apiClient.get<Recommendations>('/dashboard/recommendations');
}

/**
 * Hook for fetching personalized recommendations
 */
export function useRecommendations(
  options?: UseApiQueryOptions<Recommendations>
) {
  return useApiQuery<Recommendations>(
    apiQueryKeys.dashboard.recommendations(),
    '/dashboard/recommendations',
    {
      staleTime: 60 * 60 * 1000, // 1 hour
      ...options
    }
  );
}

// Define dashboard-specific query keys
apiQueryKeys.dashboard = {
  stats: () => ['dashboard', 'stats'],
  timeline: (period: string) => ['dashboard', 'timeline', period],
  recommendations: () => ['dashboard', 'recommendations'],
};

// Export the API methods
export const dashboardApi = {
  getDashboardStats,
  getProgressTimeline,
  getRecommendations,
};

export default dashboardApi;
