# API Integration Guide

This guide provides detailed instructions for implementing the API integration layer (Phase 2 of the exams feature refactoring).

## Introduction

The API integration layer is responsible for:

1. Defining API endpoints as constants
2. Creating API services for direct API communication
3. Implementing data transformation and error handling
4. Creating store adapters to bridge between stores and services
5. Leveraging the TanStack Query API for efficient data fetching

## API Constants Implementation

### Step 1: Define API Endpoint Constants

First, ensure all API endpoints are defined as constants in a central location:

**src/features/exams/api/constants/endpoints.ts**

```typescript
/**
 * Exam API Endpoints Constants
 * 
 * This module defines all API endpoints for exam-related operations.
 */

// Base URL
const BASE_URL = '/api/v1/exams';

/**
 * Exam API Endpoints
 */
export const EXAM_ENDPOINTS = {
  // Base endpoint
  base: `${BASE_URL}`,
  
  // CRUD operations
  all: `${BASE_URL}`,
  byId: `${BASE_URL}/:id`,
  create: `${BASE_URL}`,
  update: `${BASE_URL}/:id`,
  patch: `${BASE_URL}/:id`,
  delete: `${BASE_URL}/:id`,
  
  // Custom endpoints
  published: `${BASE_URL}/published`,
  byStatus: `${BASE_URL}/status/:status`,
  stats: `${BASE_URL}/stats`,
  
  // Questions
  questions: `${BASE_URL}/:examId/questions`,
  getExamQuestions: `${BASE_URL}/:examId/questions`,
  updateQuestion: `${BASE_URL}/:examId/questions/:questionId`,
  deleteQuestion: `${BASE_URL}/:examId/questions/:questionId`,
  
  // Exam operations
  publishExam: `${BASE_URL}/:id/publish`,
  archiveExam: `${BASE_URL}/:id/archive`,
  
  // Paper types
  paperTypes: `${BASE_URL}/papers/types`,
  modelPapers: `${BASE_URL}/papers/model`,
  pastPapers: `${BASE_URL}/papers/past`,
  subjectPapers: `${BASE_URL}/papers/subject`,
  practicePapers: `${BASE_URL}/papers/practice`,
  
  // File upload
  uploadJson: `${BASE_URL}/papers/upload/json`,
};

/**
 * Attempt API Endpoints
 */
export const ATTEMPT_ENDPOINTS = {
  // Base endpoint
  base: `${BASE_URL}/attempts`,
  
  // CRUD operations
  all: `${BASE_URL}/attempts`,
  byId: `${BASE_URL}/attempts/:id`,
  create: `${BASE_URL}/attempts`,
  update: `${BASE_URL}/attempts/:id`,
  delete: `${BASE_URL}/attempts/:id`,
  
  // Custom endpoints
  byExam: `${BASE_URL}/:id/attempts`,
  byUser: `${BASE_URL}/attempts/user/:userId`,
  
  // Specific operations
  start: `${BASE_URL}/:examId/start`,
  submit: `${BASE_URL}/attempts/:id/submit`,
  result: `${BASE_URL}/attempts/:id/result`,
  answer: `${BASE_URL}/attempts/:attemptId/answer/:questionId`,
  flag: `${BASE_URL}/attempts/:attemptId/flag/:questionId`,
  unflag: `${BASE_URL}/attempts/:attemptId/flag/:questionId`,
  allFlags: `${BASE_URL}/attempts/:attemptId/flags`,
};

// Export all endpoints
export default {
  EXAM_ENDPOINTS,
  ATTEMPT_ENDPOINTS,
};
```

### Step 2: Define API Permission Constants

Add permission constants for access control:

**src/features/exams/api/constants/permissions.ts**

```typescript
/**
 * Exam API Permissions Constants
 * 
 * This module defines permission constants for exam-related operations.
 */

/**
 * Exam permissions
 */
export const EXAM_PERMISSIONS = {
  // Read permissions
  VIEW_EXAMS: 'view_exams',
  VIEW_PUBLISHED_EXAMS: 'view_published_exams',
  VIEW_EXAM_DETAILS: 'view_exam_details',
  VIEW_EXAM_STATS: 'view_exam_stats',
  
  // Write permissions
  CREATE_EXAM: 'create_exam',
  UPDATE_EXAM: 'update_exam',
  DELETE_EXAM: 'delete_exam',
  PUBLISH_EXAM: 'publish_exam',
  ARCHIVE_EXAM: 'archive_exam',
  
  // Question permissions
  VIEW_QUESTIONS: 'view_questions',
  CREATE_QUESTION: 'create_question',
  UPDATE_QUESTION: 'update_question',
  DELETE_QUESTION: 'delete_question',
  
  // Paper permissions
  VIEW_PAPERS: 'view_papers',
  UPLOAD_PAPER: 'upload_paper',
  
  // Premium permissions
  VIEW_PREMIUM_EXAM: 'view_premium_exam',
  CREATE_PREMIUM_EXAM: 'create_premium_exam',
};

/**
 * Attempt permissions
 */
export const ATTEMPT_PERMISSIONS = {
  START_EXAM: 'start_exam',
  SUBMIT_EXAM: 'submit_exam',
  VIEW_RESULTS: 'view_results',
  VIEW_ATTEMPT_HISTORY: 'view_attempt_history',
};

// Export all permissions
export default {
  EXAM_PERMISSIONS,
  ATTEMPT_PERMISSIONS,
};
```

### Step 3: Create Index File for Constants

**src/features/exams/api/constants/index.ts**

```typescript
/**
 * API Constants
 * 
 * This module exports all constants used in the API integration layer.
 */

export * from './endpoints';
export * from './permissions';
```

## API Services Implementation

### Step 1: Create Base API Service

First, let's create a base service that handles common functionality:

**src/features/exams/api/services/baseApiService.ts**

```typescript
/**
 * Base API Service
 * 
 * This service provides base functionality for all API services.
 */

import { apiClient } from '@/features/core/tanstack-query-api';
import logger from '@/shared/lib/logger';

/**
 * Base API service class
 */
export class BaseApiService {
  /**
   * Executes a GET request
   */
  protected async get<T = any>(url: string, config?: any): Promise<{ data?: T; error?: Error }> {
    try {
      const response = await apiClient.get(url, config);
      return { data: response.data };
    } catch (error) {
      logger.error(`GET request failed: ${url}`, { error });
      return { error: this.handleError(error) };
    }
  }

  /**
   * Executes a POST request
   */
  protected async post<T = any, D = any>(
    url: string,
    data?: D,
    config?: any
  ): Promise<{ data?: T; error?: Error }> {
    try {
      const response = await apiClient.post(url, data, config);
      return { data: response.data };
    } catch (error) {
      logger.error(`POST request failed: ${url}`, { error, data });
      return { error: this.handleError(error) };
    }
  }

  /**
   * Executes a PUT request
   */
  protected async put<T = any, D = any>(
    url: string,
    data?: D,
    config?: any
  ): Promise<{ data?: T; error?: Error }> {
    try {
      const response = await apiClient.put(url, data, config);
      return { data: response.data };
    } catch (error) {
      logger.error(`PUT request failed: ${url}`, { error, data });
      return { error: this.handleError(error) };
    }
  }

  /**
   * Executes a DELETE request
   */
  protected async delete<T = any>(url: string, config?: any): Promise<{ data?: T; error?: Error }> {
    try {
      const response = await apiClient.delete(url, config);
      return { data: response.data };
    } catch (error) {
      logger.error(`DELETE request failed: ${url}`, { error });
      return { error: this.handleError(error) };
    }
  }

  /**
   * Handles API errors
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with an error status
      const status = error.response.status;
      const message = error.response.data?.message || `Server error: ${status}`;
      
      // Create a more specific error
      const apiError = new Error(message);
      apiError.name = `ApiError${status}`;
      return apiError;
    } else if (error.request) {
      // Request was made but no response was received
      return new Error('No response received from server');
    } else {
      // Something else happened while setting up the request
      return error instanceof Error ? error : new Error(String(error));
    }
  }
}

export default BaseApiService;
```

### Step 2: Create API Service for Exams

Now, let's create a service specifically for exam-related operations:

**src/features/exams/api/services/examApiService.ts**

```typescript
/**
 * Exam API Service
 * 
 * This service provides methods for interacting with exam-related APIs.
 */

import { BaseApiService } from './baseApiService';
import { EXAM_ENDPOINTS } from '../constants/endpoints';
import { 
  transformExam, 
  transformExamList, 
  transformQuestions 
} from '../utils/transformers';
import type { Exam, Question, ExamStats } from '../../core/types';

/**
 * Exam API service
 */
export class ExamApiService extends BaseApiService {
  /**
   * Get all exams
   */
  async getExams() {
    const response = await this.get<any>(EXAM_ENDPOINTS.all);
    return {
      ...response,
      data: response.data ? transformExamList(response.data) : undefined
    };
  }

  /**
   * Get exam by ID
   */
  async getExamById(id: number) {
    const url = EXAM_ENDPOINTS.byId.replace(':id', id.toString());
    const response = await this.get<any>(url);
    return {
      ...response,
      data: response.data ? transformExam(response.data) : undefined
    };
  }

  /**
   * Get published exams
   */
  async getPublishedExams() {
    const response = await this.get<any>(EXAM_ENDPOINTS.published);
    return {
      ...response,
      data: response.data ? transformExamList(response.data) : undefined
    };
  }

  /**
   * Get exams by status
   */
  async getExamsByStatus(status: string) {
    const url = EXAM_ENDPOINTS.byStatus.replace(':status', status);
    const response = await this.get<any>(url);
    return {
      ...response,
      data: response.data ? transformExamList(response.data) : undefined
    };
  }

  /**
   * Get exam stats
   */
  async getExamStats() {
    const response = await this.get<ExamStats>(EXAM_ENDPOINTS.stats);
    return response;
  }

  /**
   * Create a new exam
   */
  async createExam(examData: Partial<Exam>) {
    const response = await this.post<Exam, Partial<Exam>>(
      EXAM_ENDPOINTS.create,
      examData
    );
    return {
      ...response,
      data: response.data ? transformExam(response.data) : undefined
    };
  }

  /**
   * Update an exam
   */
  async updateExam(id: number, examData: Partial<Exam>) {
    const url = EXAM_ENDPOINTS.update.replace(':id', id.toString());
    const response = await this.put<Exam, Partial<Exam>>(url, examData);
    return {
      ...response,
      data: response.data ? transformExam(response.data) : undefined
    };
  }

  /**
   * Delete an exam
   */
  async deleteExam(id: number) {
    const url = EXAM_ENDPOINTS.delete.replace(':id', id.toString());
    return await this.delete(url);
  }

  /**
   * Publish an exam
   */
  async publishExam(id: number) {
    const url = EXAM_ENDPOINTS.publishExam.replace(':id', id.toString());
    const response = await this.post<Exam>(url);
    return {
      ...response,
      data: response.data ? transformExam(response.data) : undefined
    };
  }

  /**
   * Archive an exam
   */
  async archiveExam(id: number) {
    const url = EXAM_ENDPOINTS.archiveExam.replace(':id', id.toString());
    const response = await this.post<Exam>(url);
    return {
      ...response,
      data: response.data ? transformExam(response.data) : undefined
    };
  }

  /**
   * Get exam questions
   */
  async getExamQuestions(examId: number) {
    const url = EXAM_ENDPOINTS.questions.replace(':examId', examId.toString());
    const response = await this.get<any>(url);
    return {
      ...response,
      data: response.data ? transformQuestions(response.data) : undefined
    };
  }

  /**
   * Update a question
   */
  async updateQuestion(examId: number, questionId: number, questionData: Partial<Question>) {
    const url = EXAM_ENDPOINTS.updateQuestion
      .replace(':examId', examId.toString())
      .replace(':questionId', questionId.toString());
    
    const response = await this.put<Question, Partial<Question>>(
      url,
      questionData
    );
    
    return response;
  }

  /**
   * Delete a question
   */
  async deleteQuestion(examId: number, questionId: number) {
    const url = EXAM_ENDPOINTS.deleteQuestion
      .replace(':examId', examId.toString())
      .replace(':questionId', questionId.toString());
    
    return await this.delete(url);
  }

  /**
   * Upload a JSON exam
   */
  async uploadJsonExam(jsonData: any) {
    const response = await this.post(EXAM_ENDPOINTS.uploadJson, jsonData);
    return response;
  }
}

// Create singleton instance
export const examApiService = new ExamApiService();

export default examApiService;
```

### Step 3: Create API Service for Attempts

**src/features/exams/api/services/attemptApiService.ts**

```typescript
/**
 * Attempt API Service
 * 
 * This service provides methods for interacting with exam attempt APIs.
 */

import { BaseApiService } from './baseApiService';
import { ATTEMPT_ENDPOINTS } from '../constants/endpoints';
import { 
  transformAttempt, 
  transformAttemptList, 
  transformResult 
} from '../utils/transformers';
import type { 
  ExamAttempt, 
  UserAnswer, 
  ExamResult, 
  FlaggedQuestion 
} from '../../core/types';

/**
 * Attempt API service
 */
export class AttemptApiService extends BaseApiService {
  /**
   * Get attempt by ID
   */
  async getAttemptById(id: number) {
    const url = ATTEMPT_ENDPOINTS.byId.replace(':id', id.toString());
    const response = await this.get<any>(url);
    return {
      ...response,
      data: response.data ? transformAttempt(response.data) : undefined
    };
  }

  /**
   * Get attempts by exam ID
   */
  async getAttemptsByExamId(examId: number) {
    const url = ATTEMPT_ENDPOINTS.byExam.replace(':id', examId.toString());
    const response = await this.get<any>(url);
    return {
      ...response,
      data: response.data ? transformAttemptList(response.data) : undefined
    };
  }

  /**
   * Get attempts by user ID
   */
  async getAttemptsByUserId(userId: string) {
    const url = ATTEMPT_ENDPOINTS.byUser.replace(':userId', userId);
    const response = await this.get<any>(url);
    return {
      ...response,
      data: response.data ? transformAttemptList(response.data) : undefined
    };
  }

  /**
   * Start a new exam attempt
   */
  async startExam(examId: number, userData?: any) {
    const url = ATTEMPT_ENDPOINTS.start.replace(':examId', examId.toString());
    const response = await this.post<any>(url, userData);
    return {
      ...response,
      data: response.data ? transformAttempt(response.data) : undefined
    };
  }

  /**
   * Submit an exam attempt
   */
  async submitExam(attemptId: number, answers?: UserAnswer[]) {
    const url = ATTEMPT_ENDPOINTS.submit.replace(':id', attemptId.toString());
    const response = await this.post<any>(url, { answers });
    return {
      ...response,
      data: response.data ? transformResult(response.data) : undefined
    };
  }

  /**
   * Get exam result
   */
  async getExamResult(attemptId: number) {
    const url = ATTEMPT_ENDPOINTS.result.replace(':id', attemptId.toString());
    const response = await this.get<any>(url);
    return {
      ...response,
      data: response.data ? transformResult(response.data) : undefined
    };
  }

  /**
   * Save answer for a question
   */
  async answerQuestion(
    attemptId: number,
    questionId: number,
    selectedOptionId: number,
    timeSpent?: number
  ) {
    const url = ATTEMPT_ENDPOINTS.answer
      .replace(':attemptId', attemptId.toString())
      .replace(':questionId', questionId.toString());
    
    return await this.post(url, { selectedOptionId, timeSpent });
  }

  /**
   * Flag a question
   */
  async flagQuestion(attemptId: number, questionId: number) {
    const url = ATTEMPT_ENDPOINTS.flag
      .replace(':attemptId', attemptId.toString())
      .replace(':questionId', questionId.toString());
    
    return await this.post(url);
  }

  /**
   * Unflag a question
   */
  async unflagQuestion(attemptId: number, questionId: number) {
    const url = ATTEMPT_ENDPOINTS.unflag
      .replace(':attemptId', attemptId.toString())
      .replace(':questionId', questionId.toString());
    
    return await this.delete(url);
  }

  /**
   * Get all flagged questions for an attempt
   */
  async getFlaggedQuestions(attemptId: number) {
    const url = ATTEMPT_ENDPOINTS.allFlags.replace(':attemptId', attemptId.toString());
    const response = await this.get<FlaggedQuestion[]>(url);
    return response;
  }
}

// Create singleton instance
export const attemptApiService = new AttemptApiService();

export default attemptApiService;
```

### Step 4: Create Index File for Services

**src/features/exams/api/services/index.ts**

```typescript
/**
 * API Services
 * 
 * This module exports all API services.
 */

export * from './baseApiService';
export * from './examApiService';
export * from './attemptApiService';
```

## API Transformers Implementation

Create utility functions for transforming API responses to ensure consistent data structures:

**src/features/exams/api/utils/transformers.ts**

```typescript
/**
 * API Transformers
 * 
 * This module provides utility functions for transforming API responses.
 */

import type {
  Exam,
  Question,
  Option,
  ExamAttempt,
  ExamResult,
  QuestionResult,
  UserAnswer,
} from '../../core/types';

/**
 * Transforms exam data from API format to app format
 */
export function transformExam(data: any): Exam {
  // Handle nested data structure
  const examData = data.data || data;
  
  return {
    id: examData.id,
    title: examData.title || '',
    description: examData.description || '',
    duration: examData.duration || examData.durationMinutes || 0,
    questionCount: 
      examData.questionCount || 
      (Array.isArray(examData.questions) ? examData.questions.length : 0),
    totalMarks: examData.totalMarks || 0,
    passingMarks: examData.passingMarks || 0,
    status: examData.status || 'DRAFT',
    paperType: examData.paperType || undefined,
    isPremium: examData.isPremium || false,
    price: examData.price || 0,
    questions: examData.questions 
      ? transformQuestions(examData.questions) 
      : undefined,
    createdAt: examData.createdAt,
    updatedAt: examData.updatedAt,
  };
}

/**
 * Transforms a list of exams
 */
export function transformExamList(data: any): Exam[] {
  // Handle various data structures
  let examsList: any[] = [];
  
  if (Array.isArray(data)) {
    examsList = data;
  } else if (data.data && Array.isArray(data.data)) {
    examsList = data.data;
  } else if (data.content && Array.isArray(data.content)) {
    examsList = data.content;
  }
  
  return examsList.map(transformExam);
}

/**
 * Transforms option data
 */
export function transformOption(data: any): Option {
  return {
    id: data.id,
    questionId: data.questionId,
    text: data.text || data.optionText || data.label || '',
    label: data.label || data.optionKey || '',
    isCorrect: data.isCorrect || false,
  };
}

/**
 * Transforms question data
 */
export function transformQuestion(data: any): Question {
  return {
    id: data.id,
    examId: data.examId,
    text: data.text || data.questionText || '',
    questionText: data.questionText || data.text || '',
    questionNumber: data.questionNumber || data.number || undefined,
    marks: data.marks || 1,
    explanation: data.explanation || '',
    options: Array.isArray(data.options) 
      ? data.options.map(transformOption) 
      : [],
  };
}

/**
 * Transforms a list of questions
 */
export function transformQuestions(data: any): Question[] {
  // Handle various data structures
  let questionsList: any[] = [];
  
  if (Array.isArray(data)) {
    questionsList = data;
  } else if (data.data && Array.isArray(data.data)) {
    questionsList = data.data;
  } else if (data.questions && Array.isArray(data.questions)) {
    questionsList = data.questions;
  }
  
  return questionsList.map(transformQuestion);
}

/**
 * Transforms attempt data
 */
export function transformAttempt(data: any): ExamAttempt {
  // Handle nested data structure
  const attemptData = data.data || data;
  
  return {
    id: attemptData.id,
    examId: attemptData.examId,
    userId: attemptData.userId || '',
    startTime: attemptData.startTime || new Date().toISOString(),
    endTime: attemptData.endTime,
    status: attemptData.status || 'IN_PROGRESS',
    score: attemptData.score,
    isPassed: attemptData.isPassed,
  };
}

/**
 * Transforms a list of attempts
 */
export function transformAttemptList(data: any): ExamAttempt[] {
  // Handle various data structures
  let attemptsList: any[] = [];
  
  if (Array.isArray(data)) {
    attemptsList = data;
  } else if (data.data && Array.isArray(data.data)) {
    attemptsList = data.data;
  } else if (data.content && Array.isArray(data.content)) {
    attemptsList = data.content;
  }
  
  return attemptsList.map(transformAttempt);
}

/**
 * Transforms question result data
 */
export function transformQuestionResult(data: any): QuestionResult {
  return {
    questionId: data.questionId,
    userAnswer: data.userAnswer || data.selectedOption || 0,
    correctAnswer: data.correctAnswer || data.correctOption || 0,
    isCorrect: data.isCorrect || false,
    points: data.points || data.marks || 0,
    explanation: data.explanation || '',
  };
}

/**
 * Transforms exam result data
 */
export function transformResult(data: any): ExamResult {
  // Handle nested data structure
  const resultData = data.data || data;
  
  return {
    attemptId: resultData.attemptId || resultData.id,
    examId: resultData.examId,
    examTitle: resultData.examTitle || resultData.title || '',
    score: resultData.score || 0,
    totalMarks: resultData.totalMarks || 0,
    passingMarks: resultData.passingMarks || 0,
    isPassed: resultData.isPassed || false,
    timeSpent: resultData.timeSpent || 0,
    totalQuestions: resultData.totalQuestions || 0,
    correctAnswers: resultData.correctAnswers || 0,
    incorrectAnswers: resultData.incorrectAnswers || 0,
    unanswered: resultData.unanswered || 0,
    completedAt: resultData.completedAt || resultData.endTime || new Date().toISOString(),
    questionResults: Array.isArray(resultData.questionResults) 
      ? resultData.questionResults.map(transformQuestionResult) 
      : [],
  };
}

/**
 * Transforms user answer data
 */
export function transformUserAnswer(data: any): UserAnswer {
  return {
    questionId: data.questionId,
    selectedOption: data.selectedOption || data.selectedOptionId || 0,
    timeSpent: data.timeSpent || 0,
  };
}
```

## Store Adapters Implementation

Create adapter classes that bridge between Zustand stores and API services:

**src/features/exams/api/services/adapters/examTakingAdapter.ts**

```typescript
/**
 * Exam Taking Adapter
 * 
 * This adapter bridges between the exam taking store and API services.
 */

import { examApiService } from '../examApiService';
import { attemptApiService } from '../attemptApiService';
import type {
  Exam,
  Question,
  ExamAttempt,
  FlaggedQuestion,
  UserAnswer,
  ExamResult,
} from '../../../core/types';

/**
 * Exam Taking Adapter
 * Provides simplified methods for the exam taking store to interact with API services
 */
export const examTakingAdapter = {
  /**
   * Get exam by ID
   */
  getExamById: async (examId: number): Promise<Exam | null> => {
    const response = await examApiService.getExamById(examId);
    return response.data || null;
  },
  
  /**
   * Get exam questions
   */
  getExamQuestions: async (examId: number): Promise<Question[]> => {
    const response = await examApiService.getExamQuestions(examId);
    return response.data || [];
  },
  
  /**
   * Start an exam
   */
  startExam: async (examId: number, userData?: any): Promise<ExamAttempt | null> => {
    const response = await attemptApiService.startExam(examId, userData);
    return response.data || null;
  },
  
  /**
   * Get exam attempt
   */
  getExamAttempt: async (attemptId: number): Promise<ExamAttempt | null> => {
    const response = await attemptApiService.getAttemptById(attemptId);
    return response.data || null;
  },
  
  /**
   * Answer a question
   */
  answerQuestion: async (
    attemptId: number,
    questionId: number,
    selectedOptionId: number,
    timeSpent?: number
  ): Promise<boolean> => {
    const response = await attemptApiService.answerQuestion(
      attemptId,
      questionId,
      selectedOptionId,
      timeSpent
    );
    return !response.error;
  },
  
  /**
   * Flag a question
   */
  flagQuestion: async (attemptId: number, questionId: number): Promise<boolean> => {
    const response = await attemptApiService.flagQuestion(attemptId, questionId);
    return !response.error;
  },
  
  /**
   * Unflag a question
   */
  unflagQuestion: async (attemptId: number, questionId: number): Promise<boolean> => {
    const response = await attemptApiService.unflagQuestion(attemptId, questionId);
    return !response.error;
  },
  
  /**
   * Get flagged questions
   */
  getFlaggedQuestions: async (attemptId: number): Promise<FlaggedQuestion[]> => {
    const response = await attemptApiService.getFlaggedQuestions(attemptId);
    return response.data || [];
  },
  
  /**
   * Submit an exam
   */
  submitExam: async (attemptId: number, answers?: UserAnswer[]): Promise<ExamResult | null> => {
    const response = await attemptApiService.submitExam(attemptId, answers);
    return response.data || null;
  },
  
  /**
   * Get exam result
   */
  getExamResult: async (attemptId: number): Promise<ExamResult | null> => {
    const response = await attemptApiService.getExamResult(attemptId);
    return response.data || null;
  }
};

export default examTakingAdapter;
```

**src/features/exams/api/services/adapters/examManagementAdapter.ts**

```typescript
/**
 * Exam Management Adapter
 * 
 * This adapter bridges between the exam management store and API services.
 */

import { examApiService } from '../examApiService';
import type {
  Exam,
  Question,
} from '../../../core/types';

/**
 * Exam Management Adapter
 * Provides simplified methods for the exam management store to interact with API services
 */
export const examManagementAdapter = {
  /**
   * Get all exams
   */
  getExams: async (): Promise<Exam[]> => {
    const response = await examApiService.getExams();
    return response.data || [];
  },
  
  /**
   * Get exams by status
   */
  getExamsByStatus: async (status: string): Promise<Exam[]> => {
    const response = await examApiService.getExamsByStatus(status);
    return response.data || [];
  },
  
  /**
   * Create a new exam
   */
  createExam: async (examData: Partial<Exam>): Promise<Exam | null> => {
    const response = await examApiService.createExam(examData);
    return response.data || null;
  },
  
  /**
   * Update an exam
   */
  updateExam: async (examId: number, examData: Partial<Exam>): Promise<Exam | null> => {
    const response = await examApiService.updateExam(examId, examData);
    return response.data || null;
  },
  
  /**
   * Delete an exam
   */
  deleteExam: async (examId: number): Promise<boolean> => {
    const response = await examApiService.deleteExam(examId);
    return !response.error;
  },
  
  /**
   * Publish an exam
   */
  publishExam: async (examId: number): Promise<Exam | null> => {
    const response = await examApiService.publishExam(examId);
    return response.data || null;
  },
  
  /**
   * Archive an exam
   */
  archiveExam: async (examId: number): Promise<Exam | null> => {
    const response = await examApiService.archiveExam(examId);
    return response.data || null;
  },
  
  /**
   * Update a question
   */
  updateQuestion: async (
    examId: number,
    questionId: number,
    questionData: Partial<Question>
  ): Promise<Question | null> => {
    const response = await examApiService.updateQuestion(examId, questionId, questionData);
    return response.data || null;
  },
  
  /**
   * Delete a question
   */
  deleteQuestion: async (examId: number, questionId: number): Promise<boolean> => {
    const response = await examApiService.deleteQuestion(examId, questionId);
    return !response.error;
  },
  
  /**
   * Upload a JSON exam
   */
  uploadJsonExam: async (jsonData: any): Promise<any> => {
    const response = await examApiService.uploadJsonExam(jsonData);
    return response.data || null;
  }
};

export default examManagementAdapter;
```

**src/features/exams/api/services/adapters/index.ts**

```typescript
/**
 * API Adapters
 * 
 * This module exports all API adapters.
 */

export * from './examTakingAdapter';
export * from './examManagementAdapter';
```

## TanStack Query API Hooks Implementation

Create hooks using the `createApiHooks` factory:

**src/features/exams/api/hooks/useExamApiHooks.ts**

```typescript
/**
 * Exam API Hooks
 *
 * This module provides React hooks for interacting with exam-related APIs.
 * It leverages the createApiHooks factory from tanstack-query-api.
 */
import { createApiHooks } from '@/features/core/tanstack-query-api/factories/createApiHooks';
import { useQueryClient } from '@tanstack/react-query';
import { EXAM_ENDPOINTS } from '../constants/endpoints';
import type {
  Exam,
  ExamStatus,
  Question,
  ExamStats,
} from '../../core/types';

/**
 * Create standard CRUD hooks for exams
 */
export const examApiHooks = createApiHooks<Exam>(
  {
    ...EXAM_ENDPOINTS,
    // Map the endpoints to match what createApiHooks expects
    list: EXAM_ENDPOINTS.all,
    detail: EXAM_ENDPOINTS.byId
  },
  {
    resourceName: 'exams',
    requiresAuth: true,
    defaultStaleTime: 5 * 60 * 1000 // 5 minutes
  }
);

/**
 * Extended exam query keys
 */
export const examQueryKeys = {
  ...examApiHooks.queryKeys,
  published: () => [...examApiHooks.queryKeys.all(), 'published'] as const,
  byStatus: (status: ExamStatus) => 
    [...examApiHooks.queryKeys.all(), 'status', status.toString()] as const,
  questions: (examId: number) => 
    [...examApiHooks.queryKeys.detail(examId), 'questions'] as const,
  stats: () => [...examApiHooks.queryKeys.all(), 'stats'] as const,
};

/**
 * Hook for fetching published exams
 */
export const usePublishedExams = () => {
  return examApiHooks.useCustomQuery<Exam[]>(
    'published',
    'published',
    {
      requiresAuth: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for fetching exams by status
 */
export const useExamsByStatus = (status: ExamStatus) => {
  return examApiHooks.useCustomQuery<Exam[]>(
    'byStatus',
    ['status', status],
    {
      enabled: !!status,
      staleTime: 5 * 60 * 1000, // 5 minutes
      urlParams: {
        status: status.toString()
      }
    }
  );
};

/**
 * Hook for fetching exam questions
 */
export const useExamQuestions = (examId: number) => {
  return examApiHooks.useCustomQuery<Question[]>(
    'questions',
    ['questions', examId],
    {
      enabled: !!examId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      urlParams: {
        examId: examId ? String(examId) : '0'
      }
    }
  );
};

/**
 * Hook for fetching exam statistics
 */
export const useExamStats = () => {
  return examApiHooks.useCustomQuery<ExamStats>(
    'examStats',
    'stats',
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

/**
 * Hook for publishing an exam
 */
export const usePublishExamMutation = (examId: number) => {
  const queryClient = useQueryClient();
  const endpoint = EXAM_ENDPOINTS.publishExam.replace(':id', examId.toString());

  return examApiHooks.useAction<Exam, void>(
    endpoint,
    {
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examQueryKeys.detail(examId));
        queryClient.invalidateQueries(examQueryKeys.lists());
        queryClient.invalidateQueries(examQueryKeys.published());
      }
    }
  );
};

/**
 * Hook for archiving an exam
 */
export const useArchiveExamMutation = (examId: number) => {
  const queryClient = useQueryClient();
  const endpoint = EXAM_ENDPOINTS.archiveExam.replace(':id', examId.toString());

  return examApiHooks.useAction<Exam, void>(
    endpoint,
    {
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examQueryKeys.detail(examId));
        queryClient.invalidateQueries(examQueryKeys.lists());
        queryClient.invalidateQueries(examQueryKeys.published());
      }
    }
  );
};

/**
 * Hook for updating a question in an exam
 */
export const useUpdateQuestionMutation = (examId: number, questionId: number) => {
  const queryClient = useQueryClient();
  const endpoint = EXAM_ENDPOINTS.updateQuestion
    .replace(':examId', examId.toString())
    .replace(':questionId', questionId.toString());

  return examApiHooks.useAction<Question, Partial<Question>>(
    endpoint,
    {
      method: 'PUT',
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examQueryKeys.questions(examId));
      }
    }
  );
};

/**
 * Hook for deleting a question from an exam
 */
export const useDeleteQuestionMutation = (examId: number, questionId: number) => {
  const queryClient = useQueryClient();
  const endpoint = EXAM_ENDPOINTS.deleteQuestion
    .replace(':examId', examId.toString())
    .replace(':questionId', questionId.toString());

  return examApiHooks.useAction<void, void>(
    endpoint,
    {
      method: 'DELETE',
      onSuccess: () => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(examQueryKeys.questions(examId));
        queryClient.invalidateQueries(examQueryKeys.detail(examId));
      }
    }
  );
};

// Export standard CRUD hooks with more descriptive names
export const {
  useList: useExamsList,
  useDetail: useExamDetail,
  useCreate: useCreateExam,
  useUpdate: useUpdateExam,
  usePatch: usePatchExam,
  useDelete: useDeleteExam,
} = examApiHooks;

// Export everything as a combined object for convenience
export const examHooks = {
  // Standard CRUD hooks
  useExamsList,
  useExamDetail,
  useCreateExam,
  useUpdateExam,
  usePatchExam,
  useDeleteExam,

  // Specialized exam hooks
  usePublishedExams,
  useExamsByStatus,
  useExamQuestions,
  useExamStats,

  // Action hooks
  usePublishExamMutation,
  useArchiveExamMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,

  // Query keys
  queryKeys: examQueryKeys,
};

// Default export
export default examHooks;
```

**src/features/exams/api/hooks/useExamAttemptHooks.ts**

```typescript
/**
 * Exam Attempt API Hooks
 *
 * This module provides React hooks for interacting with exam attempt APIs.
 * It leverages the createApiHooks factory from tanstack-query-api.
 */
import { createApiHooks } from '@/features/core/tanstack-query-api/factories/createApiHooks';
import { useQueryClient } from '@tanstack/react-query';
import { ATTEMPT_ENDPOINTS } from '../constants/endpoints';
import { examQueryKeys } from './useExamApiHooks';
import type {
  ExamAttempt,
  UserAnswer,
  ExamResult,
  FlaggedQuestion,
} from '../../core/types';

/**
 * Create standard CRUD hooks for attempts
 */
export const attemptApiHooks = createApiHooks<ExamAttempt>(
  {
    ...ATTEMPT_ENDPOINTS,
    // Map the endpoints to match what createApiHooks expects
    list: ATTEMPT_ENDPOINTS.all,
    detail: ATTEMPT_ENDPOINTS.byId
  },
  {
    resourceName: 'attempts',
    requiresAuth: true,
    defaultStaleTime: 5 * 60 * 1000 // 5 minutes
  }
);

/**
 * Extended attempt query keys
 */
export const attemptQueryKeys = {
  ...attemptApiHooks.queryKeys,
  byExam: (examId: number) => 
    [...attemptApiHooks.queryKeys.all(), 'exam', examId] as const,
  byUser: (userId: string) => 
    [...attemptApiHooks.queryKeys.all(), 'user', userId] as const,
  result: (attemptId: number) => 
    [...attemptApiHooks.queryKeys.detail(attemptId), 'result'] as const,
  flags: (attemptId: number) => 
    [...attemptApiHooks.queryKeys.detail(attemptId), 'flags'] as const,
};

/**
 * Hook for fetching attempts by exam ID
 */
export const useAttemptsByExamId = (examId: number) => {
  return attemptApiHooks.useCustomQuery<ExamAttempt[]>(
    'byExam',
    ['exam', examId],
    {
      enabled: !!examId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      urlParams: {
        id: examId ? String(examId) : '0'
      }
    }
  );
};

/**
 * Hook for fetching attempts by user ID
 */
export const useAttemptsByUserId = (userId: string) => {
  return attemptApiHooks.useCustomQuery<ExamAttempt[]>(
    'byUser',
    ['user', userId],
    {
      enabled: !!userId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      urlParams: {
        userId
      }
    }
  );
};

/**
 * Hook for starting an exam
 */
export const useStartExamMutation = (examId: number) => {
  const queryClient = useQueryClient();
  const endpoint = ATTEMPT_ENDPOINTS.start.replace(':examId', examId.toString());

  return attemptApiHooks.useAction<ExamAttempt, any>(
    endpoint,
    {
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(attemptQueryKeys.byExam(examId));
        if (data?.id) {
          queryClient.invalidateQueries(attemptQueryKeys.detail(data.id));
        }
      }
    }
  );
};

/**
 * Hook for answering a question
 */
export const useAnswerQuestionMutation = (attemptId: number, questionId: number) => {
  const queryClient = useQueryClient();
  const endpoint = ATTEMPT_ENDPOINTS.answer
    .replace(':attemptId', attemptId.toString())
    .replace(':questionId', questionId.toString());

  return attemptApiHooks.useAction<void, { selectedOptionId: string | number, timeSpent?: number }>(
    endpoint,
    {
      onSuccess: () => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(attemptQueryKeys.detail(attemptId));
      }
    }
  );
};

/**
 * Hook for flagging a question
 */
export const useFlagQuestionMutation = (attemptId: number, questionId: number) => {
  const queryClient = useQueryClient();
  const endpoint = ATTEMPT_ENDPOINTS.flag
    .replace(':attemptId', attemptId.toString())
    .replace(':questionId', questionId.toString());

  return attemptApiHooks.useAction<void, void>(
    endpoint,
    {
      onSuccess: () => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(attemptQueryKeys.flags(attemptId));
      }
    }
  );
};

/**
 * Hook for unflagging a question
 */
export const useUnflagQuestionMutation = (attemptId: number, questionId: number) => {
  const queryClient = useQueryClient();
  const endpoint = ATTEMPT_ENDPOINTS.unflag
    .replace(':attemptId', attemptId.toString())
    .replace(':questionId', questionId.toString());

  return attemptApiHooks.useAction<void, void>(
    endpoint,
    {
      method: 'DELETE',
      onSuccess: () => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(attemptQueryKeys.flags(attemptId));
      }
    }
  );
};

/**
 * Hook for fetching flagged questions
 */
export const useFlaggedQuestions = (attemptId: number) => {
  return attemptApiHooks.useCustomQuery<FlaggedQuestion[]>(
    'flags',
    ['flags', attemptId],
    {
      enabled: !!attemptId,
      staleTime: 1 * 60 * 1000, // 1 minute
      urlParams: {
        attemptId: attemptId ? String(attemptId) : '0'
      }
    }
  );
};

/**
 * Hook for submitting an exam
 */
export const useSubmitExamMutation = (attemptId: number) => {
  const queryClient = useQueryClient();
  const endpoint = ATTEMPT_ENDPOINTS.submit.replace(':id', attemptId.toString());

  return attemptApiHooks.useAction<ExamResult, UserAnswer[]>(
    endpoint,
    {
      onSuccess: (data) => {
        // Invalidate relevant queries
        queryClient.invalidateQueries(attemptQueryKeys.detail(attemptId));
        queryClient.invalidateQueries(attemptQueryKeys.result(attemptId));
        if (data?.examId) {
          queryClient.invalidateQueries(examQueryKeys.detail(data.examId));
        }
      }
    }
  );
};

/**
 * Hook for fetching exam result
 */
export const useExamResult = (attemptId: number) => {
  return attemptApiHooks.useCustomQuery<ExamResult>(
    'result',
    ['result', attemptId],
    {
      enabled: !!attemptId,
      staleTime: 10 * 60 * 1000, // 10 minutes
      urlParams: {
        id: attemptId ? String(attemptId) : '0'
      }
    }
  );
};

// Export standard CRUD hooks with more descriptive names
export const {
  useList: useAttemptsList,
  useDetail: useAttemptDetail,
  useCreate: useCreateAttempt,
  useUpdate: useUpdateAttempt,
  useDelete: useDeleteAttempt,
} = attemptApiHooks;

// Export everything as a combined object for convenience
export const attemptHooks = {
  // Standard CRUD hooks
  useAttemptsList,
  useAttemptDetail,
  useCreateAttempt,
  useUpdateAttempt,
  useDeleteAttempt,

  // Specialized attempt hooks
  useAttemptsByExamId,
  useAttemptsByUserId,
  useFlaggedQuestions,
  useExamResult,

  // Action hooks
  useStartExamMutation,
  useAnswerQuestionMutation,
  useFlagQuestionMutation,
  useUnflagQuestionMutation,
  useSubmitExamMutation,

  // Query keys
  queryKeys: attemptQueryKeys,
};

// Default export
export default attemptHooks;
```

**src/features/exams/api/hooks/index.ts**

```typescript
/**
 * API Hooks Index
 * 
 * This module exports all API hooks.
 */

export * from './useExamApiHooks';
export * from './useExamAttemptHooks';

// Import for backward compatibility aliases
import { examHooks } from './useExamApiHooks';
import { attemptHooks } from './useExamAttemptHooks';

// Create a compatible version of examApiHooks that keeps the old structure
export const examApiHooks = {
  ...examHooks,
  attempts: attemptHooks,
  
  // Add direct access to methods from examHooks
  useList: examHooks.useExamsList,
  useDetail: examHooks.useExamDetail,
  useCreate: examHooks.useCreateExam,
  useUpdate: examHooks.useUpdateExam,
  usePatch: examHooks.usePatchExam,
  useDelete: examHooks.useDeleteExam,
  
  // Add query keys
  queryKeys: examHooks.queryKeys
};

// Default export
export default examApiHooks;
```

## API Module Index

Finally, create an index.ts file for the API module:

**src/features/exams/api/index.ts**

```typescript
/**
 * API Module
 * 
 * This module exports all API-related functionality.
 */

// Export constants
export * from './constants';

// Export services
export * from './services';
export * from './services/adapters';

// Export hooks
export * from './hooks';

// Export utils
export * from './utils/transformers';
```

## Using the API Layer in Zustand Stores

Here's an example of how to use the API layer in a Zustand store:

```typescript
import { create } from 'zustand';
import { examTakingAdapter } from '../api/services/adapters';

interface ExamTakingState {
  // ... state properties
}

interface ExamTakingActions {
  startExam: (examId: number, userId: string) => Promise<void>;
  // ... other actions
}

export const useExamTakingStore = create<ExamTakingState & ExamTakingActions>((set, get) => ({
  // ... state initialization
  
  startExam: async (examId, userId) => {
    set({ isStarting: true, error: null });
    
    try {
      // Use adapter to call API
      const exam = await examTakingAdapter.getExamById(examId);
      if (!exam) {
        throw new Error('Exam not found');
      }
      
      const attempt = await examTakingAdapter.startExam(examId, { userId });
      if (!attempt) {
        throw new Error('Failed to start exam');
      }
      
      const questions = await examTakingAdapter.getExamQuestions(examId);
      
      // Update state with API response
      set({
        examId,
        attemptId: attempt.id,
        currentExam: exam,
        questions,
        // ... other state updates
        isStarting: false,
      });
    } catch (error) {
      set({ 
        isStarting: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      // Re-throw for component handling
      throw error;
    }
  },
  
  // ... other actions
}));
```

## Using React Query Hooks in Components

Here's an example of how to use the React Query hooks in components:

```tsx
import React from 'react';
import { useExamDetail, useExamQuestions } from '../../api/hooks';

interface ExamDetailsProps {
  examId: number;
}

export const ExamDetails: React.FC<ExamDetailsProps> = ({ examId }) => {
  // Use hooks to fetch data
  const { 
    data: exam,
    isLoading: isExamLoading,
    error: examError
  } = useExamDetail(examId);
  
  const {
    data: questions,
    isLoading: isQuestionsLoading,
    error: questionsError
  } = useExamQuestions(examId);
  
  // Loading state
  if (isExamLoading || isQuestionsLoading) {
    return <div>Loading...</div>;
  }
  
  // Error state
  if (examError || questionsError) {
    return <div>Error: {examError?.message || questionsError?.message}</div>;
  }
  
  // No data
  if (!exam) {
    return <div>Exam not found</div>;
  }
  
  // Render component
  return (
    <div>
      <h1>{exam.title}</h1>
      <p>{exam.description}</p>
      
      <h2>Questions ({questions?.length || 0})</h2>
      {questions && questions.length > 0 ? (
        <ul>
          {questions.map(question => (
            <li key={question.id}>{question.text}</li>
          ))}
        </ul>
      ) : (
        <p>No questions found</p>
      )}
    </div>
  );
};

export default ExamDetails;
```

## Conclusion

By following this guide, you will have a robust API integration layer for the exams feature. The key benefits of this approach are:

1. **Clear Separation of Concerns**: API logic is separated from UI and business logic
2. **Type Safety**: All API interactions are properly typed
3. **Consistent Error Handling**: Errors are handled consistently across the application
4. **Efficient Caching**: TanStack Query provides efficient caching and data synchronization
5. **Simplified Testing**: The API layer can be easily mocked for testing
6. **Improved Developer Experience**: Clear patterns and abstractions make the code more maintainable

This implementation follows best practices for API integration and provides a solid foundation for the rest of the refactoring.
