/**
 * MCQ Exam Store
 * 
 * This store manages the state for MCQ exams using Zustand
 * and leverages the TanStack Query API hooks for data fetching.
 */
import { create } from 'zustand';
import { examApiHooks } from '../api/hooks';
import { 
  Exam, 
  ExamAttempt, 
  UserAnswer, 
  ExamResult, 
  FlaggedQuestion,
  Question
} from '../types';
import logger from '@/shared/lib/logger';

interface McqExamState {
  // State
  currentExam?: Exam;
  currentAttempt?: ExamAttempt;
  currentQuestionIndex: number;
  timeRemaining: number;
  userAnswers: { [questionId: number]: UserAnswer };
  flaggedQuestions: Set<number>;
  isPaused: boolean;
  isCompleted: boolean;
  isLoading: boolean;
  error?: string;
  examResult?: ExamResult;
  showExplanation: boolean;
  highlightedAnswerId: number | null;
  
  // Actions
  fetchPublishedExams: () => Promise<Exam[]>;
  fetchExamById: (examId: number) => Promise<void>;
  startExam: (examId: number) => Promise<void>;
  answerQuestion: (answer: UserAnswer) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  navigateToQuestion: (index: number) => void;
  flagQuestion: (questionId: number) => Promise<void>;
  unflagQuestion: (questionId: number) => Promise<void>;
  toggleFlagQuestion: (questionId: number) => Promise<void>;
  toggleExplanation: () => void;
  resetQuestionUI: () => void;
  pauseExam: () => void;
  resumeExam: () => void;
  completeExam: () => Promise<void>;
  resetExam: () => void;
  updateTimeRemaining: (seconds: number) => void;
  decrementTimer: () => void;
  toggleSummary: () => void;
  setAttemptId: (attemptId: number) => void;
}

export const useMcqExamStore = create<McqExamState>((set, get) => ({
  currentQuestionIndex: 0,
  timeRemaining: 0,
  userAnswers: {},
  flaggedQuestions: new Set<number>(),
  isPaused: false,
  isCompleted: false,
  isLoading: false,
  showExplanation: false,
  highlightedAnswerId: null,
  
  fetchPublishedExams: async () => {
    try {
      set({ isLoading: true });
      
      // Use the usePublishedExams hook result directly
      // Since this is not in a React component, we need to fetch directly
      const response = await fetch('/api/v1/exams/published');
      if (!response.ok) {
        throw new Error('Failed to fetch exams');
      }
      
      const exams = await response.json();
      set({ isLoading: false });
      return exams;
    } catch (error) {
      logger.error('Failed to fetch exams', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch exams' 
      });
      return [];
    }
  },
  
  fetchExamById: async (examId) => {
    try {
      set({ isLoading: true });
      
      // Use direct fetch since we're outside of React
      const response = await fetch(`/api/v1/exams/${examId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch exam ${examId}`);
      }
      
      const exam = await response.json();
      set({ 
        currentExam: exam,
        timeRemaining: exam.duration * 60, // Convert minutes to seconds
        isLoading: false 
      });
    } catch (error) {
      logger.error('Failed to fetch exam by ID', { 
        examId,
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : `Failed to fetch exam ${examId}` 
      });
    }
  },
  
  startExam: async (examId) => {
    try {
      set({ isLoading: true });
      // First get the exam if not already loaded
      if (!get().currentExam || get().currentExam.id !== examId) {
        await get().fetchExamById(examId);
      }
      
      try {
        // Use direct fetch to start the exam
        const response = await fetch(`/api/v1/exams/${examId}/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to start exam ${examId}`);
        }
        
        const attempt = await response.json();
        console.log('Exam attempt in store:', attempt);
        
        // Set timeRemaining based on current exam duration if it exists
        const currentExam = get().currentExam;
        const timeRemainingSeconds = currentExam ? currentExam.duration * 60 : 0;
        
        // Also fetch flagged questions if any exist
        let flaggedQuestions = new Set<number>();
        try {
          const flaggedResponse = await fetch(`/api/v1/exams/attempts/${attempt.id}/flags`);
          if (flaggedResponse.ok) {
            const flagged = await flaggedResponse.json();
            flaggedQuestions = new Set(flagged.map((f: FlaggedQuestion) => f.questionId));
          }
        } catch (err) {
          // Ignore errors fetching flagged questions
          console.warn('Could not fetch flagged questions', err);
        }
        
        set({
          currentAttempt: attempt,
          currentQuestionIndex: 0,
          userAnswers: {},
          flaggedQuestions,
          timeRemaining: timeRemainingSeconds,
          isPaused: false,
          isCompleted: false,
          examResult: undefined,
          isLoading: false,
          error: undefined // Clear any previous errors
        });
      } catch (error) {
        logger.error('Failed to start exam', { 
          examId,
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
        set({ 
          isLoading: false, 
          error: error instanceof Error ? error.message : `Failed to start exam ${examId}` 
        });
      }
    } catch (error) {
      logger.error('Failed to start exam', { 
        examId,
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : `Failed to start exam ${examId}` 
      });
    }
  },
  
  answerQuestion: (answer) => {
    set((state) => ({
      userAnswers: {
        ...state.userAnswers,
        [answer.questionId]: answer,
      },
      // Set the highlighted answer ID when answering
      highlightedAnswerId: parseInt(answer.answerId)
    }));
  },
  
  nextQuestion: () => {
    const { currentQuestionIndex, currentExam } = get();
    if (currentExam?.questions && currentQuestionIndex < currentExam.questions.length - 1) {
      // Reset UI state first
      get().resetQuestionUI();
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },
  
  toggleExplanation: () => {
    set((state) => ({ showExplanation: !state.showExplanation }));
  },
  
  resetQuestionUI: () => {
    // Clear both the explanation and highlighting state
    set({ 
      showExplanation: false, 
      highlightedAnswerId: null 
    });
    
    // Logging for debugging
    logger.debug('QuestionUI state reset', { 
      timestamp: new Date().toISOString() 
    });
  },
  
  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      // Reset UI state first
      get().resetQuestionUI();
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },
  
  navigateToQuestion: (index) => {
    const { currentExam } = get();
    if (currentExam?.questions && index >= 0 && index < currentExam.questions.length) {
      // Reset UI state first
      get().resetQuestionUI();
      set({ currentQuestionIndex: index });
    }
  },
  
  flagQuestion: async (questionId) => {
    const { currentAttempt, flaggedQuestions } = get();
    
    if (!currentAttempt) {
      logger.error('No active exam attempt');
      throw new Error('No active exam attempt');
    }
    
    try {
      set({ isLoading: true });
      
      // Add to local state immediately for responsive UI
      const newFlagged = new Set(flaggedQuestions);
      newFlagged.add(questionId);
      set({ flaggedQuestions: newFlagged });
      
      // Then persist to server
      const response = await fetch(`/api/v1/exams/attempts/${currentAttempt.id}/flag/${questionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to flag question');
      }
      
      set({ isLoading: false });
    } catch (error) {
      logger.error('Failed to flag question', {
        questionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Rollback if server call fails
      const rollbackFlagged = new Set(get().flaggedQuestions);
      rollbackFlagged.delete(questionId);
      
      set({
        flaggedQuestions: rollbackFlagged,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to flag question'
      });
    }
  },
  
  unflagQuestion: async (questionId) => {
    const { currentAttempt, flaggedQuestions } = get();
    
    if (!currentAttempt) {
      logger.error('No active exam attempt');
      throw new Error('No active exam attempt');
    }
    
    try {
      set({ isLoading: true });
      
      // Remove from local state immediately for responsive UI
      const newFlagged = new Set(flaggedQuestions);
      newFlagged.delete(questionId);
      set({ flaggedQuestions: newFlagged });
      
      // Then persist to server
      const response = await fetch(`/api/v1/exams/attempts/${currentAttempt.id}/flag/${questionId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to unflag question');
      }
      
      set({ isLoading: false });
    } catch (error) {
      logger.error('Failed to unflag question', {
        questionId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      // Rollback if server call fails
      const rollbackFlagged = new Set(get().flaggedQuestions);
      rollbackFlagged.add(questionId);
      
      set({
        flaggedQuestions: rollbackFlagged,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to unflag question'
      });
    }
  },
  
  toggleFlagQuestion: async (questionId) => {
    const { flaggedQuestions } = get();
    if (flaggedQuestions.has(questionId)) {
      await get().unflagQuestion(questionId);
    } else {
      await get().flagQuestion(questionId);
    }
  },
  
  pauseExam: () => set({ isPaused: true }),
  
  resumeExam: () => set({ isPaused: false }),
  
  completeExam: async () => {
    const { currentAttempt, userAnswers } = get();
    
    if (!currentAttempt) {
      logger.error('No active exam attempt to submit');
      set({ error: 'No active exam attempt to submit' });
      return;
    }
    
    try {
      set({ isLoading: true });
      
      // Convert userAnswers object to array
      const answersArray = Object.values(userAnswers);
      
      logger.info('Submitting exam', { 
        attemptId: currentAttempt.id,
        answersCount: answersArray.length
      });
      
      const response = await fetch(`/api/v1/exams/attempts/${currentAttempt.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers: answersArray })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit exam');
      }
      
      const result = await response.json();
      
      set({ 
        examResult: result,
        isCompleted: true,
        isLoading: false
      });
    } catch (error) {
      logger.error('Failed to submit exam', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to submit exam' 
      });
    }
  },
  
  resetExam: () => {
    set({
      currentExam: undefined,
      currentAttempt: undefined,
      currentQuestionIndex: 0,
      timeRemaining: 0,
      userAnswers: {},
      flaggedQuestions: new Set(),
      isPaused: false,
      isCompleted: false,
      examResult: undefined,
      error: undefined,
      showExplanation: false,
      highlightedAnswerId: null
    });
  },
  
  updateTimeRemaining: (seconds) => {
    set({ timeRemaining: seconds });
  },
  
  decrementTimer: () => {
    set((state) => ({ 
      timeRemaining: Math.max(0, state.timeRemaining - 1) 
    }));
  },
  
  toggleSummary: () => {
    // Implementation will depend on how you want to handle summary view
    // For now, just a placeholder
  },
  
  setAttemptId: (attemptId) => {
    set((state) => ({
      currentAttempt: state.currentAttempt 
        ? { ...state.currentAttempt, id: attemptId }
        : undefined
    }));
  }
}));
