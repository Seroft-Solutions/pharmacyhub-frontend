/**
 * ExamFilter context for managing filter state in exams listings
 * 
 * Uses the core context factory to create a context provider for exam filters.
 */

import { ReactNode } from 'react';
import { createContextProvider, withContextProvider } from '@/core/state';
import { ExamFilters } from '../../types/state/exam-state';
import logger from '@/core/utils/logger';

/**
 * Create the exam filter context provider using core context factory
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
    setFilter: (key, value) => {
      logger.debug(`Setting ${String(key)} filter to:`, value);
      setState((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    },
    
    // Clear all filters
    clearFilters: () => {
      logger.debug('Clearing all exam filters');
      setState({});
    },
  }),
  {
    displayName: 'ExamFilterContext',
  }
);

/**
 * Higher-order component that provides exam filter context
 * Uses the core withContextProvider utility
 */
export const withExamFilters = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & { initialFilters?: Partial<ExamFilters> }> => {
  // Use the withContextProvider utility from core
  const WithProvider = withContextProvider<P, ExamFilters>(
    ExamFilterProvider as React.FC<{ children: ReactNode; initialState?: Partial<ExamFilters> }>,
  );
  
  // Return component with initialFilters handling
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
