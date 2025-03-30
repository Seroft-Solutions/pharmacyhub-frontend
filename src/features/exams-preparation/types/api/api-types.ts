/**
 * API and hook types for exams feature
 */

import { Exam, Question, ExamAttempt, ExamResult } from '../models/exam';
import { 
  ExamCreateDto, 
  ExamUpdateDto, 
  QuestionCreateDto, 
  QuestionUpdateDto,
  ExamSubmissionDto,
  PaginatedResponseDto 
} from '../dtos/exam-dtos';

/**
 * API client interface
 */
export interface ExamApiClient {
  getExams(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponseDto<Exam>>;
  
  getExam(examId: number): Promise<Exam>;
  
  createExam(data: ExamCreateDto): Promise<Exam>;
  
  updateExam(examId: number, data: ExamUpdateDto): Promise<Exam>;
  
  deleteExam(examId: number): Promise<void>;
  
  getQuestions(examId: number): Promise<Question[]>;
  
  getQuestion(questionId: number): Promise<Question>;
  
  createQuestion(data: QuestionCreateDto): Promise<Question>;
  
  updateQuestion(questionId: number, data: QuestionUpdateDto): Promise<Question>;
  
  deleteQuestion(questionId: number): Promise<void>;
  
  startExam(examId: number): Promise<ExamAttempt>;
  
  submitExam(data: ExamSubmissionDto): Promise<ExamResult>;
  
  getAttempt(attemptId: string): Promise<ExamAttempt>;
  
  getResult(attemptId: string): Promise<ExamResult>;
}

/**
 * Query hook types
 */
export interface UseExamsQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  enabled?: boolean;
}

export interface UseExamQueryOptions {
  enabled?: boolean;
  onSuccess?: (data: Exam) => void;
  onError?: (error: Error) => void;
}

export interface UseQuestionsQueryOptions {
  examId: number;
  enabled?: boolean;
  onSuccess?: (data: Question[]) => void;
  onError?: (error: Error) => void;
}

export interface UseExamAttemptOptions {
  attemptId: string;
  enabled?: boolean;
  onSuccess?: (data: ExamAttempt) => void;
  onError?: (error: Error) => void;
}

export interface UseExamResultOptions {
  attemptId: string;
  enabled?: boolean;
  onSuccess?: (data: ExamResult) => void;
  onError?: (error: Error) => void;
}

/**
 * Error types
 */
export type ApiErrorResponse = {
  status: number;
  message: string;
  data?: any;
  fieldErrors?: Record<string, string[]>;
};

export class ExamApiError extends Error {
  status: number;
  data?: any;
  fieldErrors?: Record<string, string[]>;
  
  constructor(error: ApiErrorResponse) {
    super(error.message);
    this.name = 'ExamApiError';
    this.status = error.status;
    this.data = error.data;
    this.fieldErrors = error.fieldErrors;
  }
}
