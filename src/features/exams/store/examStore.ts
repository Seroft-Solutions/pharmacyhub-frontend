import { create } from 'zustand';
import { MCQPaper, ExamSession, UserAnswer } from '../model/types';

interface ExamState {
    currentPaper?: MCQPaper;
    currentSession?: ExamSession;
    currentQuestionIndex: number;
    timeRemaining: number;
    answers: { [questionId: string]: UserAnswer };
    isPaused: boolean;
    isCompleted: boolean;
    
    // Actions
    startExam: (paper: MCQPaper) => void;
    answerQuestion: (answer: UserAnswer) => void;
    nextQuestion: () => void;
    previousQuestion: () => void;
    pauseExam: () => void;
    resumeExam: () => void;
    completeExam: () => void;
    resetExam: () => void;
}

export const useExamStore = create<ExamState>((set, get) => ({
    currentQuestionIndex: 0,
    timeRemaining: 0,
    answers: {},
    isPaused: false,
    isCompleted: false,

    startExam: (paper) => {
        set({
            currentPaper: paper,
            timeRemaining: paper.timeLimit * 60,
            currentQuestionIndex: 0,
            answers: {},
            isPaused: false,
            isCompleted: false,
        });
    },

    answerQuestion: (answer) => {
        set((state) => ({
            answers: {
                ...state.answers,
                [answer.questionId]: answer,
            },
        }));
    },

    nextQuestion: () => {
        const { currentQuestionIndex, currentPaper } = get();
        if (currentPaper && currentQuestionIndex < currentPaper.totalQuestions - 1) {
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
    
    completeExam: () => {
        const { answers, currentPaper } = get();
        if (!currentPaper) return;

        const totalAnswered = Object.keys(answers).length;
        if (totalAnswered < currentPaper.passingCriteria.minimumQuestions) {
            throw new Error(
                `Must attempt at least ${currentPaper.passingCriteria.minimumQuestions} questions`
            );
        }

        set({ isCompleted: true });
    },

    resetExam: () => {
        set({
            currentPaper: undefined,
            currentSession: undefined,
            currentQuestionIndex: 0,
            timeRemaining: 0,
            answers: {},
            isPaused: false,
            isCompleted: false,
        });
    },
}));