/**
 * Store for managing exam attempt state
 */

import { Exam, ExamAnswer, Question } from '../../types/models/exam';
import { ExamAttemptState } from '../../types/state/exam-state';
import { createStore, createSelectors } from '../storeFactory';
import { getDefaultAnswerForQuestion, isAnswerComplete } from '../../types/utils/type-utils';

// For demo purposes - in a real implementation, these would be imported from core API module
const mockSubmitExam = async (examId: number, answers: Record<number, ExamAnswer>, timeSpent: number) => {
  console.log('Submitting exam:', { examId, answers, timeSpent });
  // Simulate API call
  return new Promise<boolean>((resolve) => {
    setTimeout(() => resolve(true), 1000);
  });
};

// For demo purposes - in a real implementation, this would make an actual API call to get questions
const mockFetchQuestions = async (examId: number): Promise<Question[]> => {
  console.log('Fetching questions for exam:', examId);
  // Simulate API call
  return new Promise<Question[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          examId,
          text: 'What is the primary function of a compiler?',
          type: 'multipleChoice',
          orderIndex: 0,
          pointValue: 2,
          options: [
            { id: '1', text: 'Translate high-level code to machine code', isCorrect: true },
            { id: '2', text: 'Debug code', isCorrect: false },
            { id: '3', text: 'Format code', isCorrect: false },
            { id: '4', text: 'Run code', isCorrect: false },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          examId,
          text: 'React is a:',
          type: 'singleChoice',
          orderIndex: 1,
          pointValue: 1,
          options: [
            { id: '1', text: 'JavaScript framework', isCorrect: false },
            { id: '2', text: 'JavaScript library', isCorrect: true },
            { id: '3', text: 'Programming language', isCorrect: false },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    }, 1000);
  });
};

/**
 * Create the exam attempt store using our store factory
 */
export const examAttemptStore = createStore<
  // State shape
  {
    examId: number | null;
    exam: Exam | null;
    questions: Question[];
    startTime: string | null;
    timeSpent: number; // in seconds
    currentQuestionIndex: number;
    answers: Record<number, ExamAnswer>;
    isLoading: boolean;
    error: string | null;
    isSubmitting: boolean;
    isSubmitted: boolean;
    resultId: string | null;
  },
  // Actions
  {
    startExam: (examId: number, exam?: Exam) => Promise<void>;
    loadQuestions: (examId: number) => Promise<void>;
    setAnswer: (questionId: number, answer: Partial<ExamAnswer>) => void;
    nextQuestion: () => void;
    prevQuestion: () => void;
    jumpToQuestion: (index: number) => void;
    updateTimeSpent: (seconds: number) => void;
    submitExam: () => Promise<boolean>;
    resetAttempt: () => void;
    getProgress: () => { 
      answered: number; 
      total: number; 
      percentage: number 
    };
    isQuestionAnswered: (questionId: number) => boolean;
  }
>(
  'examAttempt', // Store name
  // Initial state
  {
    examId: null,
    exam: null,
    questions: [],
    startTime: null,
    timeSpent: 0,
    currentQuestionIndex: 0,
    answers: {},
    isLoading: false,
    error: null,
    isSubmitting: false,
    isSubmitted: false,
    resultId: null,
  },
  // Actions creator
  (set, get) => ({
    startExam: async (examId, exam) => {
      set({
        examId,
        exam: exam || null,
        startTime: new Date().toISOString(),
        timeSpent: 0,
        currentQuestionIndex: 0,
        answers: {},
        isSubmitted: false,
        resultId: null,
      });
      
      // Load questions
      await get().loadQuestions(examId);
    },
    
    loadQuestions: async (examId) => {
      set({ isLoading: true, error: null });
      
      try {
        // In a real implementation, this would use core API module
        const questions = await mockFetchQuestions(examId);
        
        // Initialize empty answers for all questions
        const initialAnswers: Record<number, ExamAnswer> = {};
        questions.forEach(question => {
          initialAnswers[question.id] = {
            ...getDefaultAnswerForQuestion(question),
            questionId: question.id,
          };
        });
        
        set({
          questions,
          answers: initialAnswers,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error loading questions:', error);
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load questions',
        });
      }
    },
    
    setAnswer: (questionId, answer) => set((state) => {
      const currentAnswer = state.answers[questionId] || { questionId };
      const updatedAnswer = { ...currentAnswer, ...answer };
      
      return {
        answers: {
          ...state.answers,
          [questionId]: updatedAnswer,
        },
      };
    }),
    
    nextQuestion: () => set((state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        return {
          currentQuestionIndex: state.currentQuestionIndex + 1,
        };
      }
      return state;
    }),
    
    prevQuestion: () => set((state) => {
      if (state.currentQuestionIndex > 0) {
        return {
          currentQuestionIndex: state.currentQuestionIndex - 1,
        };
      }
      return state;
    }),
    
    jumpToQuestion: (index) => set((state) => {
      if (index >= 0 && index < state.questions.length) {
        return {
          currentQuestionIndex: index,
        };
      }
      return state;
    }),
    
    updateTimeSpent: (seconds) => set((state) => ({
      timeSpent: state.timeSpent + seconds,
    })),
    
    submitExam: async () => {
      const { examId, answers, timeSpent } = get();
      
      if (!examId) {
        console.error('Cannot submit exam: No active exam');
        return false;
      }
      
      set({ isSubmitting: true });
      
      try {
        // In a real implementation, this would use core API module
        const success = await mockSubmitExam(examId, answers, timeSpent);
        
        if (success) {
          set({
            isSubmitting: false,
            isSubmitted: true,
            resultId: `result-${Date.now()}`, // In a real app, this would come from the API
          });
        } else {
          set({
            isSubmitting: false,
            error: 'Failed to submit exam',
          });
        }
        
        return success;
      } catch (error) {
        console.error('Error submitting exam:', error);
        
        set({
          isSubmitting: false,
          error: error instanceof Error ? error.message : 'Failed to submit exam',
        });
        
        return false;
      }
    },
    
    resetAttempt: () => set({
      examId: null,
      exam: null,
      questions: [],
      startTime: null,
      timeSpent: 0,
      currentQuestionIndex: 0,
      answers: {},
      isLoading: false,
      error: null,
      isSubmitting: false,
      isSubmitted: false,
      resultId: null,
    }),
    
    getProgress: () => {
      const { questions, answers } = get();
      const answeredCount = questions.filter(q => 
        get().isQuestionAnswered(q.id)
      ).length;
      
      return {
        answered: answeredCount,
        total: questions.length,
        percentage: questions.length > 0 
          ? Math.round((answeredCount / questions.length) * 100) 
          : 0,
      };
    },
    
    isQuestionAnswered: (questionId) => {
      const { questions, answers } = get();
      const question = questions.find(q => q.id === questionId);
      const answer = answers[questionId];
      
      if (!question || !answer) return false;
      
      return isAnswerComplete(question, answer);
    },
  }),
  // Storage options - persisting attempt state in case of accidental navigation/refresh
  {
    persist: true,
  }
);

// Extract selectors using our selector factory
export const { useStore, createSelector } = createSelectors(examAttemptStore);

// Create individual selectors for optimized rendering
export const useExamId = createSelector((state) => state.examId);
export const useExam = createSelector((state) => state.exam);
export const useQuestions = createSelector((state) => state.questions);
export const useStartTime = createSelector((state) => state.startTime);
export const useTimeSpent = createSelector((state) => state.timeSpent);
export const useCurrentQuestionIndex = createSelector((state) => state.currentQuestionIndex);
export const useCurrentQuestion = createSelector((state) => state.questions[state.currentQuestionIndex]);
export const useAnswers = createSelector((state) => state.answers);
export const useIsLoading = createSelector((state) => state.isLoading);
export const useError = createSelector((state) => state.error);
export const useIsSubmitting = createSelector((state) => state.isSubmitting);
export const useIsSubmitted = createSelector((state) => state.isSubmitted);
export const useResultId = createSelector((state) => state.resultId);
export const useIsExamInProgress = createSelector((state) => state.examId !== null && !state.isSubmitted);

// Computed selectors for progress
export const useProgress = createSelector((state) => {
  const questions = state.questions;
  const answers = state.answers;
  
  if (questions.length === 0) return { answered: 0, total: 0, percentage: 0 };
  
  const answeredCount = questions.filter(q => {
    const answer = answers[q.id];
    if (!answer) return false;
    
    return isAnswerComplete(q, answer);
  }).length;
  
  return {
    answered: answeredCount,
    total: questions.length,
    percentage: Math.round((answeredCount / questions.length) * 100),
  };
});

// Specialized selector for getting a specific answer
export const useAnswer = (questionId: number) => 
  examAttemptStore((state) => state.answers[questionId]);

// Specialized selector to check if a question is answered
export const useIsQuestionAnswered = (questionId: number) => {
  const { questions, answers } = examAttemptStore.getState();
  const question = questions.find(q => q.id === questionId);
  const answer = answers[questionId];
  
  if (!question || !answer) return false;
  
  return isAnswerComplete(question, answer);
};

/**
 * Example usage of the examAttemptStore:
 * 
 * ```tsx
 * import { 
 *   useExamId,
 *   useCurrentQuestion,
 *   useCurrentQuestionIndex,
 *   useAnswer,
 *   useProgress,
 *   examAttemptStore 
 * } from './examAttemptStore';
 * 
 * const ExamAttemptScreen = () => {
 *   // Get values from store with optimized selectors
 *   const examId = useExamId();
 *   const currentQuestion = useCurrentQuestion();
 *   const currentIndex = useCurrentQuestionIndex();
 *   const progress = useProgress();
 *   
 *   // Get the answer for the current question
 *   const answer = useAnswer(currentQuestion?.id || 0);
 *   
 *   // Get actions from store
 *   const { 
 *     setAnswer,
 *     nextQuestion,
 *     prevQuestion,
 *     submitExam 
 *   } = examAttemptStore.getState();
 *   
 *   // Handle answer change
 *   const handleAnswerChange = (newAnswer) => {
 *     setAnswer(currentQuestion.id, newAnswer);
 *   };
 *   
 *   // Handle exam submission
 *   const handleSubmit = async () => {
 *     const success = await submitExam();
 *     
 *     if (success) {
 *       // Navigate to results page
 *     }
 *   };
 *   
 *   // Rest of component...
 * };
 * ```
 */
