/**
 * ExamFilter context for managing filter state in exams listings
 */

import { ReactNode } from 'react';
import { ExamFilters, ExamFilterContextType } from '../../types/state/exam-state';
import { createContextProvider } from '../contextFactory';

/**
 * Create the exam filter context provider using our context factory
 */
export const [ExamFilterProvider, useExamFilter] = createContextProvider<
  ExamFilters, 
  {
    setFilter: <K extends keyof ExamFilters>(key: K, value: ExamFilters[K]) => void;
    clearFilters: () => void;
  }
>(
  'ExamFilter', // Context name
  {}, // Initial state - empty filters
  (setState) => ({
    // Set a specific filter
    setFilter: (key, value) => setState((prevState) => ({
      ...prevState,
      [key]: value,
    })),
    
    // Clear all filters
    clearFilters: () => setState({}),
  }),
  {
    displayName: 'ExamFilterContext',
  }
);

/**
 * Higher-order component that provides exam filter context
 */
export const withExamFilters = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & { initialFilters?: Partial<ExamFilters> }> => {
  return ({ initialFilters, ...props }) => (
    <ExamFilterProvider initialState={initialFilters}>
      <Component {...props as P} />
    </ExamFilterProvider>
  );
};

/**
 * Utility hook to check if any filters are applied
 */
export const useHasActiveFilters = (): boolean => {
  const filters = useExamFilter();
  return Object.keys(filters).some(key => 
    key !== 'setFilter' && key !== 'clearFilters' && filters[key as keyof ExamFilters] !== undefined
  );
};

/**
 * Example usage of the ExamFilterContext:
 * 
 * ```tsx
 * const ExamsList = () => {
 *   const { status, search, difficulty, isPremium, setFilter, clearFilters } = useExamFilter();
 *   
 *   // Use filters in query
 *   const { data, isLoading } = useExamsQuery({
 *     status,
 *     search,
 *     difficulty,
 *     isPremium,
 *   });
 *   
 *   // Handle filter changes
 *   const handleStatusChange = (status: string) => {
 *     setFilter('status', status);
 *   };
 *   
 *   // Handle clear filters
 *   const handleClearFilters = () => {
 *     clearFilters();
 *   };
 *   
 *   // Render UI with filters and data
 * };
 * ```
 */
