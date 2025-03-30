# Task 02-03: Core Domain and API Integration Layer Implementation

## Description
Set up the core domain and API integration layer for the exams feature. This includes defining domain-specific types, creating API adapters and hooks, and establishing the foundation for state management.

## Part 1: Core Domain Implementation

### Step 1: Define Core Types
Create the core type definitions in `/src/features/exams/core/types/index.ts`:

```typescript
// Re-export existing types from a standardized interface
export {
  ExamStatus,
  AttemptStatus,
  PaperType,
  Difficulty,
  Option,
  Question,
  Exam,
  ExamPaper,
  UserAnswer,
  ExamAttempt,
  FlaggedQuestion,
  QuestionResult,
  ExamResult,
  ExamStats,
  ExamPaperMetadata,
  ExamPaperProgress
} from '../../types/StandardTypes';

// Add domain-specific types

// Core entity interfaces with standardized naming
export interface ExamCore {
  id: number | string;
  title: string;
  description: string;
  status: ExamStatus;
  paperType: PaperType;
  difficulty: Difficulty;
  totalQuestions: number;
  totalMarks: number;
  passingMarks: number;
  durationMinutes: number;
  isPremium: boolean;
  price: number;
  createdAt: string;
  updatedAt: string;
}

// Feature flags and configuration
export interface ExamFeatureConfig {
  enableNegativeMarking: boolean;
  enableExplanations: boolean;
  enableTimers: boolean;
  enableReview: boolean;
  enableBookmarking: boolean;
}

// User progress and activity
export interface ExamUserProgress {
  userId: string;
  examId: number | string;
  lastActivity: string;
  completedAttempts: number;
  bestScore: number;
  totalTimeSpentMinutes: number;
}

// Exam permission types - will be used with RBAC
export enum ExamPermission {
  VIEW_EXAM = 'VIEW_EXAM',
  TAKE_EXAM = 'TAKE_EXAM',
  CREATE_EXAM = 'CREATE_EXAM',
  EDIT_EXAM = 'EDIT_EXAM',
  DELETE_EXAM = 'DELETE_EXAM',
  MANAGE_EXAMS = 'MANAGE_EXAMS',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS'
}
```

### Step 2: Create Core Utils
Create utility functions in `/src/features/exams/core/utils/index.ts`:

```typescript
import { ExamCore, ExamResult, Question, UserAnswer } from '../types';

/**
 * Calculate exam score based on user answers
 */
export function calculateExamScore(
  questions: Question[],
  userAnswers: UserAnswer[],
  examConfig: { negativeMarking: boolean; negativeMarkingValue: number }
): {
  score: number;
  totalMarks: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unanswered: number;
  negativeMarks: number;
} {
  // Implementation with improved error handling and negative marking support
  let correctAnswers = 0;
  let incorrectAnswers = 0;
  let totalMarks = 0;
  let earnedMarks = 0;
  let negativeMarks = 0;

  // Calculate the total available marks
  questions.forEach(question => {
    totalMarks += question.marks;
  });

  // Track answered question IDs for calculating unanswered
  const answeredQuestionIds = new Set<number>();

  // Process each user answer
  userAnswers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (!question) return;

    answeredQuestionIds.add(question.id);

    // Find the selected option
    const selectedOption = question.options.find(
      option => option.id.toString() === answer.selectedOptionId
    );

    if (selectedOption?.isCorrect) {
      correctAnswers++;
      earnedMarks += question.marks;
    } else {
      incorrectAnswers++;
      // Apply negative marking if enabled
      if (examConfig.negativeMarking) {
        negativeMarks += question.marks * examConfig.negativeMarkingValue;
      }
    }
  });

  // Calculate unanswered questions
  const unanswered = questions.length - answeredQuestionIds.size;

  // Calculate final score
  const score = Math.max(0, earnedMarks - negativeMarks);

  return {
    score,
    totalMarks,
    correctAnswers,
    incorrectAnswers,
    unanswered,
    negativeMarks
  };
}

/**
 * Format time in seconds to a human-readable format
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}

/**
 * Check if a user has permission to access an exam
 */
export function hasExamAccess(
  exam: ExamCore,
  userPermissions: {
    hasPremiumAccess: boolean;
    purchasedExams: number[] | string[];
  }
): boolean {
  // If the exam is not premium, allow access
  if (!exam.isPremium) {
    return true;
  }
  
  // If user has premium access, allow access
  if (userPermissions.hasPremiumAccess) {
    return true;
  }
  
  // Check if the user has purchased this specific exam
  return userPermissions.purchasedExams.includes(exam.id);
}

/**
 * Generate a unique attempt ID for local storage
 */
export function generateAttemptId(examId: number | string, userId: string): string {
  return `exam_${examId}_user_${userId}_${Date.now()}`;
}
```

### Step 3: Setup Core Hooks
Create hooks in `/src/features/exams/core/hooks/index.ts`:

```typescript
import { useCallback } from 'react';
import { useExamCoreStore } from '../state';
import { ExamCore, ExamPermission } from '../types';
import { hasExamAccess } from '../utils';
import { useRBAC } from '../../../core/rbac';

/**
 * Hook to check exam access permissions
 */
export function useExamAccess(examId?: number | string) {
  const { selectExamById, selectUserPermissions } = useExamCoreStore();
  
  return useCallback(() => {
    if (!examId) return false;
    
    const exam = selectExamById(examId);
    const userPermissions = selectUserPermissions();
    
    if (!exam) return false;
    
    return hasExamAccess(exam, userPermissions);
  }, [examId, selectExamById, selectUserPermissions]);
}

/**
 * Hook to check exam permissions based on RBAC
 */
export function useExamPermissions() {
  const { hasPermission } = useRBAC();
  
  const canViewExam = useCallback(() => 
    hasPermission(ExamPermission.VIEW_EXAM), [hasPermission]);
    
  const canTakeExam = useCallback(() => 
    hasPermission(ExamPermission.TAKE_EXAM), [hasPermission]);
    
  const canCreateExam = useCallback(() => 
    hasPermission(ExamPermission.CREATE_EXAM), [hasPermission]);
    
  const canEditExam = useCallback(() => 
    hasPermission(ExamPermission.EDIT_EXAM), [hasPermission]);
    
  const canDeleteExam = useCallback(() => 
    hasPermission(ExamPermission.DELETE_EXAM), [hasPermission]);
    
  const canManageExams = useCallback(() => 
    hasPermission(ExamPermission.MANAGE_EXAMS), [hasPermission]);
    
  const canViewAnalytics = useCallback(() => 
    hasPermission(ExamPermission.VIEW_ANALYTICS), [hasPermission]);
    
  return {
    canViewExam,
    canTakeExam,
    canCreateExam,
    canEditExam,
    canDeleteExam,
    canManageExams,
    canViewAnalytics
  };
}
```

### Step 4: Setup Core State
Create the core state store in `/src/features/exams/core/state/examCoreStore.ts`:

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ExamCore, ExamUserProgress } from '../types';

// Define the store state interface
interface ExamCoreState {
  // State
  exams: ExamCore[];
  userProgress: ExamUserProgress[];
  isLoading: boolean;
  error: string | null;
  
  // User permissions
  userPermissions: {
    hasPremiumAccess: boolean;
    purchasedExams: number[] | string[];
  };
  
  // Actions
  setExams: (exams: ExamCore[]) => void;
  addExam: (exam: ExamCore) => void;
  updateExam: (id: number | string, updates: Partial<ExamCore>) => void;
  removeExam: (id: number | string) => void;
  setUserProgress: (progress: ExamUserProgress[]) => void;
  updateUserProgress: (progress: ExamUserProgress) => void;
  setUserPermissions: (permissions: {
    hasPremiumAccess: boolean;
    purchasedExams: number[] | string[];
  }) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Selectors
  selectExamById: (id: number | string) => ExamCore | undefined;
  selectExamsByType: (type: string) => ExamCore[];
  selectUserProgressByExamId: (examId: number | string) => ExamUserProgress | undefined;
  selectUserPermissions: () => {
    hasPremiumAccess: boolean;
    purchasedExams: number[] | string[];
  };
}

// Create the store
export const useExamCoreStore = create<ExamCoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      exams: [],
      userProgress: [],
      isLoading: false,
      error: null,
      
      userPermissions: {
        hasPremiumAccess: false,
        purchasedExams: [],
      },
      
      // Actions
      setExams: (exams) => set({ exams }),
      
      addExam: (exam) => set((state) => ({
        exams: [...state.exams, exam]
      })),
      
      updateExam: (id, updates) => set((state) => ({
        exams: state.exams.map((exam) => 
          exam.id === id ? { ...exam, ...updates } : exam
        )
      })),
      
      removeExam: (id) => set((state) => ({
        exams: state.exams.filter((exam) => exam.id !== id)
      })),
      
      setUserProgress: (progress) => set({ userProgress: progress }),
      
      updateUserProgress: (progress) => set((state) => {
        const existingIndex = state.userProgress.findIndex(
          (p) => p.examId === progress.examId && p.userId === progress.userId
        );
        
        if (existingIndex >= 0) {
          const updatedProgress = [...state.userProgress];
          updatedProgress[existingIndex] = progress;
          return { userProgress: updatedProgress };
        } else {
          return { userProgress: [...state.userProgress, progress] };
        }
      }),
      
      setUserPermissions: (permissions) => set({ userPermissions: permissions }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      // Selectors
      selectExamById: (id) => get().exams.find((exam) => exam.id === id),
      
      selectExamsByType: (type) => 
        get().exams.filter((exam) => exam.paperType === type),
      
      selectUserProgressByExamId: (examId) => 
        get().userProgress.find((progress) => progress.examId === examId),
      
      selectUserPermissions: () => get().userPermissions,
    }),
    {
      name: 'exam-core-storage',
      partialize: (state) => ({
        // Only persist these parts of the state
        userProgress: state.userProgress,
        userPermissions: state.userPermissions,
      }),
    }
  )
);

// Export selectors as hooks for better performance
export const useExams = () => useExamCoreStore((state) => state.exams);
export const useExamsByType = (type: string) => 
  useExamCoreStore((state) => state.selectExamsByType(type));
export const useUserProgressByExamId = (examId: number | string) => 
  useExamCoreStore((state) => state.selectUserProgressByExamId(examId));
export const useUserPermissions = () => 
  useExamCoreStore((state) => state.userPermissions);
export const useExamCoreLoading = () => 
  useExamCoreStore((state) => state.isLoading);
export const useExamCoreError = () => 
  useExamCoreStore((state) => state.error);
```

### Step 5: Create Core Index File
Create the core index file at `/src/features/exams/core/index.ts`:

```typescript
// Re-export types
export * from './types';

// Re-export utilities
export * from './utils';

// Re-export hooks
export * from './hooks';

// Re-export state
export {
  useExamCoreStore,
  useExams,
  useExamsByType,
  useUserProgressByExamId,
  useUserPermissions,
  useExamCoreLoading,
  useExamCoreError
} from './state/examCoreStore';
```

## Part 2: API Integration Layer Implementation

### Step 1: Define API Types
Create the API types in `/src/features/exams/api/types/index.ts`:

```typescript
import { 
  ExamStatus, 
  PaperType, 
  Difficulty, 
  Option,
  Question, 
  Exam, 
  ExamPaper
} from '../../core/types';

// API Response Types - these match what the backend returns
export interface ApiExamResponse {
  id: number;
  title: string;
  description: string;
  status: string; // Matches ExamStatus enum
  type: string; // Matches PaperType enum
  difficulty: string; // Matches Difficulty enum
  questions: ApiQuestionResponse[];
  question_count: number;
  total_marks: number;
  passing_marks: number;
  duration: number; // minutes
  is_premium: boolean;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface ApiQuestionResponse {
  id: number;
  question_number: number;
  question_text: string;
  options: ApiOptionResponse[];
  correct_answer?: string; // May not be included for security
  explanation?: string;
  points: number;
}

export interface ApiOptionResponse {
  id: number;
  option_key: string; // typically A, B, C, D
  option_text: string;
  is_correct?: boolean; // May not be included for security
}

export interface ApiExamPaperResponse {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  question_count: number;
  duration: number; // minutes
  topics_covered: string[];
  is_premium: boolean;
  price: number;
  attempt_count: number;
  success_rate_percent: number;
  last_updated: string;
  type: string; // model, past, subject, etc.
}

export interface ApiUserAnswerResponse {
  question_id: number;
  selected_option_id: string;
  time_spent: number; // seconds
}

export interface ApiExamAttemptResponse {
  id: number;
  exam_id: number;
  user_id: string;
  start_time: string;
  end_time?: string;
  status: string; // IN_PROGRESS, COMPLETED, ABANDONED
  answers?: ApiUserAnswerResponse[];
}

export interface ApiExamResultResponse {
  attempt_id: number;
  exam_id: number;
  exam_title: string;
  score: number;
  total_marks: number;
  passing_marks: number;
  is_passed: boolean;
  time_spent: number; // seconds
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  unanswered: number;
  completed_at: string;
  question_results: ApiQuestionResultResponse[];
}

export interface ApiQuestionResultResponse {
  question_id: number;
  question_text: string;
  user_answer_id: string;
  correct_answer_id: string;
  is_correct: boolean;
  explanation?: string;
  points: number;
  earned_points: number;
}

// API Request Types
export interface CreateExamRequest {
  title: string;
  description: string;
  type: PaperType;
  difficulty: Difficulty;
  questions: {
    question_text: string;
    options: {
      option_key: string;
      option_text: string;
      is_correct: boolean;
    }[];
    correct_answer: string;
    explanation?: string;
    points: number;
  }[];
  duration: number; // minutes
  passing_marks: number;
  is_premium: boolean;
  price?: number;
}

export interface UpdateExamRequest {
  title?: string;
  description?: string;
  status?: ExamStatus;
  difficulty?: Difficulty;
  duration?: number;
  passing_marks?: number;
  is_premium?: boolean;
  price?: number;
}

export interface SubmitExamAttemptRequest {
  exam_id: number;
  answers: {
    question_id: number;
    selected_option_id: string;
    time_spent: number;
  }[];
  total_time_spent: number;
}
```

### Step 2: Create API Adapters
Create API adapters in `/src/features/exams/api/adapters/index.ts`:

```typescript
import {
  ApiExamResponse,
  ApiExamPaperResponse,
  ApiQuestionResponse,
  ApiOptionResponse,
  ApiExamResultResponse,
  ApiQuestionResultResponse,
  ApiExamAttemptResponse,
  ApiUserAnswerResponse
} from '../types';

import {
  Exam,
  ExamPaper,
  Question,
  Option,
  ExamResult,
  QuestionResult,
  ExamAttempt,
  UserAnswer,
  ExamCore,
  ExamStatus,
  PaperType,
  Difficulty
} from '../../core/types';

/**
 * Transform API exam response to domain Exam model
 */
export function transformExam(apiExam: ApiExamResponse): Exam {
  return {
    id: apiExam.id,
    title: apiExam.title,
    description: apiExam.description,
    duration: apiExam.duration,
    totalMarks: apiExam.total_marks,
    passingMarks: apiExam.passing_marks,
    status: apiExam.status as ExamStatus,
    questions: apiExam.questions?.map(transformQuestion) || [],
    premium: apiExam.is_premium,
    price: apiExam.price
  };
}

/**
 * Transform API exam response to ExamCore model
 */
export function transformExamToCore(apiExam: ApiExamResponse): ExamCore {
  return {
    id: apiExam.id,
    title: apiExam.title,
    description: apiExam.description,
    status: apiExam.status as ExamStatus,
    paperType: apiExam.type as PaperType,
    difficulty: apiExam.difficulty as Difficulty,
    totalQuestions: apiExam.question_count,
    totalMarks: apiExam.total_marks,
    passingMarks: apiExam.passing_marks,
    durationMinutes: apiExam.duration,
    isPremium: apiExam.is_premium,
    price: apiExam.price,
    createdAt: apiExam.created_at,
    updatedAt: apiExam.updated_at
  };
}

/**
 * Transform API question response to domain Question model
 */
export function transformQuestion(apiQuestion: ApiQuestionResponse): Question {
  return {
    id: apiQuestion.id,
    questionNumber: apiQuestion.question_number,
    text: apiQuestion.question_text,
    options: apiQuestion.options.map(transformOption),
    correctAnswer: apiQuestion.correct_answer,
    explanation: apiQuestion.explanation,
    marks: apiQuestion.points
  };
}

/**
 * Transform API option response to domain Option model
 */
export function transformOption(apiOption: ApiOptionResponse): Option {
  return {
    id: apiOption.id,
    label: apiOption.option_key,
    text: apiOption.option_text,
    isCorrect: apiOption.is_correct
  };
}

/**
 * Transform API exam paper response to domain ExamPaper model
 */
export function transformExamPaper(apiPaper: ApiExamPaperResponse): ExamPaper {
  return {
    id: apiPaper.id,
    title: apiPaper.title,
    description: apiPaper.description,
    difficulty: apiPaper.difficulty as keyof typeof Difficulty,
    questionCount: apiPaper.question_count,
    durationMinutes: apiPaper.duration,
    tags: apiPaper.topics_covered,
    premium: apiPaper.is_premium,
    price: apiPaper.price,
    purchased: false, // This is set by the application based on user data
    universalAccess: false, // This is set by the application based on user data
    attemptCount: apiPaper.attempt_count,
    successRatePercent: apiPaper.success_rate_percent,
    lastUpdatedDate: apiPaper.last_updated,
    type: apiPaper.type as keyof typeof PaperType
  };
}

/**
 * Transform API exam attempt response to domain ExamAttempt model
 */
export function transformExamAttempt(apiAttempt: ApiExamAttemptResponse): ExamAttempt {
  return {
    id: apiAttempt.id,
    examId: apiAttempt.exam_id,
    userId: apiAttempt.user_id,
    startTime: apiAttempt.start_time,
    endTime: apiAttempt.end_time,
    status: apiAttempt.status as any, // Type assertion to match the enum
    answers: apiAttempt.answers?.map(transformUserAnswer) || []
  };
}

/**
 * Transform API user answer response to domain UserAnswer model
 */
export function transformUserAnswer(apiAnswer: ApiUserAnswerResponse): UserAnswer {
  return {
    questionId: apiAnswer.question_id,
    selectedOptionId: apiAnswer.selected_option_id,
    timeSpent: apiAnswer.time_spent
  };
}

/**
 * Transform API exam result response to domain ExamResult model
 */
export function transformExamResult(apiResult: ApiExamResultResponse): ExamResult {
  return {
    attemptId: apiResult.attempt_id,
    examId: apiResult.exam_id,
    examTitle: apiResult.exam_title,
    score: apiResult.score,
    totalMarks: apiResult.total_marks,
    passingMarks: apiResult.passing_marks,
    isPassed: apiResult.is_passed,
    timeSpent: apiResult.time_spent,
    totalQuestions: apiResult.total_questions,
    correctAnswers: apiResult.correct_answers,
    incorrectAnswers: apiResult.incorrect_answers,
    unanswered: apiResult.unanswered,
    completedAt: apiResult.completed_at,
    questionResults: apiResult.question_results.map(transformQuestionResult)
  };
}

/**
 * Transform API question result response to domain QuestionResult model
 */
export function transformQuestionResult(apiResult: ApiQuestionResultResponse): QuestionResult {
  return {
    questionId: apiResult.question_id,
    questionText: apiResult.question_text,
    userAnswerId: apiResult.user_answer_id,
    correctAnswerId: apiResult.correct_answer_id,
    isCorrect: apiResult.is_correct,
    explanation: apiResult.explanation,
    points: apiResult.points,
    earnedPoints: apiResult.earned_points
  };
}
```

### Step 3: Create API Services
Create API services in `/src/features/exams/api/services/index.ts`:

```typescript
import { apiClient } from '../../../core/api';
import {
  ApiExamResponse,
  ApiExamPaperResponse,
  ApiExamResultResponse,
  ApiExamAttemptResponse,
  CreateExamRequest,
  UpdateExamRequest,
  SubmitExamAttemptRequest
} from '../types';
import {
  PaperType,
  ExamStatus
} from '../../core/types';

// API Base Paths
const EXAMS_API_PATH = '/api/exams';
const PAPERS_API_PATH = '/api/exam-papers';
const ATTEMPTS_API_PATH = '/api/exam-attempts';
const RESULTS_API_PATH = '/api/exam-results';

// Exams CRUD Operations
export async function getExams() {
  const { data } = await apiClient.get<ApiExamResponse[]>(EXAMS_API_PATH);
  return data;
}

export async function getExamById(id: number | string) {
  const { data } = await apiClient.get<ApiExamResponse>(`${EXAMS_API_PATH}/${id}`);
  return data;
}

export async function createExam(exam: CreateExamRequest) {
  const { data } = await apiClient.post<ApiExamResponse>(EXAMS_API_PATH, exam);
  return data;
}

export async function updateExam(id: number | string, updates: UpdateExamRequest) {
  const { data } = await apiClient.put<ApiExamResponse>(`${EXAMS_API_PATH}/${id}`, updates);
  return data;
}

export async function deleteExam(id: number | string) {
  await apiClient.delete(`${EXAMS_API_PATH}/${id}`);
  return id;
}

export async function publishExam(id: number | string) {
  const { data } = await apiClient.patch<ApiExamResponse>(`${EXAMS_API_PATH}/${id}/publish`, {
    status: ExamStatus.PUBLISHED
  });
  return data;
}

export async function archiveExam(id: number | string) {
  const { data } = await apiClient.patch<ApiExamResponse>(`${EXAMS_API_PATH}/${id}/archive`, {
    status: ExamStatus.ARCHIVED
  });
  return data;
}

// Exam Papers Operations
export async function getExamPapers(type?: PaperType) {
  const params = type ? { type } : {};
  const { data } = await apiClient.get<ApiExamPaperResponse[]>(PAPERS_API_PATH, { params });
  return data;
}

export async function getExamPaperById(id: number | string) {
  const { data } = await apiClient.get<ApiExamPaperResponse>(`${PAPERS_API_PATH}/${id}`);
  return data;
}

// Exam Attempts Operations
export async function startExamAttempt(examId: number | string) {
  const { data } = await apiClient.post<ApiExamAttemptResponse>(`${ATTEMPTS_API_PATH}/start`, {
    exam_id: examId
  });
  return data;
}

export async function submitExamAttempt(attemptData: SubmitExamAttemptRequest) {
  const { data } = await apiClient.post<ApiExamAttemptResponse>(`${ATTEMPTS_API_PATH}/submit`, attemptData);
  return data;
}

export async function getExamAttemptById(id: number | string) {
  const { data } = await apiClient.get<ApiExamAttemptResponse>(`${ATTEMPTS_API_PATH}/${id}`);
  return data;
}

export async function getUserExamAttempts(userId: string) {
  const { data } = await apiClient.get<ApiExamAttemptResponse[]>(`${ATTEMPTS_API_PATH}/user/${userId}`);
  return data;
}

// Exam Results Operations
export async function getExamResult(attemptId: number | string) {
  const { data } = await apiClient.get<ApiExamResultResponse>(`${RESULTS_API_PATH}/${attemptId}`);
  return data;
}

export async function getUserExamResults(userId: string) {
  const { data } = await apiClient.get<ApiExamResultResponse[]>(`${RESULTS_API_PATH}/user/${userId}`);
  return data;
}
```

### Step 4: Create API Hooks with TanStack Query
Create API hooks in `/src/features/exams/api/hooks/index.ts`:

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  publishExam,
  archiveExam,
  getExamPapers,
  getExamPaperById,
  startExamAttempt,
  submitExamAttempt,
  getExamAttemptById,
  getUserExamAttempts,
  getExamResult,
  getUserExamResults
} from '../services';
import {
  transformExam,
  transformExamToCore,
  transformExamPaper,
  transformExamAttempt,
  transformExamResult
} from '../adapters';
import { PaperType, CreateExamRequest, UpdateExamRequest, SubmitExamAttemptRequest } from '../types';

// Query keys
export const examKeys = {
  all: ['exams'] as const,
  lists: () => [...examKeys.all, 'list'] as const,
  list: (filters: any) => [...examKeys.lists(), { filters }] as const,
  details: () => [...examKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...examKeys.details(), id] as const,
  papers: () => [...examKeys.all, 'papers'] as const,
  papersByType: (type: PaperType) => [...examKeys.papers(), type] as const,
  paperDetail: (id: number | string) => [...examKeys.papers(), 'detail', id] as const,
  attempts: () => [...examKeys.all, 'attempts'] as const,
  userAttempts: (userId: string) => [...examKeys.attempts(), 'user', userId] as const,
  attemptDetail: (id: number | string) => [...examKeys.attempts(), 'detail', id] as const,
  results: () => [...examKeys.all, 'results'] as const,
  userResults: (userId: string) => [...examKeys.results(), 'user', userId] as const,
  resultDetail: (attemptId: number | string) => [...examKeys.results(), 'detail', attemptId] as const,
};

// Exams hooks
export function useExamsQuery() {
  return useQuery({
    queryKey: examKeys.lists(),
    queryFn: async () => {
      const data = await getExams();
      return data.map(transformExamToCore);
    }
  });
}

export function useExamQuery(id: number | string) {
  return useQuery({
    queryKey: examKeys.detail(id),
    queryFn: async () => {
      const data = await getExamById(id);
      return transformExam(data);
    },
    enabled: !!id
  });
}

export function useCreateExamMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (exam: CreateExamRequest) => createExam(exam),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
    }
  });
}

export function useUpdateExamMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: number | string, updates: UpdateExamRequest }) => 
      updateExam(id, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: examKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
    }
  });
}

export function useDeleteExamMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number | string) => deleteExam(id),
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
      queryClient.removeQueries({ queryKey: examKeys.detail(id) });
    }
  });
}

export function usePublishExamMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number | string) => publishExam(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: examKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
    }
  });
}

export function useArchiveExamMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number | string) => archiveExam(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: examKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: examKeys.lists() });
    }
  });
}

// Exam Papers hooks
export function useExamPapersQuery(type?: PaperType) {
  return useQuery({
    queryKey: type ? examKeys.papersByType(type) : examKeys.papers(),
    queryFn: async () => {
      const data = await getExamPapers(type);
      return data.map(transformExamPaper);
    }
  });
}

export function useExamPaperQuery(id: number | string) {
  return useQuery({
    queryKey: examKeys.paperDetail(id),
    queryFn: async () => {
      const data = await getExamPaperById(id);
      return transformExamPaper(data);
    },
    enabled: !!id
  });
}

// Exam Attempts hooks
export function useStartExamAttemptMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (examId: number | string) => startExamAttempt(examId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: examKeys.attempts() });
      return transformExamAttempt(data);
    }
  });
}

export function useSubmitExamAttemptMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (attemptData: SubmitExamAttemptRequest) => submitExamAttempt(attemptData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: examKeys.attempts() });
      queryClient.invalidateQueries({ queryKey: examKeys.results() });
      return transformExamAttempt(data);
    }
  });
}

export function useExamAttemptQuery(id: number | string) {
  return useQuery({
    queryKey: examKeys.attemptDetail(id),
    queryFn: async () => {
      const data = await getExamAttemptById(id);
      return transformExamAttempt(data);
    },
    enabled: !!id
  });
}

export function useUserExamAttemptsQuery(userId: string) {
  return useQuery({
    queryKey: examKeys.userAttempts(userId),
    queryFn: async () => {
      const data = await getUserExamAttempts(userId);
      return data.map(transformExamAttempt);
    },
    enabled: !!userId
  });
}

// Exam Results hooks
export function useExamResultQuery(attemptId: number | string) {
  return useQuery({
    queryKey: examKeys.resultDetail(attemptId),
    queryFn: async () => {
      const data = await getExamResult(attemptId);
      return transformExamResult(data);
    },
    enabled: !!attemptId
  });
}

export function useUserExamResultsQuery(userId: string) {
  return useQuery({
    queryKey: examKeys.userResults(userId),
    queryFn: async () => {
      const data = await getUserExamResults(userId);
      return data.map(transformExamResult);
    },
    enabled: !!userId
  });
}
```

### Step 5: Create API Index File
Create the API index file at `/src/features/exams/api/index.ts`:

```typescript
// Re-export types
export * from './types';

// Re-export adapters
export * from './adapters';

// Re-export services
export * from './services';

// Re-export hooks
export * from './hooks';

// Define query keys for external usage
export { examKeys } from './hooks';
```

## Verification Criteria
- Core types defined covering all exams domain concepts
- Core utilities implemented for key calculations and formatting
- Core hooks created for common functionality
- Core state implemented with Zustand
- API types defined matching backend structure
- API adapters implemented to transform API data to domain models
- API services implemented for all CRUD operations
- API hooks implemented with TanStack Query
- All index files properly export the public API
- Code adheres to component design principles

## Time Estimate
Approximately 6 hours

## Dependencies
- Task 01: Create new exams feature directory structure

## Risks
- API contracts may change requiring adapter adjustments
- Integration with core module may require adjustments
- Some functionality might need to be moved between domains as the refactoring progresses
