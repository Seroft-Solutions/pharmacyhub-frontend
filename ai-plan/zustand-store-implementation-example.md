# Zustand Store Implementation Example

This guide provides a concrete example of how to implement a Zustand store for the exam taking feature. This example can be used as a reference when implementing the other stores during Phase 3.

## Exam Taking Store Implementation

### File: src/features/exams/taking/store/examTakingStore.ts

```typescript
/**
 * Exam Taking Store
 * 
 * Manages state for the exam taking experience, including:
 * - Loading exam data
 * - Managing answers and flagged questions
 * - Handling exam navigation and submission
 * - Managing the exam timer
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import { 
  Exam, 
  Question, 
  UserAnswer, 
  FlaggedQuestion 
} from '../../core/types';
import { EXAM_TEXT } from '../../core/constants/uiConstants';
import { TAKING_EVENTS } from '../constants/takingConstants';
import { examTakingAdapter } from '../../api/services/adapters/examTakingAdapter';
import { logger } from '@/shared/lib/logger';

// State interface
interface ExamTakingState {
  // Core state
  examId: number | null;
  attemptId: number | null;
  currentExam: Exam | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<number, UserAnswer>;
  flaggedQuestions: Set<number>;
  timeRemaining: number;
  isCompleted: boolean;
  showSummary: boolean;
  examResult: any | null;
  
  // Loading states
  isLoading: boolean;
  isStarting: boolean;
  isSubmitting: boolean;
  isSaving: boolean;
  isFlagging: boolean;
  error: string | null;
  startError: Error | null;
  submitError: Error | null;
}

// Actions interface
interface ExamTakingActions {
  // Core actions
  startExam: (examId: number, userId: string) => Promise<void>;
  answerQuestion: (questionId: number, optionId: number) => void;
  flagQuestion: (questionId: number) => void;
  unflagQuestion: (questionId: number) => void;
  toggleFlagQuestion: (questionId: number) => void;
  navigateToQuestion: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  toggleSummary: () => void;
  submitExam: (options?: { onSuccess?: (data: any) => void, onError?: (error: any) => void }) => Promise<void>;
  handleTimeExpired: () => void;
  decrementTimer: () => void;
  resetExam: () => void;
  
  // Utility methods
  hasAnswer: (questionId: number) => boolean;
  isFlagged: (questionId: number) => boolean;
  getAnsweredQuestionsCount: () => number;
  getFlaggedQuestionsCount: () => number;
  getCompletionPercentage: () => number;
}

// Combined store type
export type ExamTakingStore = ExamTakingState & ExamTakingActions;

// Implementation
export const useExamTakingStore = create<ExamTakingStore>()(
  persist(
    (set, get) => ({
      // Initial state
      examId: null,
      attemptId: null,
      currentExam: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: {},
      flaggedQuestions: new Set<number>(),
      timeRemaining: 0,
      isCompleted: false,
      showSummary: false,
      examResult: null,
      
      // Loading states
      isLoading: false,
      isStarting: false,
      isSubmitting: false,
      isSaving: false,
      isFlagging: false,
      error: null,
      startError: null,
      submitError: null,
      
      // Core actions
      startExam: async (examId, userId) => {
        set({ 
          isStarting: true, 
          error: null,
          startError: null
        });
        
        try {
          // Track analytics
          if (typeof window !== 'undefined') {
            logger.trackEvent(TAKING_EVENTS.START_EXAM, { examId, userId });
          }
          
          // Fetch exam data
          const exam = await examTakingAdapter.getExamById(examId);
          if (!exam) {
            throw new Error('Exam not found');
          }
          
          // Start exam attempt
          const attempt = await examTakingAdapter.startExam(examId);
          if (!attempt) {
            throw new Error('Failed to start exam');
          }
          
          // Fetch questions
          const questions = await examTakingAdapter.getExamQuestions(examId);
          
          // Fetch flagged questions if the attempt already exists
          let flaggedQuestions = new Set<number>();
          try {
            if (attempt.id) {
              const flagged = await examTakingAdapter.getFlaggedQuestions(attempt.id);
              flaggedQuestions = new Set(flagged.map((f: FlaggedQuestion) => f.questionId));
            }
          } catch (err) {
            // Ignore errors fetching flagged questions
            console.warn('Could not fetch flagged questions', err);
          }
          
          // Set initial state
          set({
            examId,
            attemptId: attempt.id,
            currentExam: exam,
            questions,
            currentQuestionIndex: 0,
            answers: {},
            flaggedQuestions,
            timeRemaining: exam.duration * 60, // Convert minutes to seconds
            isCompleted: false,
            showSummary: false,
            examResult: null,
            isStarting: false,
            error: null,
            startError: null
          });
          
          toast.success(EXAM_TEXT.MESSAGES.EXAM_STARTED);
          return attempt;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          set({ 
            isStarting: false,
            error: errorMessage,
            startError: error instanceof Error ? error : new Error(errorMessage)
          });
          toast.error(`${EXAM_TEXT.ERRORS.FAILED_TO_START}: ${errorMessage}`);
          throw error;
        }
      },
      
      answerQuestion: (questionId, optionId) => {
        const { attemptId } = get();
        if (!attemptId) {
          toast.error('No active exam attempt');
          return;
        }
        
        set({ isSaving: true });
        
        // Track analytics
        if (typeof window !== 'undefined') {
          logger.trackEvent(TAKING_EVENTS.ANSWER_QUESTION, { questionId, optionId });
        }
        
        // Optimistically update local state
        set(state => ({
          answers: {
            ...state.answers,
            [questionId]: {
              questionId,
              selectedOption: optionId,
              timeSpent: 0 // We could track time per question in the future
            }
          }
        }));
        
        // Save to API
        examTakingAdapter.answerQuestion(attemptId, questionId, optionId)
          .then(() => {
            set({ isSaving: false });
          })
          .catch(error => {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`${EXAM_TEXT.ERRORS.FAILED_TO_SAVE_ANSWER}: ${errorMessage}`);
            
            // Rollback on error (optionally)
            // set(state => {
            //   const newAnswers = { ...state.answers };
            //   delete newAnswers[questionId];
            //   return { answers: newAnswers, isSaving: false };
            // });
            
            set({ isSaving: false });
          });
      },
      
      flagQuestion: (questionId) => {
        const { attemptId, flaggedQuestions } = get();
        if (!attemptId) {
          toast.error('No active exam attempt');
          return;
        }
        
        set({ isFlagging: true });
        
        // Track analytics
        if (typeof window !== 'undefined') {
          logger.trackEvent(TAKING_EVENTS.FLAG_QUESTION, { questionId });
        }
        
        // Optimistically update local state
        const newFlagged = new Set(flaggedQuestions);
        newFlagged.add(questionId);
        set({ flaggedQuestions: newFlagged });
        
        // Save to API
        examTakingAdapter.flagQuestion(attemptId, questionId)
          .then(() => {
            set({ isFlagging: false });
          })
          .catch(error => {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`${EXAM_TEXT.ERRORS.FAILED_TO_FLAG}: ${errorMessage}`);
            
            // Rollback on error
            const rollbackFlagged = new Set(get().flaggedQuestions);
            rollbackFlagged.delete(questionId);
            set({ 
              flaggedQuestions: rollbackFlagged,
              isFlagging: false 
            });
          });
      },
      
      unflagQuestion: (questionId) => {
        const { attemptId, flaggedQuestions } = get();
        if (!attemptId) {
          toast.error('No active exam attempt');
          return;
        }
        
        set({ isFlagging: true });
        
        // Track analytics
        if (typeof window !== 'undefined') {
          logger.trackEvent(TAKING_EVENTS.UNFLAG_QUESTION, { questionId });
        }
        
        // Optimistically update local state
        const newFlagged = new Set(flaggedQuestions);
        newFlagged.delete(questionId);
        set({ flaggedQuestions: newFlagged });
        
        // Save to API
        examTakingAdapter.unflagQuestion(attemptId, questionId)
          .then(() => {
            set({ isFlagging: false });
          })
          .catch(error => {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`${EXAM_TEXT.ERRORS.FAILED_TO_FLAG}: ${errorMessage}`);
            
            // Rollback on error
            const rollbackFlagged = new Set(get().flaggedQuestions);
            rollbackFlagged.add(questionId);
            set({ 
              flaggedQuestions: rollbackFlagged,
              isFlagging: false 
            });
          });
      },
      
      toggleFlagQuestion: (questionId) => {
        const { flaggedQuestions } = get();
        if (flaggedQuestions.has(questionId)) {
          get().unflagQuestion(questionId);
        } else {
          get().flagQuestion(questionId);
        }
      },
      
      navigateToQuestion: (index) => {
        const { questions } = get();
        if (index >= 0 && index < questions.length) {
          // Track analytics
          if (typeof window !== 'undefined') {
            logger.trackEvent(TAKING_EVENTS.NAVIGATE, { 
              from: get().currentQuestionIndex, 
              to: index 
            });
          }
          
          set({ currentQuestionIndex: index });
        }
      },
      
      nextQuestion: () => {
        const { currentQuestionIndex, questions } = get();
        if (currentQuestionIndex < questions.length - 1) {
          get().navigateToQuestion(currentQuestionIndex + 1);
        }
      },
      
      previousQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
          get().navigateToQuestion(currentQuestionIndex - 1);
        }
      },
      
      toggleSummary: () => {
        set(state => ({ showSummary: !state.showSummary }));
      },
      
      submitExam: async (options) => {
        const { attemptId, answers } = get();
        if (!attemptId) {
          const error = new Error('Cannot submit exam: No active exam attempt');
          toast.error(error.message);
          if (options?.onError) {
            options.onError(error);
          }
          return;
        }
        
        set({ 
          isSubmitting: true,
          error: null,
          submitError: null
        });
        
        // Track analytics
        if (typeof window !== 'undefined') {
          logger.trackEvent(TAKING_EVENTS.SUBMIT_EXAM, { 
            answeredCount: get().getAnsweredQuestionsCount(),
            totalQuestions: get().questions.length,
            timeRemaining: get().timeRemaining,
            completionPercentage: get().getCompletionPercentage()
          });
        }
        
        try {
          // Prepare answers array for submission
          const answersArray = Object.values(answers).map(answer => ({
            questionId: answer.questionId,
            selectedOptionId: answer.selectedOption,
            timeSpent: answer.timeSpent || 0
          }));
          
          // Submit to API
          const result = await examTakingAdapter.submitExam(attemptId, answersArray);
          
          // Update state
          set({ 
            isSubmitting: false,
            isCompleted: true,
            examResult: result,
            error: null,
            submitError: null
          });
          
          toast.success(EXAM_TEXT.MESSAGES.SUBMIT_SUCCESS);
          
          if (options?.onSuccess) {
            options.onSuccess(result);
          }
          
          return result;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          set({ 
            isSubmitting: false,
            error: errorMessage,
            submitError: error instanceof Error ? error : new Error(errorMessage)
          });
          
          toast.error(`${EXAM_TEXT.ERRORS.FAILED_TO_SUBMIT}: ${errorMessage}`);
          
          if (options?.onError) {
            options.onError(error);
          }
          
          throw error;
        }
      },
      
      handleTimeExpired: () => {
        if (get().isCompleted) return;
        
        toast.warning(EXAM_TEXT.MESSAGES.TIME_EXPIRED);
        
        // Track analytics
        if (typeof window !== 'undefined') {
          logger.trackEvent(TAKING_EVENTS.TIME_EXPIRED, {
            answeredCount: get().getAnsweredQuestionsCount(),
            totalQuestions: get().questions.length,
            completionPercentage: get().getCompletionPercentage()
          });
        }
        
        // Submit exam
        get().submitExam();
      },
      
      decrementTimer: () => {
        set(state => {
          const newTime = Math.max(0, state.timeRemaining - 1);
          
          // Check if time expired
          if (newTime === 0 && !state.isCompleted) {
            // Time just expired, handle it
            setTimeout(() => get().handleTimeExpired(), 0);
          }
          
          // Show warning when 5 minutes remaining
          if (newTime === 300 && !state.isCompleted) {
            toast.warning(EXAM_TEXT.MESSAGES.TIME_EXPIRING);
          }
          
          return { timeRemaining: newTime };
        });
      },
      
      resetExam: () => {
        set({
          examId: null,
          attemptId: null,
          currentExam: null,
          questions: [],
          currentQuestionIndex: 0,
          answers: {},
          flaggedQuestions: new Set<number>(),
          timeRemaining: 0,
          isCompleted: false,
          showSummary: false,
          examResult: null,
          isLoading: false,
          isStarting: false,
          isSubmitting: false,
          isSaving: false,
          isFlagging: false,
          error: null,
          startError: null,
          submitError: null
        });
      },
      
      // Utility methods
      hasAnswer: (questionId) => {
        return !!get().answers[questionId];
      },
      
      isFlagged: (questionId) => {
        return get().flaggedQuestions.has(questionId);
      },
      
      getAnsweredQuestionsCount: () => {
        return Object.keys(get().answers).length;
      },
      
      getFlaggedQuestionsCount: () => {
        return get().flaggedQuestions.size;
      },
      
      getCompletionPercentage: () => {
        const { answers, questions } = get();
        if (questions.length === 0) return 0;
        return (Object.keys(answers).length / questions.length) * 100;
      }
    }),
    {
      name: 'exam-taking-store',
      partialize: (state) => ({
        // Only persist these fields
        examId: state.examId,
        attemptId: state.attemptId,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        // Convert Set to Array for serialization
        flaggedQuestions: Array.from(state.flaggedQuestions),
        timeRemaining: state.timeRemaining,
        isCompleted: state.isCompleted,
        showSummary: state.showSummary,
      }),
      // Custom merge to handle the Set conversion
      merge: (persistedState, currentState) => {
        const typedPersistedState = persistedState as Partial<ExamTakingState>;
        return {
          ...currentState,
          ...typedPersistedState,
          // Convert Array back to Set
          flaggedQuestions: typedPersistedState.flaggedQuestions
            ? new Set(typedPersistedState.flaggedQuestions as unknown as number[])
            : new Set<number>(),
        };
      },
    }
  )
);

// Export selectors for common derived state
export const selectCurrentQuestion = (state: ExamTakingStore) => 
  state.questions[state.currentQuestionIndex];

export const selectAnsweredQuestionsCount = (state: ExamTakingStore) => 
  Object.keys(state.answers).length;

export const selectFlaggedQuestionsCount = (state: ExamTakingStore) => 
  state.flaggedQuestions.size;

export const selectCompletionPercentage = (state: ExamTakingStore) => 
  state.questions.length === 0 ? 0 : (Object.keys(state.answers).length / state.questions.length) * 100;

// Default export
export default useExamTakingStore;
```

## Using the Store in Components

Here's an example of how to use this store in a component:

### File: src/features/exams/taking/components/ExamSession.tsx

```tsx
"use client";

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useExamTakingStore, selectCurrentQuestion } from '../store/examTakingStore';
import { ExamStart } from './ExamStart';
import { ExamQuestions } from './ExamQuestions';
import { ExamSummary } from './ExamSummary';
import { ExamResults } from '../../review/components/ExamResults';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ExamSessionProps {
  examId: number;
  userId: string;
  onExit?: () => void;
}

export const ExamSession: React.FC<ExamSessionProps> = ({ 
  examId, 
  userId, 
  onExit 
}) => {
  // Get state from store
  const {
    currentExam,
    attemptId,
    isLoading,
    isStarting,
    error,
    startError,
    isCompleted,
    showSummary,
    examResult,
    startExam,
    resetExam
  } = useExamTakingStore();

  // Setup timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      useExamTakingStore.getState().decrementTimer();
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Reset exam on unmount
  useEffect(() => {
    return () => {
      resetExam();
    };
  }, [resetExam]);

  // Handle exam start
  const handleStartExam = () => {
    startExam(examId, userId);
  };

  // Handle return to dashboard
  const handleReturnToDashboard = () => {
    resetExam();
    
    if (onExit) {
      onExit();
    } else {
      // Fallback navigation if onExit isn't provided
      window.location.href = '/dashboard';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  // If exam completed, show results
  if (isCompleted && examResult) {
    return (
      <ExamResults 
        result={examResult}
        onBackToDashboard={handleReturnToDashboard}
      />
    );
  }

  // Show exam summary
  if (showSummary) {
    return <ExamSummary />;
  }

  // Not started - show start screen
  if (!attemptId && !isStarting) {
    return (
      <ExamStart 
        examId={examId} 
        exam={currentExam}
        onStartExam={handleStartExam}
        error={startError}
        isStarting={isStarting}
      />
    );
  }

  // Main exam questions view
  return <ExamQuestions onExit={onExit} />;
};

export default ExamSession;
```

## Key Points about Zustand Implementation

1. **State and Actions Separation**
   - Clearly separate state and actions for better type checking
   - Export a combined type for use in components

2. **Persistence**
   - Use the persist middleware for persisting state
   - Only persist essential fields with partialize
   - Handle special types like Set with custom merge

3. **Error Handling**
   - Track specific error states (startError, submitError)
   - Provide user feedback with toast messages
   - Implement rollback for optimistic updates

4. **Analytics**
   - Track events at appropriate points
   - Include relevant context with events

5. **Selectors**
   - Export selectors for derived state
   - Use selectors to optimize component renders

6. **Side Effects**
   - Manage side effects like API calls in action creators
   - Handle loading states properly

7. **Reset Functionality**
   - Provide a reset method to clear state
   - Use reset when unmounting components

This example demonstrates a complete Zustand store implementation that follows best practices and can be used as a template for other stores in the refactoring.
