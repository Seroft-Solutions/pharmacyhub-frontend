/**
 * Data Transfer Objects for exam-related API operations
 */

import { Exam, Question, ExamStatus, QuestionType } from '../models/exam';

/**
 * DTO for creating a new exam
 */
export interface ExamCreateDto {
  title: string;
  description?: string;
  timeLimit: number;
  passingScore: number;
  status: ExamStatus;
  isPremium?: boolean;
  price?: number;
}

/**
 * DTO for updating an existing exam
 */
export interface ExamUpdateDto {
  title?: string;
  description?: string;
  timeLimit?: number;
  passingScore?: number;
  status?: ExamStatus;
  isPremium?: boolean;
  price?: number;
}

/**
 * DTO for creating a new question
 */
export interface QuestionCreateDto {
  examId: number;
  text: string;
  type: QuestionType;
  orderIndex?: number;
  pointValue: number;
  explanation?: string;
  options?: {
    text: string;
    isCorrect?: boolean;
  }[];
  correctAnswers?: string[];
}

/**
 * DTO for updating an existing question
 */
export interface QuestionUpdateDto {
  text?: string;
  type?: QuestionType;
  orderIndex?: number;
  pointValue?: number;
  explanation?: string;
  options?: {
    id?: string;
    text: string;
    isCorrect?: boolean;
  }[];
  correctAnswers?: string[];
}

/**
 * DTO for submitting an exam attempt
 */
export interface ExamSubmissionDto {
  examId: number;
  answers: Record<number, {
    questionId: number;
    selectedOptions?: string[];
    textAnswer?: string;
  }>;
  timeSpent: number; // in seconds
}

/**
 * Generic paginated response DTO
 */
export interface PaginatedResponseDto<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Type mapping functions
 */

/**
 * Maps a raw exam DTO from the API to the domain model
 */
export function mapExamDtoToModel(dto: any): Exam {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    timeLimit: dto.timeLimit,
    passingScore: dto.passingScore,
    status: dto.status,
    isPremium: dto.isPremium || false,
    price: dto.price,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    publishedAt: dto.publishedAt,
    questionCount: dto.questionCount || 0,
  };
}

/**
 * Maps a raw question DTO from the API to the domain model
 */
export function mapQuestionDtoToModel(dto: any): Question {
  return {
    id: dto.id,
    examId: dto.examId,
    text: dto.text,
    type: dto.type,
    orderIndex: dto.orderIndex,
    pointValue: dto.pointValue,
    explanation: dto.explanation,
    options: dto.options?.map((opt: any) => ({
      id: opt.id,
      text: opt.text,
      isCorrect: opt.isCorrect,
    })),
    correctAnswers: dto.correctAnswers,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
