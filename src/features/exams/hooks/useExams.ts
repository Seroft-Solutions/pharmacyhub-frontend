import { useMemo } from 'react';
import { examApiHooks } from '../api/hooks';
import { Exam } from '../types';

/**
 * Custom hook to handle exam data from ApiResponse structure
 * Properly extracts exam array from the ApiResponse wrapper
 */
export const useExams = () => {
  const { 
    data: apiResponse, 
    isLoading, 
    error,
    refetch
  } = examApiHooks.useList();

  // Extract exams from API response
  const exams = useMemo(() => {
    if (!apiResponse) return [];
    
    // Handle case where backend returns "date" instead of "data" (typo in API)
    if (apiResponse.date && Array.isArray(apiResponse.date)) {
      return apiResponse.date;
    }
    
    // Handle standard case where backend returns "data"
    if (apiResponse.data && Array.isArray(apiResponse.data)) {
      return apiResponse.data;
    }
    
    // If apiResponse is already an array (perhaps the hook unwrapped it)
    if (Array.isArray(apiResponse)) {
      return apiResponse;
    }
    
    // Default to empty array if data cannot be extracted
    return [];
  }, [apiResponse]);

  return { exams, isLoading, error, refetch };
};
