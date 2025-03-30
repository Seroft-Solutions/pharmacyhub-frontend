/**
 * Tests for Exams API Hooks
 * 
 * This module tests the exam API hooks to ensure they're properly implemented
 * and following the core API module patterns.
 */
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useExam, useExams, usePublishedExams, useExamsByStatus } from '../hooks/useExams';
import { useExamQuestions } from '../hooks/useExam';
import { useExamAttempt, useStartExamAttempt } from '../hooks/useExamAttempt';
import { apiClient } from '@/core/api/core/apiClient';
import { ExamStatus } from '../../types';

// Mock the API client
jest.mock('@/core/api/core/apiClient', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }
}));

// Setup query client wrapper for tests
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Exams API Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('useExam', () => {
    it('should fetch exam by ID', async () => {
      const mockExam = { id: 1, title: 'Test Exam' };
      (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockExam });
      
      const { result } = renderHook(() => useExam(1), { wrapper: createWrapper() });
      
      // Initial state
      expect(result.current.isLoading).toBe(true);
      
      // Wait for query to resolve
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      
      // Check the result
      expect(result.current.data).toEqual(mockExam);
      
      // Verify correct endpoint was called
      expect(apiClient.get).toHaveBeenCalledWith('/v1/exams-preparation/1');
    });
    
    it('should not fetch if examId is undefined', async () => {
      const { result } = renderHook(() => useExam(undefined), { wrapper: createWrapper() });
      
      // Initial state - should be disabled
      expect(result.current.isLoading).toBe(false);
      
      // API should not be called
      expect(apiClient.get).not.toHaveBeenCalled();
    });
  });
  
  describe('useExams', () => {
    it('should fetch exams with correct params', async () => {
      const mockExams = [{ id: 1, title: 'Test Exam 1' }, { id: 2, title: 'Test Exam 2' }];
      (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockExams });
      
      const { result } = renderHook(() => useExams({ 
        page: 2, 
        limit: 20, 
        status: ExamStatus.PUBLISHED,
        search: 'test',
        sortBy: 'title',
        sortDir: 'asc'
      }), { wrapper: createWrapper() });
      
      // Wait for query to resolve
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      
      // Check the result
      expect(result.current.data).toEqual(mockExams);
      
      // Verify correct endpoint and params were used
      expect(apiClient.get).toHaveBeenCalledWith('/v1/exams-preparation', { 
        params: { 
          page: 2, 
          limit: 20, 
          status: ExamStatus.PUBLISHED,
          search: 'test',
          sortBy: 'title',
          sortDir: 'asc'
        } 
      });
    });
  });
  
  describe('usePublishedExams', () => {
    it('should fetch published exams', async () => {
      const mockExams = [{ id: 1, title: 'Published Exam 1' }, { id: 2, title: 'Published Exam 2' }];
      (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockExams });
      
      const { result } = renderHook(() => usePublishedExams(), { wrapper: createWrapper() });
      
      // Wait for query to resolve
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      
      // Check the result
      expect(result.current.data).toEqual(mockExams);
      
      // Verify correct endpoint was called
      expect(apiClient.get).toHaveBeenCalledWith('/v1/exams-preparation/published', { 
        params: { page: 1, limit: 10 } 
      });
    });
  });
  
  describe('useExamQuestions', () => {
    it('should fetch questions for an exam', async () => {
      const mockQuestions = [
        { id: 1, text: 'Question 1' },
        { id: 2, text: 'Question 2' }
      ];
      (apiClient.get as jest.Mock).mockResolvedValueOnce({ data: mockQuestions });
      
      const { result } = renderHook(() => useExamQuestions(1), { wrapper: createWrapper() });
      
      // Wait for query to resolve
      await waitFor(() => expect(result.current.isLoading).toBe(false));
      
      // Check the result
      expect(result.current.data).toEqual(mockQuestions);
      
      // Verify correct endpoint was called
      expect(apiClient.get).toHaveBeenCalledWith('/v1/exams-preparation/1/questions');
    });
  });
  
  describe('useStartExamAttempt', () => {
    it('should start an exam attempt', async () => {
      const mockAttempt = { 
        id: 123, 
        examId: 1, 
        startTime: '2025-03-30T10:00:00Z', 
        status: 'in_progress' 
      };
      (apiClient.post as jest.Mock).mockResolvedValueOnce({ data: mockAttempt });
      
      const { result } = renderHook(() => useStartExamAttempt(), { wrapper: createWrapper() });
      
      // Execute mutation
      result.current.mutate(1);
      
      // Wait for mutation to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      
      // Check the result
      expect(result.current.data).toEqual(mockAttempt);
      
      // Verify correct endpoint was called
      expect(apiClient.post).toHaveBeenCalledWith('/v1/exams-preparation/1/start');
    });
  });
});
