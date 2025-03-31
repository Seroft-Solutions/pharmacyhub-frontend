/**
 * Exams Preparation Stores
 * 
 * This module exports all stores and their associated selectors for the exams-preparation feature.
 * It provides a clean interface for accessing exam-related state through a single import.
 * 
 * Stores follow the feature-specific store pattern and leverage the core store factory for
 * consistent implementation and integration with core modules.
 * 
 * @example Basic usage
 * ```tsx
 * import { useExamStore, useCurrentQuestion } from '@/features/exams-preparation/state';
 * 
 * function ExamQuestion() {
 *   // Get data with store
 *   const examData = useExamStore(state => state.exam);
 *   
 *   // Or use an optimized selector
 *   const currentQuestion = useCurrentQuestion();
 *   
 *   return (
 *     <div>
 *       <h1>{examData.title}</h1>
 *       <Question data={currentQuestion} />
 *     </div>
 *   );
 * }
 * ```
 */

// Export the exam store and its selectors
export {
  // Store
  useExamStore,
  // Selectors
  useExamId,
  useAttemptId,
  useCurrentQuestion,
  useExamProgress,
  useExamTimer,
  useExamNavigation,
} from './examStore';

// Export the exam editor store and its selectors
export {
  // Store
  examEditorStore,
  useExamEditorStore,
  // Selectors
  useCurrentQuestionIndex,
  useIsDirty,
  useQuestions,
  useValidation,
  useExam,
  useCurrentQuestion as useEditorCurrentQuestion,
  useCanUndo,
  useCanRedo,
  useQuestionValidation,
  useExamValidation,
  useTotalQuestionsCount,
  useTotalPoints,
} from './examEditorStore';

// Export the exam attempt store and its selectors
export {
  // Store
  useExamAttemptStore,
  // Selectors
  useAttemptStatus,
  useAttemptAnswers,
  useAttemptProgress,
  useCurrentAttemptQuestion,
} from './examAttemptStore';

// Export the exam preparation store and its selectors
export {
  // Store
  useExamPreparationStore,
  // Selectors
  useAvailableExams,
  useIsLoading,
  useError,
} from './examPreparationStore';
