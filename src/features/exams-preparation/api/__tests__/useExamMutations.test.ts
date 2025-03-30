/**
 * Tests for the exam mutation hooks
 * 
 * This file tests the exam mutation hooks to ensure they properly
 * leverage the core API module and handle data mutations correctly.
 */
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateExamMutation, useUpdateExamMutation, useDeleteExamMutation } from '../hooks/useExamMutations';
import { useApiMutation } from '@/core/api/hooks/mutation/useApiMutation';

// Mock the core API module
jest.mock('@/core/api/hooks/mutation/useApiMutation');

// Create a wrapper with QueryClientProvider
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

describe('Exam Mutation Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('useCreateExamMutation', () => {
    it('should call useApiMutation with the correct parameters', () => {
      // Mock the useApiMutation hook
      const mockMutate = jest.fn();
      (useApiMutation as jest.Mock).mockReturnValue({
        mutate: mockMutate,
        isLoading: false,
        error: null,
      });
      
      // Render the hook
      const { result } = renderHook(() => useCreateExamMutation(), {
        wrapper: createWrapper(),
      });
      
      // Verify the hook returns the expected values
      expect(result.current.mutate).toBe(mockMutate);
      
      // Verify useApiMutation was called with the correct parameters
      expect(useApiMutation).toHaveBeenCalledWith(
        expect.stringContaining('/v1/exams-preparation'), // Endpoint
        expect.objectContaining({
          onSuccess: expect.any(Function)
        })
      );
    });
  });
  
  describe('useUpdateExamMutation', () => {
    it('should call useApiMutation with the correct parameters', () => {
      // Mock the useApiMutation hook
      const mockMutate = jest.fn();
      (useApiMutation as jest.Mock).mockReturnValue({
        mutate: mockMutate,
        isLoading: false,
        error: null,
      });
      
      // Render the hook
      const { result } = renderHook(() => useUpdateExamMutation(), {
        wrapper: createWrapper(),
      });
      
      // Verify the hook returns the expected values
      expect(result.current.mutate).toBe(mockMutate);
      
      // Verify useApiMutation was called with the correct parameters
      expect(useApiMutation).toHaveBeenCalledWith(
        expect.any(Function), // Endpoint function
        expect.objectContaining({
          method: 'PUT',
          onSuccess: expect.any(Function)
        })
      );
    });
  });
  
  describe('useDeleteExamMutation', () => {
    it('should call useApiMutation with the correct parameters', () => {
      // Mock the useApiMutation hook
      const mockMutate = jest.fn();
      (useApiMutation as jest.Mock).mockReturnValue({
        mutate: mockMutate,
        isLoading: false,
        error: null,
      });
      
      // Render the hook
      const { result } = renderHook(() => useDeleteExamMutation(), {
        wrapper: createWrapper(),
      });
      
      // Verify the hook returns the expected values
      expect(result.current.mutate).toBe(mockMutate);
      
      // Verify useApiMutation was called with the correct parameters
      expect(useApiMutation).toHaveBeenCalledWith(
        expect.any(Function), // Endpoint function
        expect.objectContaining({
          method: 'DELETE',
          onSuccess: expect.any(Function)
        })
      );
    });
  });
});
