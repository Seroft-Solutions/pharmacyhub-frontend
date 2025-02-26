import { create } from 'zustand';
import { examService } from '../api/examService';
import { Exam, ExamAttempt, UserAnswer, ExamResult } from '../model/mcqTypes';
import { logger } from '@/shared/lib/logger';

interface McqExamState {
  // State
  currentExam?: Exam;
  currentAttempt?: ExamAttempt;
  currentQuestionIndex: number;
  timeRemaining: number;
  userAnswers: { [questionId: number]: UserAnswer };
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
      
      const attempt = await examService.startExam(examId);
      
      set({
        currentAttempt: attempt,
        currentQuestionIndex: 0,
        userAnswers: {},
        isPaused: false,
        isCompleted: false,
        examResult: undefined,
        isLoading: false
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
