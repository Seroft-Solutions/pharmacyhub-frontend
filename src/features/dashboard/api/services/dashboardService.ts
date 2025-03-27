'use client';

/**
 * Dashboard API Service
 * 
 * This service integrates with the TanStack Query API to provide dashboard data.
 * It serves as a wrapper around the progress API and falls back to mock data when needed.
 */

import { Progress, Analytics, Recommendation } from '@/features/exams/progress/api/progressApi';
import { apiClient } from '@/features/core/tanstack-query-api/core/apiClient';
import { getMockUserProgress, getMockAnalytics, getMockRecommendations } from '../mockBackend';
import { logger } from '@/shared/lib/logger';

// Use real backend data
const USE_MOCK_DATA = false;

/**
 * Dashboard API Service functions
 */
export const dashboardService = {
  /**
   * Get user progress data, with fallback to mock data
   */
  getUserProgress: async (userId: string): Promise<Progress> => {
    if (!USE_MOCK_DATA) {
      try {
        const response = await apiClient.get<Progress>(`/progress/${userId}`);
        return response.data;
      } catch (error) {
        logger.warn('Failed to fetch progress data from API, using mock data:', error);
        // Fall back to mock data
        return getMockUserProgress(userId);
      }
    }
    
    // Use mock data directly
    return getMockUserProgress(userId);
  },

  /**
   * Get user analytics data, with fallback to mock data
   */
  getUserAnalytics: async (
    userId: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<Analytics> => {
    if (!USE_MOCK_DATA) {
      try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        
        const endpoint = `/analytics/${userId}?${queryParams.toString()}`;
        const response = await apiClient.get<Analytics>(endpoint);
        return response.data;
      } catch (error) {
        logger.warn('Failed to fetch analytics data from API, using mock data:', error);
        // Fall back to mock data
        return getMockAnalytics(userId, startDate, endDate);
      }
    }
    
    // Use mock data directly
    return getMockAnalytics(userId, startDate, endDate);
  },

  /**
   * Get personalized recommendations for user, with fallback to mock data
   */
  getUserRecommendations: async (userId: string): Promise<Recommendation[]> => {
    if (!USE_MOCK_DATA) {
      try {
        const response = await apiClient.get<Recommendation[]>(`/recommendations/${userId}`);
        return response.data;
      } catch (error) {
        logger.warn('Failed to fetch recommendations from API, using mock data:', error);
        // Fall back to mock data
        return getMockRecommendations(userId);
      }
    }
    
    // Use mock data directly
    return getMockRecommendations(userId);
  }
};

export default dashboardService;