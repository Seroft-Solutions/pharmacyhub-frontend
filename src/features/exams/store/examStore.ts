import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question, ExamSession, UserAnswer } from '../model/mcqTypes';

interface ExamState {
  // Exam data
  examId?: number;
  attemptId?: number;
  questions: Question[];
  currentQuestionIndex: number;
  timeRemaining: number; // in seconds
  startTime?: Date;
  endTime?: Date;
  
  // User interactions
  answers: Record<number, UserAnswer>;
  flaggedQuestions: Set<number>;
  visitedQuestions: Set<number>;
  
  // UI state
  isPaused: boolean;
  isCompleted: boolean;
  showSummary: boolean;
  reviewMode: boolean;
  
  // Actions
  startExam: (examId: number, questions: Question[], durationInMinutes: number) => void;
  setAttemptId: (attemptId: number) => void;
  answerQuestion: (questionId: number, optionIndex: number) => void;
  toggleFlagQuestion: (questionId: number) => void;
  navigateToQuestion: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  pauseExam: () => void;
  resumeExam: () => void;
  decrementTimer: () => void;
  toggleSummary: () => void;
  setReviewMode: (isReview: boolean) => void;
  completeExam: () => void;
  resetExam: () => void;
  
  // Getters
  hasAnswer: (questionId: number) => boolean;
  isFlagged: (questionId: number) => boolean;
  getAnsweredQuestionsCount: () => number;
  getFlaggedQuestionsCount: () => number;
  getCompletionPercentage: () => number;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      // Initial state
      questions: [],
      currentQuestionIndex: 0,
      timeRemaining: 0,
      answers: {},
      flaggedQuestions: new Set<number>(),
      visitedQuestions: new Set<number>(),
      isPaused: false,
      isCompleted: false,
      showSummary: false,
      reviewMode: false,
      
      // Actions
      startExam: (examId, questions, durationInMinutes) => {
        set({
          examId,
          questions,
          timeRemaining: durationInMinutes * 60,
          currentQuestionIndex: 0,
          startTime: new Date(),
          answers: {},
          flaggedQuestions: new Set<number>(),
          visitedQuestions: new Set<number>([0]), // Mark first question as visited
          isPaused: false,
          isCompleted: false,
          showSummary: false,
          reviewMode: false,
        });
      },
      
      setAttemptId: (attemptId) => {
        set({ attemptId });
      },
      
      answerQuestion: (questionId, optionIndex) => {
        set((state) => {
          // Calculate time spent on this question
          const timeSpent = 0; // Implement time tracking per question if needed
          
          return {
            answers: {
              ...state.answers,
              [questionId]: { 
                questionId, 
                selectedOption: optionIndex,
                timeSpent
              },
            },
          };
        });
      },
      
      toggleFlagQuestion: (questionId) => {
        set((state) => {
          const newFlagged = new Set(state.flaggedQuestions);
          if (newFlagged.has(questionId)) {
            newFlagged.delete(questionId);
          } else {
            newFlagged.add(questionId);
          }
          return { flaggedQuestions: newFlagged };
        });
      },
      
      navigateToQuestion: (index) => {
        const { questions, visitedQuestions } = get();
        if (index >= 0 && index < questions.length) {
          // Mark the question as visited
          const newVisited = new Set(visitedQuestions);
          newVisited.add(index);
          
          set({ 
            currentQuestionIndex: index,
            visitedQuestions: newVisited
          });
        }
      },
      
      nextQuestion: () => {
        const { currentQuestionIndex, questions, visitedQuestions } = get();
        if (currentQuestionIndex < questions.length - 1) {
          const newIndex = currentQuestionIndex + 1;
          
          // Mark the next question as visited
          const newVisited = new Set(visitedQuestions);
          newVisited.add(newIndex);
          
          set({ 
            currentQuestionIndex: newIndex,
            visitedQuestions: newVisited
          });
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
      
      decrementTimer: () => {
        set((state) => ({
          timeRemaining: Math.max(0, state.timeRemaining - 1)
        }));
      },
      
      toggleSummary: () => {
        set((state) => ({ showSummary: !state.showSummary }));
      },
      
      setReviewMode: (isReview) => {
        set({ reviewMode: isReview });
      },
      
      completeExam: () => {
        set({ 
          isCompleted: true,
          endTime: new Date() 
        });
      },
      
      resetExam: () => {
        set({
          examId: undefined,
          attemptId: undefined,
          questions: [],
          currentQuestionIndex: 0,
          timeRemaining: 0,
          startTime: undefined,
          endTime: undefined,
          answers: {},
          flaggedQuestions: new Set<number>(),
          visitedQuestions: new Set<number>(),
          isPaused: false,
          isCompleted: false,
          showSummary: false,
          reviewMode: false,
        });
      },
      
      // Getters
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
        const { questions, answers } = get();
        if (questions.length === 0) return 0;
        return (Object.keys(answers).length / questions.length) * 100;
      },
    }),
    {
      name: 'exam-store',
      partialize: (state) => ({
        // Only persist these fields
        examId: state.examId,
        attemptId: state.attemptId,
        questions: state.questions,
        currentQuestionIndex: state.currentQuestionIndex,
        timeRemaining: state.timeRemaining,
        startTime: state.startTime,
        answers: state.answers,
        flaggedQuestions: Array.from(state.flaggedQuestions),
        visitedQuestions: Array.from(state.visitedQuestions),
        isPaused: state.isPaused,
        isCompleted: state.isCompleted,
      }),
      onRehydrateStorage: (state) => {
        // Convert arrays back to Sets after rehydration
        if (state) {
          return (rehydratedState, error) => {
            if (error) {
              console.error('Error rehydrating exam store:', error);
            } else if (rehydratedState) {
              // Convert arrays back to Sets
              rehydratedState.flaggedQuestions = new Set(rehydratedState.flaggedQuestions || []);
              rehydratedState.visitedQuestions = new Set(rehydratedState.visitedQuestions || []);
            }
          };
        }
      },
    }
  )
);
