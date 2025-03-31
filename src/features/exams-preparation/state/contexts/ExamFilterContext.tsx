/**
 * ExamFilter Context
 * 
 * A context for managing filter state in exams listings. 
 * Uses the feature-specific context factory that builds on core state management patterns.
 * 
 * This provides filter functionality with enhanced error handling, performance optimization,
 * and better debugging capabilities compared to the core context factory.
 * 
 * Features:
 * - Type-safe filter management
 * - Memoized context value for optimal renders
 * - Comprehensive error handling and recovery
 * - Performance monitoring (in development)
 * - DevTools integration
 * - Example documentation
 */

import { ReactNode, useMemo } from 'react';
import { createExamsContext, withExamsContext, ExamsContextOptions } from '../contextFactory';
import { ExamFilters } from '../../types/state/exam-state';
import logger from '@/core/utils/logger';

/**
 * Actions interface for the ExamFilter context
 */
interface ExamFilterActions {
  /**
   * Set a specific filter value
   * @param key The filter key to set
   * @param value The value to set for the filter
   */
  setFilter: <K extends keyof ExamFilters>(key: K, value: ExamFilters[K]) => void;
  
  /**
   * Clear all filters, resetting to empty state
   */
  clearFilters: () => void;
}

/**
 * Configuration options for the ExamFilter context
 */
const contextOptions: ExamsContextOptions = {
  displayName: 'ExamFilterContext',
  debug: process.env.NODE_ENV === 'development',
  memoize: true,
  errorBoundary: true,
  devTools: process.env.NODE_ENV === 'development',
  trackPerformance: process.env.NODE_ENV === 'development',
  logLevel: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
};

/**
 * Create the exam filter context using the feature-specific context factory
 * This enhances the basic context with error handling, performance optimization,
 * and better debugging capabilities.
 */
export const [ExamFilterProvider, useExamFilter, createExamFilterSelector] = createExamsContext<
  ExamFilters, 
  ExamFilterActions
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
  contextOptions
);

/**
 * Higher-order component that provides exam filter context
 * Uses the feature-specific withExamsContext utility for enhanced error handling
 * 
 * @example
 * ```tsx
 * // Wrap a component with exam filters
 * const EnhancedComponent = withExamFilters(MyComponent);
 * 
 * // Use with initial filters
 * <EnhancedComponent initialFilters={{ status: 'active' }} />
 * ```
 */
export const withExamFilters = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & { initialFilters?: Partial<ExamFilters> }> => {
  // Use the enhanced withExamsContext HOC
  const EnhancedComponent = withExamsContext<P, ExamFilters>(
    ExamFilterProvider
  )(Component);
  
  // Return component with initialFilters handling
  const WithFilters: React.FC<P & { initialFilters?: Partial<ExamFilters> }> = ({ 
    initialFilters, 
    ...props 
  }) => (
    <ExamFilterProvider initialState={initialFilters}>
      <Component {...props as P} />
    </ExamFilterProvider>
  );
  
  // Set display name for better debugging
  WithFilters.displayName = `withExamFilters(${Component.displayName || Component.name || 'Component'})`;
  
  return WithFilters;
};

/**
 * Optimized selector to check if any filters are applied
 * Prevents unnecessary rerenders when other parts of filter state change
 * 
 * @returns Boolean indicating if any filters are currently applied
 * 
 * @example
 * ```tsx
 * function FilterIndicator() {
 *   const hasFilters = useHasActiveFilters();
 *   return hasFilters ? <Badge>Filtered</Badge> : null;
 * }
 * ```
 */
export const useHasActiveFilters = createExamFilterSelector((filters) => {
  return Object.keys(filters).some(key => {
    return (
      key !== 'setFilter' && 
      key !== 'clearFilters' && 
      filters[key as keyof ExamFilters] !== undefined
    );
  });
});

/**
 * Selector for getting filter values only (without actions)
 * Optimizes renders when only actions change but filter values remain the same
 * 
 * @returns Object containing only the filter values
 */
export const useFilterValues = createExamFilterSelector((filters) => {
  const filterValues = { ...filters };
  
  // Remove actions from the filter values
  delete filterValues.setFilter;
  delete filterValues.clearFilters;
  
  return filterValues as Omit<typeof filters, 'setFilter' | 'clearFilters'>;
});

/**
 * Example usage of the ExamFilterContext:
 * 
 * ```tsx
 * const ExamsList = () => {
 *   // Option 1: Get everything (filters and actions)
 *   const { status, search, difficulty, isPremium, setFilter, clearFilters } = useExamFilter();
 *   
 *   // Option 2: Use optimized selectors for better performance
 *   const filterValues = useFilterValues(); // Only filter values, no actions
 *   const hasActiveFilters = useHasActiveFilters(); // Only boolean, doesn't rerender when filters change values
 *   const { setFilter, clearFilters } = useExamFilter(); // Get only the actions
 *   
 *   // Use filters in query
 *   const { data, isLoading } = useExamsQuery(filterValues);
 *   
 *   // Handle filter changes
 *   const handleStatusChange = (status: string) => {
 *     setFilter('status', status);
 *   };
 *   
 *   // Show filter indicator
 *   return (
 *     <div>
 *       <div className="filters">
 *         {hasActiveFilters && (
 *           <Button onClick={clearFilters}>Clear Filters</Button>  
 *         )}
 *         <Select value={status} onChange={handleStatusChange}>
 *           <option value="">All Status</option>
 *           <option value="active">Active</option>
 *           <option value="completed">Completed</option>
 *         </Select>
 *         {/* Other filter controls */}
 *       </div>
 *       
 *       {isLoading ? (
 *         <Loading />
 *       ) : (
 *         <ExamsGrid exams={data} />
 *       )}
 *     </div>
 *   );
 * };
 * ```
 */
