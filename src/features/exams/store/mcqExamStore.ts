import { create } from 'zustand';
import { examService } from '../api/examService';
import { Exam, ExamAttempt, UserAnswer, ExamResult, FlaggedQuestion } from '../model/mcqTypes';
import { logger } from '@/shared/lib/logger';

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
  
  // Actions
  fetchPublishedExams: () => Promise<Exam[]>;
  fetchExamById: (examId: number) => Promise<void>;
  startExam: (examId: number) => Promise<void>;
  answerQuestion: (answer: UserAnswer) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  flagQuestion: (questionId: number) => Promise<void>;
  unflagQuestion: (questionId: number) => Promise<void>;
  pauseExam: () => void;
  resumeExam: () => void;
  completeExam: () => Promise<void>;
  resetExam: () => void;
  updateTimeRemaining: (seconds: number) => void;
}

export const useMcqExamStore = create<McqExamState>((set, get) => ({
  currentQuestionIndex: 0,
  timeRemaining: 0,
  userAnswers: {},
  flaggedQuestions: new Set<number>(),
  isPaused: false,
  isCompleted: false,
  isLoading: false,
  
  fetchPublishedExams: async () => {
    try {
      set({ isLoading: true });
      const exams = await examService.getPublishedExams();
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
      const exam = await examService.getExamById(examId);
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
        const attempt = await examService.startExam(examId);
        console.log('Exam attempt in store:', attempt);
        
        // Set timeRemaining based on current exam duration if it exists
        const currentExam = get().currentExam;
        const timeRemainingSeconds = currentExam ? currentExam.duration * 60 : 0;
        
        // Also fetch flagged questions if any exist
        let flaggedQuestions = new Set<number>();
        try {
          const flagged = await examService.getFlaggedQuestions(attempt.id);
          flaggedQuestions = new Set(flagged.map(f => f.questionId));
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
    }));
  },
  
  nextQuestion: () => {
    const { currentQuestionIndex, currentExam } = get();
    if (currentExam?.questions && currentQuestionIndex < currentExam.questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },
  
  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
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
      await examService.flagQuestion(currentAttempt.id, questionId);
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
      await examService.unflagQuestion(currentAttempt.id, questionId);
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
      
      const result = await examService.submitExam(currentAttempt.id, answersArray);
      
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
      error: undefined
    });
  },
  
  updateTimeRemaining: (seconds) => {
    set({ timeRemaining: seconds });
  }
}));
