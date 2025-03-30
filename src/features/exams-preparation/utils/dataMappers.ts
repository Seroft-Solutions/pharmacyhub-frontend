/**
 * Data Mapper Utilities
 * 
 * This module provides utilities for mapping between API data structures
 * and internal domain models for the exams preparation feature.
 */

import {
  Exam,
  Question,
  QuestionOption,
  ExamAttempt,
  ExamResult
} from '../types/models/exam';

import {
  ExamPaperResponse,
  AttemptResponseDto,
  ExamResultResponseDto,
  QuestionResultDto
} from '../types/api/api-types';

import { PaymentStatus } from '../types/api/enums';

/**
 * Map an API exam paper response to a domain Exam object
 * 
 * @param response The API response object
 * @returns A domain Exam object
 */
export function mapExamResponseToExam(response: ExamPaperResponse): Exam {
  return {
    id: Number(response.id),
    title: response.title,
    description: response.description,
    timeLimit: response.durationMinutes,
    passingScore: 70, // Default passing score if not provided
    status: 'published',
    isPremium: response.premium,
    price: response.price,
    createdAt: new Date(response.lastUpdatedDate).toISOString(),
    updatedAt: new Date(response.lastUpdatedDate).toISOString(),
    questionCount: response.questionCount,
    // Derive payment status
    paymentStatus: response.paymentStatus === PaymentStatus.PAID || !response.premium
  };
}

/**
 * Map an API attempt response to a domain ExamAttempt object
 * 
 * @param response The API response object
 * @returns A domain ExamAttempt object
 */
export function mapAttemptResponseToAttempt(response: AttemptResponseDto): ExamAttempt {
  // Initialize answers map
  const answers: Record<number, {
    questionId: number;
    selectedOptions?: string[];
    textAnswer?: string;
    isCorrect?: boolean;
    pointsAwarded?: number;
  }> = {};
  
  // Map answers if available
  if (response.answers) {
    Object.entries(response.answers).forEach(([questionId, answer]) => {
      answers[Number(questionId)] = {
        questionId: Number(questionId),
        selectedOptions: answer.selectedOptions,
        textAnswer: answer.textAnswer,
        isCorrect: answer.isCorrect,
        pointsAwarded: answer.pointsAwarded
      };
    });
  }
  
  return {
    id: response.id,
    examId: response.examId,
    userId: response.userId,
    startedAt: response.startedAt,
    completedAt: response.completedAt,
    timeSpent: calculateTimeSpent(response.startedAt, response.completedAt),
    score: response.score,
    percentage: response.percentage,
    passed: response.passed,
    answers
  };
}

/**
 * Map an API result response to a domain ExamResult object
 * 
 * @param response The API response object
 * @returns A domain ExamResult object
 */
export function mapResultResponseToResult(response: ExamResultResponseDto): ExamResult {
  return {
    attemptId: response.attemptId,
    examId: response.examId,
    userId: response.userId,
    totalQuestions: response.totalQuestions,
    answeredQuestions: response.answeredQuestions,
    correctAnswers: response.correctAnswers,
    score: response.score,
    percentage: response.percentage,
    passed: response.passed,
    timeSpent: response.timeSpent,
    completedAt: response.completedAt,
    feedback: response.feedback
  };
}

/**
 * Calculate time spent between two dates in seconds
 * 
 * @param startTime Start time ISO string
 * @param endTime End time ISO string or undefined
 * @returns Time spent in seconds
 */
function calculateTimeSpent(startTime: string, endTime?: string): number {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : Date.now();
  return Math.round((end - start) / 1000);
}

/**
 * Map answer data from a question for display
 * 
 * @param question Question object
 * @returns Mapped options with labels
 */
export function mapQuestionOptionsForDisplay(question: Question): {
  id: string;
  text: string;
  label: string;
  isCorrect: boolean;
}[] {
  if (!question.options) return [];
  
  return question.options.map((option, index) => ({
    id: option.id || String(index),
    text: option.text,
    label: String.fromCharCode(65 + index), // A, B, C, D...
    isCorrect: option.isCorrect || false
  }));
}
