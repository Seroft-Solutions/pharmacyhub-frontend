// API client with error handling and caching
import { QueryClient } from '@tanstack/react-query';

const BASE_URL = '/api';

// Error types
export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

// Create Query Client for caching
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
      cacheTime: 30 * 60 * 1000, // Cache data for 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// API client with error handling
class APIClient {
  private async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new APIError(
        response.status,
        error.message || 'An unexpected error occurred'
      );
    }

    return response.json();
  }

  // Exam endpoints
  async getExam(examId: string) {
    return this.fetch(`/exams/${examId}`);
  }

  async getExamQuestions(examId: string) {
    return this.fetch(`/exams/${examId}/questions`);
  }

  async startExam(examId: string, userId: string) {
    return this.fetch(`/exams/${examId}/start`, {
      method: 'POST',
      headers: {
        userId,
      },
    });
  }

  async submitExam(examId: string, userId: string, answers: any[]) {
    return this.fetch(`/exams/${examId}/submit`, {
      method: 'POST',
      headers: {
        userId,
      },
      body: JSON.stringify(answers),
    });
  }

  // User progress endpoints
  async getUserProgress(userId: string) {
    return this.fetch(`/progress/${userId}`);
  }

  async getAnalytics(userId: string, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return this.fetch(`/analytics/${userId}?${params}`);
  }

  async getRecommendations(userId: string) {
    return this.fetch(`/recommendations/${userId}`);
  }
}

export const api = new APIClient();