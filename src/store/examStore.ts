import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ExamMeta, Question, UserProgress, QuestionAnswer } from '../types/exam';

interface ExamState {
  currentExam: ExamMeta | null;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, QuestionAnswer>;
  timeRemaining: number;
  examStartTime: Date | null;
  isSubmitting: boolean;
  error: string | null;

  // Actions
  startExam: (examId: string) => Promise<void>;
  submitAnswer: (questionId: string, answer: string) => void;
  navigateToQuestion: (index: number) => void;
  submitExam: () => Promise<void>;
  resetExam: () => void;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      currentExam: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: {},
      timeRemaining: 0,
      examStartTime: null,
      isSubmitting: false,
      error: null,

      startExam: async (examId: string) => {
        try {
          const [examResponse, questionsResponse] = await Promise.all([
            fetch(`/api/exams/${examId}`),
            fetch(`/api/exams/${examId}/questions`)
          ]);

          if (!examResponse.ok || !questionsResponse.ok) {
            throw new Error('Failed to fetch exam data');
          }

          const exam = await examResponse.json();
          const questions = await questionsResponse.json();

          // Start exam progress on backend
          const progressResponse = await fetch(`/api/exams/${examId}/start`, {
            method: 'POST',
            headers: {
              'userId': localStorage.getItem('userId') || ''
            }
          });

          if (!progressResponse.ok) {
            throw new Error('Failed to start exam');
          }

          set({
            currentExam: exam,
            questions,
            timeRemaining: exam.timeLimit * 60,
            examStartTime: new Date(),
            currentQuestionIndex: 0,
            answers: {},
            error: null
          });
        } catch (error) {
          set({ error: error.message });
        }
      },

      submitAnswer: (questionId: string, answer: string) => {
        const { answers } = get();
        set({
          answers: {
            ...answers,
            [questionId]: {
              questionId,
              selectedAnswer: answer,
              timeSpent: 0, // Calculate from question start time
              confidence: 1
            }
          }
        });
      },

      navigateToQuestion: (index: number) => {
        const { questions } = get();
        if (index >= 0 && index < questions.length) {
          set({ currentQuestionIndex: index });
        }
      },

      submitExam: async () => {
        const { currentExam, answers } = get();
        if (!currentExam) return;

        set({ isSubmitting: true });

        try {
          const response = await fetch(`/api/exams/${currentExam.id}/submit`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'userId': localStorage.getItem('userId') || ''
            },
            body: JSON.stringify(Object.values(answers))
          });

          if (!response.ok) {
            throw new Error('Failed to submit exam');
          }

          const result = await response.json();
          // Handle result in UI
          
          set({ isSubmitting: false });
        } catch (error) {
          set({ error: error.message, isSubmitting: false });
        }
      },

      resetExam: () => {
        set({
          currentExam: null,
          questions: [],
          currentQuestionIndex: 0,
          answers: {},
          timeRemaining: 0,
          examStartTime: null,
          error: null
        });
      }
    }),
    {
      name: 'exam-storage',
      partialize: (state) => ({
        answers: state.answers,
        currentQuestionIndex: state.currentQuestionIndex,
        timeRemaining: state.timeRemaining
      })
    }
  )
);