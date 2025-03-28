import { apiClient } from '@/features/core/app-api-handler/core/apiClient';

// Define interface for the progress data
export interface Progress {
  completedExams: number;
  inProgressExams: number;
  averageScore: number;
  totalTimeSpent: number;
  // Add other fields as needed
}

// Define interface for analytics data
export interface Analytics {
  studyHours: Array<{date: string; hours: number}>;
  examScores: Array<{id: number; name: string; score: number; average: number; date: string}>;
  timeSpent: Record<string, number>;
  // Add other fields as needed
}

// Define interface for recommendations
export interface Recommendation {
  id: string;
  title: string;
  type: 'exam' | 'course' | 'resource';
  confidence: number;
  tags: string[];
  // Add other fields as needed
}

const BASE_PATH = '/progress';

export const progressApi = {
  /**
   * Get user progress data
   */
  getUserProgress: async (userId: string): Promise<Progress> => {
    const response = await apiClient.get<Progress>(`${BASE_PATH}/${userId}`);
    if (response.error) throw response.error;
    if (!response.data) throw new Error('Progress data not found');
    return response.data;
  },

  /**
   * Get user analytics data
   */
  getAnalytics: async (
    userId: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<Analytics> => {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    
    const endpoint = `/analytics/${userId}?${queryParams.toString()}`;
    const response = await apiClient.get<Analytics>(endpoint);
    if (response.error) throw response.error;
    if (!response.data) throw new Error('Analytics data not found');
    return response.data;
  },

  /**
   * Get personalized recommendations for user
   */
  getRecommendations: async (userId: string): Promise<Recommendation[]> => {
    const response = await apiClient.get<Recommendation[]>(`/recommendations/${userId}`);
    if (response.error) throw response.error;
    return response.data || [];
  }
};
