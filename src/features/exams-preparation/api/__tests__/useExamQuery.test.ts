/**
 * Tests for the useExamQuery hook
 * 
 * This file tests the useExamQuery hook to ensure it properly
 * leverages the core API module and handles data fetching correctly.
 */
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useExamQuery } from '../hooks/useExamQuery';
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';

// Mock the core API module
jest.mock('@/core/api/hooks/query/useApiQuery');

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

describe('useExamQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should call useApiQuery with the correct parameters', async () => {
    // Mock the useApiQuery hook
    const mockData = { id: 1, title: 'Test Exam' };
    (useApiQuery as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      error: null,
    });
    
    // Render the hook
    const { result } = renderHook(() => useExamQuery(1), {
      wrapper: createWrapper(),
    });
    
    // Wait for the hook to resolve
    await waitFor(() => {
      expect(result.current.data).toEqual(mockData);
    });
    
    // Verify the useApiQuery was called with the correct parameters
    expect(useApiQuery).toHaveBeenCalledWith(
      expect.any(Array), // Query key
      expect.stringContaining('/v1/exams-preparation/1'), // Endpoint
      expect.objectContaining({
        enabled: true,
      })
    );
  });
  
  it('should disable the query when examId is undefined', async () => {
    // Mock the useApiQuery hook
    (useApiQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    
    // Render the hook with undefined examId
    renderHook(() => useExamQuery(undefined), {
      wrapper: createWrapper(),
    });
    
    // Verify the useApiQuery was called with enabled: false
    expect(useApiQuery).toHaveBeenCalledWith(
      expect.any(Array), // Query key
      '', // Empty endpoint when examId is undefined
      expect.objectContaining({
        enabled: false,
      })
    );
  });
  
  it('should respect the enabled option passed to the hook', async () => {
    // Mock the useApiQuery hook
    (useApiQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    
    // Render the hook with enabled: false
    renderHook(() => useExamQuery(1, { enabled: false }), {
      wrapper: createWrapper(),
    });
    
    // Verify the useApiQuery was called with enabled: false
    expect(useApiQuery).toHaveBeenCalledWith(
      expect.any(Array), // Query key
      expect.any(String), // Endpoint
      expect.objectContaining({
        enabled: false,
      })
    );
  });
});
