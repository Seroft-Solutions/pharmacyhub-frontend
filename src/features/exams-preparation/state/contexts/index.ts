/**
 * Exams Preparation Contexts
 * 
 * This module exports React Context providers and hooks for the exams-preparation feature.
 * All contexts follow the feature-specific context factory pattern to ensure consistency
 * and leverage core state management utilities.
 */

// Export ExamFilter context
export {
  ExamFilterProvider,
  useExamFilter,
  useHasActiveFilters,
  useFilterValues,
  withExamFilters,
} from './ExamFilterContext';

// Export other contexts as they are implemented
export {
  ExamSessionProvider,
  useExamSession,
} from './ExamSessionContext';

export {
  QuestionProvider,
  useQuestion,
} from './QuestionContext';

export {
  TimerProvider,
  useTimer,
} from './TimerContext';
