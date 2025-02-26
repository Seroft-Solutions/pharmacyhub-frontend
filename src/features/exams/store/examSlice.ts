import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Exam, ExamStatus, ExamAttempt, UserAnswer, ExamResult } from '../model/mcqTypes';
import { examService } from '../api/examService';

// Define the initial state
interface ExamState {
  availableExams: Exam[];
  currentExam: Exam | null;
  currentAttempt: ExamAttempt | null;
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  timeRemaining: number;
  examResult: ExamResult | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ExamState = {
  availableExams: [],
  currentExam: null,
  currentAttempt: null,
  currentQuestionIndex: 0,
  userAnswers: [],
  timeRemaining: 0,
  examResult: null,
  status: 'idle',
  error: null
};

// Async thunks for API calls
export const fetchPublishedExams = createAsyncThunk(
  'exam/fetchPublishedExams',
  async () => {
    const response = await examService.getPublishedExams();
    return response;
  }
);

export const fetchExamById = createAsyncThunk(
  'exam/fetchExamById',
  async (examId: number) => {
    const response = await examService.getExamById(examId);
    return response;
  }
);

export const startExamAttempt = createAsyncThunk(
  'exam/startExamAttempt',
  async (examId: number) => {
    const response = await examService.startExam(examId);
    return response;
  }
);

export const submitExamAttempt = createAsyncThunk(
  'exam/submitExamAttempt',
  async (_, { getState }) => {
    const state = getState() as { exam: ExamState };
    const { currentAttempt, userAnswers } = state.exam;
    
    if (!currentAttempt || !currentAttempt.id) {
      throw new Error('No active exam attempt to submit');
    }
    
    const response = await examService.submitExam(currentAttempt.id, userAnswers);
    return response;
  }
);

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      state.currentQuestionIndex = action.payload;
    },
    nextQuestion: (state) => {
      if (state.currentExam && state.currentExam.questions && 
          state.currentQuestionIndex < state.currentExam.questions.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    answerQuestion: (state, action: PayloadAction<UserAnswer>) => {
      const existingAnswerIndex = state.userAnswers.findIndex(
        answer => answer.questionId === action.payload.questionId
      );
      
      if (existingAnswerIndex >= 0) {
        // Update existing answer
        state.userAnswers[existingAnswerIndex] = action.payload;
      } else {
        // Add new answer
        state.userAnswers.push(action.payload);
      }
    },
    updateTimeRemaining: (state, action: PayloadAction<number>) => {
      state.timeRemaining = action.payload;
    },
    resetExam: (state) => {
      state.currentExam = null;
      state.currentAttempt = null;
      state.currentQuestionIndex = 0;
      state.userAnswers = [];
      state.timeRemaining = 0;
      state.examResult = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchPublishedExams
      .addCase(fetchPublishedExams.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPublishedExams.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.availableExams = action.payload;
      })
      .addCase(fetchPublishedExams.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch published exams';
      })
      
      // fetchExamById
      .addCase(fetchExamById.pending, (state) => {
        state.status = 'loading';
      